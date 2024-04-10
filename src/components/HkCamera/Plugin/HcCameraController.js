
import Equipment from './equipment';
import CommunicateWidthIframe from './communicate'
import { reactive, watch } from 'vue'
import { pending } from './utils'
import Camera from './camera';

export default class HcCameraController {
    // 设备列表
    equipmentList = [];

    // 播放列表
    reactiveData = reactive({
        pageIndex: 1,
        pageSize: 4,
        total: 0,
        searchParams: {
            robotcode: ''
        },
        cameraList: [],
        cameraListData: [],
        pagingStatus: 'succeed',  // succeed failed, loading;
        g_iWndIndex: 0,
        pluginCfg: {
            recordPath: 'recordPath',
            capturePath: 'capturePath'
        },
        choosedCamrea: null,
        playAllTaggle: 'played', // closing closed 
    })

    // 通信封装
    communicate = null;

    // 窗口类型
    iWndowType = 1

    getList = async (reactiveData) => {
        const { pageIndex, pageSize, cameraListData } = reactiveData
        const start = ((pageIndex - 1) * pageSize)
        const end = pageIndex * pageSize
        const cameraPlayListData = cameraListData.slice(start, end);
        return { playList: cameraPlayListData, total: cameraListData.length }
    }

    // 直接设置
    constructor({ ele }) {
        if (ele) {
            this.ele = ele
            CommunicateWidthIframe.initCommunicate({ iframeId: ele })
        }

        this.initListener()
    }


    handleSearch() { }

    initListener() {
        window.addEventListener('message', (event) => {
            const { contentType, params } = event.data
            if (contentType && contentType == 'g_iWndIndex') {
                this.reactiveData.g_iWndIndex = params.g_iWndIndex
            }
        })

        watch(
            () => ([this.reactiveData.cameraList, this.reactiveData.g_iWndIndex]),
            ([cameraList, g_iWndIndex]) => {
                console.log('asfdsdf')
                if (!cameraList.length) return;
                if (!this.reactiveData.choosedCamrea) {
                    this.reactiveData.choosedCamrea = cameraList[g_iWndIndex]
                } else {
                    const index = cameraList.indexOf(this.reactiveData.choosedCamrea)
                    if (index != g_iWndIndex) {
                        this.reactiveData.choosedCamrea = cameraList[g_iWndIndex]
                    }
                }

            },
            { immediate: true, deep: true },
        )
    }

    // 初始化插件
    initPlugin = async () => CommunicateWidthIframe.connect({ connectType: 'initPlugin' })

    // equipments [{ ip, port, username, password, data }]
    // cameras [{ ip, port, username, password, data, channel }]
    setOptions({ equipments, cameras, getList }) {
        // 设置设备表
        if (equipments) {
            this.equipmentList = equipments.reduce((pre, cur) => {
                let { ip, port, username, password, data } = cur;
                let newQuip = new Equipment({ ip, port, username, password, data })
                pre.push(newQuip)
                return pre;
            }, [])
        }

        // 设置相机
        if (cameras) {
            this.reactiveData.cameraListData = cameras
        }

        if (getList) {
            this.getList = getList
        }
    }

    async getCameraByEquipment() {
        for (const equipment of this.equipmentList) {
            const cameras = await equipment.getCameras()
            // 获取完成后塞入相机列表
            this.reactiveData.cameraListData = [...this.reactiveData.cameraListData, ...cameras]
            // 开始播放
            await this.startPlayCameraList()
        }
    }


    /// 相机开始播放
    startPlayCameraList = async () => {
        const { playList: newPlayListData, total } = await this.getList(this.reactiveData)

        // 设置总的播放个数
        this.reactiveData.total = total

        // 生成要关闭的列表
        let endPlayCameras = this.reactiveData.cameraList.filter(camera => {
            let newPlayItem = newPlayListData.find(({ ip, port, channel }, iWndIndex) => {
                return (camera.equipment.ip == ip &&
                    camera.equipment.port == port &&
                    camera.channel == channel &&
                    camera.iWndIndex == iWndIndex)
            })
            return newPlayItem == null ? true : false;
        })
        console.log('endPlayCamera>>>>>>', endPlayCameras)
        const endFuns = endPlayCameras.map((item) => item.stopPlayAndClear())
        await Promise.allSettled(endFuns)

        // 获取将要播放的列表
        let newCameraList = [];
        newPlayListData.forEach((cameraData, iWndIndex) => {
            let playedCamera = this.reactiveData.cameraList.find((camera) => {
                return (camera.equipment.ip == cameraData.ip &&
                    camera.equipment.port == cameraData.port &&
                    camera.channel == cameraData.channel &&
                    camera.iWndIndex == iWndIndex)
            })

            if (!playedCamera) {
                // 检查是否存在equipment
                let equipment = this.equipmentList.find(equip => equip.ip === cameraData.ip && equip.port === cameraData.port)
                let { ip, port, username, password, data } = cameraData
                if (!equipment) {
                    equipment = new Equipment({ ip, port, username, password, data })
                    this.equipmentList.push(equipment)
                }
                playedCamera = new Camera({ channel: cameraData.channel, equipment, data })
            }
            newCameraList.push(playedCamera)
        })
        console.log('startPlayCamera>>>>>>', newCameraList, 'newCameraList', newCameraList)
        const startFuns = newCameraList.map((item, index) => item.startRealPlay({ iWndIndex: index }))
        this.reactiveData.cameraList = newCameraList
        await Promise.allSettled(startFuns)
        return true
    }

    /// 固定列表分页
    handleSizePageChange = async ({ pageIndex, pageSize }) => {
        try {
            console.log('handleSizePageChange>>>', pageIndex, pageSize)
            if (pageSize && pageSize != this.reactiveData.pageSize) {
                this.reactiveData.pageSize = pageSize
            }

            if (pageIndex && pageIndex != this.reactiveData.pageIndex) {
                this.reactiveData.pageIndex = pageIndex
            }

            if (this.reactiveData.pagingStatus == 'loading') {
                return
            }
            this.reactiveData.pagingStatus = 'loading';

            const curIWndowType = Math.sqrt(this.reactiveData.pageSize)
            // 增加行数
            if (this.iWndowType < curIWndowType) {
                await this.changeWndNum(curIWndowType)
                await pending(1000)
            }

            // await this.constantList_cameraListStartRealPlay()
            await this.startPlayCameraList()

            // 减少行数
            if (this.iWndowType > curIWndowType) {
                await this.changeWndNum(curIWndowType)
            }
            console.log('handleSizePageChange>>>> succcess')
            this.reactiveData.pagingStatus = 'succeed'
        } catch (error) {
            console.error('handleSizePageChange>>>', error)
            this.reactiveData.pagingStatus = 'fail'
        }
    }

    // 设置插件的大小
    resize = async (data) => CommunicateWidthIframe.connect({ connectType: 'resize', params: data })

    // 窗口分割数
    changeWndNum(iType) {
        return new Promise(async (resolve, reject) => {
            let szInfo = "窗口分割：";
            try {
                const res = await CommunicateWidthIframe.connect({ connectType: 'changeWndNum', params: { iType } })
                szInfo = szInfo + '成功'
                this.iWndowType = iType
                resolve(res)
            } catch (error) {
                szInfo = szInfo + '失败' + error
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    // 播放窗口和页码等
    async setWnd(iWndowType) {
        this.reactiveData.pageSize = iWndowType * iWndowType
        return this.changeWndNum(iWndowType)
    }

    async getPluginCfg() {
        return new Promise(async (resolve, reject) => {
            let szInfo = "获取插件参数：";
            try {
                const res = await CommunicateWidthIframe.connect({ connectType: 'I_GetLocalCfg' })
                szInfo = szInfo + '成功'
                this.reactiveData.pluginCfg.recordPath = res.recordPath
                this.reactiveData.pluginCfg.capturePath = res.capturePath
                resolve(res)
            } catch (error) {
                szInfo = szInfo + '失败' + error
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    // 打开文件选择框
    async openPluginDir() {
        return new Promise(async (resolve, reject) => {
            let szInfo = "打开文件夹选择器：";
            try {
                const res = await CommunicateWidthIframe.connect({ connectType: 'I_OpenFileDlg', params: { iType: 0 } })
                if (res) {
                    szInfo = szInfo + '成功'
                    resolve(res)
                } else {
                    szInfo = szInfo + '失败- 没有选择'
                    reject(szInfo)
                }
            } catch (error) {
                szInfo = szInfo + '失败' + error
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    // 设置参数
    async setPluginCfg(params) {
        return new Promise(async (resolve, reject) => {
            let szInfo = "设置插件参数：";
            try {
                const res = await CommunicateWidthIframe.connect({ connectType: 'I_SetLocalCfg', params })
                szInfo = szInfo + '成功'
                resolve(res)
            } catch (error) {
                szInfo = szInfo + '失败' + error
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    async stopOrStartAllPlay() {
        return new Promise(async (resolve, reject) => {
            let szInfo = "开始停止或播放所有预览:";
            if (this.reactiveData.playAllTaggle == 'closing') {
                szInfo = szInfo + '关闭中'
                return reject(szInfo)
            }
            try {
                const operateCameraList = this.reactiveData.cameraList.filter(item => item.iWndIndex != null)
                if (this.reactiveData.playAllTaggle == 'played') {
                    this.reactiveData.playAllTaggle = 'closing'
                    let queue = operateCameraList.map(item => item.stopPlay())
                    await Promise.allSettled(queue)
                    this.reactiveData.playAllTaggle = 'closed'
                    szInfo = szInfo + '关闭成功'
                    return resolve(szInfo)
                } else if (this.reactiveData.playAllTaggle == 'closed') {
                    this.reactiveData.playAllTaggle = 'closing'
                    let queue = operateCameraList.map(item => item.startRealPlay({ iWndIndex: null }))
                    await Promise.allSettled(queue)
                    this.reactiveData.playAllTaggle = 'played'
                    szInfo = szInfo + '打开成功'
                    return resolve(szInfo)
                }

            } catch (error) {
                szInfo = szInfo + '失败:' + error
                return reject(szInfo)
            } finally {
                console.info(szInfo)
            }
        })
    }

    // 启用多边形绘制
    async enableDraw() {
        return new Promise(async (resolve, reject) => {
            let szInfo = "启用多边形绘制：";
            try {
                const res = await CommunicateWidthIframe.connect({ connectType: 'I_SetPlayModeType' })
                szInfo = szInfo + '成功'
                resolve(res)
            } catch (error) {
                szInfo = szInfo + '失败' + error
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    // 关闭多边形绘制
    async disableDraw() {
        return new Promise(async (resolve, reject) => {
            let szInfo = "关闭多边形绘制：";
            try {
                const res = await CommunicateWidthIframe.connect({ connectType: 'I_SetSnapDrawMode' })
                szInfo = szInfo + '成功'
                resolve(res)
            } catch (error) {
                szInfo = szInfo + '失败' + error
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    async AddSnapPolygon(params) {
        return new Promise(async (resolve, reject) => {
            let szInfo = "开始形绘制：";
            try {
                const res = await CommunicateWidthIframe.connect({ connectType: 'AddSnapPolygon', params })
                szInfo = szInfo + '成功'
                resolve(res)
            } catch (error) {
                szInfo = szInfo + '失败' + error
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    // 获取形绘数据：
    async I_GetSnapPolygonInfo(params) {
        return new Promise(async (resolve, reject) => {
            let szInfo = "获取形绘数据：";
            try {
                const res = await CommunicateWidthIframe.connect({ connectType: 'I_GetSnapPolygonInfo', params })
                szInfo = szInfo + '成功'
                resolve(res)
            } catch (error) {
                szInfo = szInfo + '失败' + error
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    // 获取形绘数据：
    async I_PlayFast(params) {
        return new Promise(async (resolve, reject) => {
            let szInfo = "播放速度加快：";
            try {
                const res = await CommunicateWidthIframe.connect({ connectType: 'I_PlayFast', params })
                szInfo = szInfo + '成功'
                resolve(res)
            } catch (error) {
                szInfo = szInfo + '失败' + error
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    async I_PlaySlow(params) {
        return new Promise(async (resolve, reject) => {
            let szInfo = "播放速度加慢：";
            try {
                const res = await CommunicateWidthIframe.connect({ connectType: 'I_PlaySlow', params })
                szInfo = szInfo + '成功'
                resolve(res)
            } catch (error) {
                szInfo = szInfo + '失败' + error
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    // 清空所有
    async clear() {
        this.reactiveData.cameraList = [];
        this.reactiveData.cameraListData = [];
        this.equipmentList = [];
    }
}




