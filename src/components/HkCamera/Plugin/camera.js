import CommunicateWidthIframe from './communicate'
import { pending } from './utils'
import { reactive, watch } from 'vue'

// interface 
export default class Camera {
    reactiveData = reactive({
        recordStatus: 'stoped',  // prccessing, recording, stoped
        playStatus: 'stoped', // prccessing, playing, stoped
        iPTZSpeed: 4
    })
    equipment = null
    iWndIndex = null;
    constructor({ channel, equipment, data }) {
        this.channel = channel
        this.iStreamType = 2;
        this.bZeroChannel = false;
        this.equipment = equipment
        this.id = `${this.equipment.ip}_${this.equipment.port}_${channel}`
        this.data = data
    }

    setIWndIndex(iWndIndex) {
        this.iWndIndex = iWndIndex
    }

    startRealPlay({ iWndIndex = null }) {
        return new Promise(async (resolve, reject) => {
            let szInfo = `camera (${this.equipment.ip} ${this.channel} ${iWndIndex}) startRealPlay:`;
            try {
                if (![null, undefined].includes(iWndIndex) && iWndIndex != this.iWndIndex) {
                    if (this.iWndIndex !== null) {
                        await this.stopPlay()
                        await pending(1000)
                    }
                    this.iWndIndex = iWndIndex
                }

                if (this.reactiveData.playStatus == 'playing') {
                    szInfo = szInfo + '已预览中'
                    return reject(szInfo)
                }
                if (this.reactiveData.playStatus == 'prccessing') {
                    szInfo = szInfo + '加载中'
                    return reject(szInfo)
                }
                this.reactiveData.playStatus = 'prccessing'

                // 判断设备是否登录过
                if (this.equipment.loginStatus !== 'succeed') {
                    await this.equipment.asyncLogin();
                } else {
                    // console.log('设备已经登录过')
                }
                await this.I_Stop(this.iWndIndex)
                await pending(500)
                await CommunicateWidthIframe.p_connect({
                    connectType: 'I_StartRealPlay', params: {
                        ip: this.equipment.ip,
                        iWndIndex: this.iWndIndex,
                        iStreamType: this.iStreamType,
                        iChannelID: this.channel,
                        bZeroChannel: this.bZeroChannel
                    },
                })
                this.reactiveData.playStatus = 'playing'
                szInfo = szInfo + '开始预览成功！'
                resolve(szInfo)
            } catch (error) {
                if (error.errorCode == 3001) {
                    console.log(`${szInfo} '重新加载'`)
                    this.reactiveData.playStatus = 'stoped'
                    const res = this.startRealPlay({ iWndIndex })
                    resolve(res)
                } else {
                    console.error()
                    szInfo = szInfo + '开始预览失败！' + JSON.stringify(error)
                    reject(szInfo)
                }
            } finally {
                console.log(szInfo)
            }
        })
    };

    // 检查播放状态
    I_Stop(iWndIndex) {
        return new Promise(async (resolve, reject) => {
            let szInfo = `camera (${this.equipment.ip} ${this.channel} ${iWndIndex}) I_Stop:`;
            try {
                const oWndInfo = await CommunicateWidthIframe.connect({ connectType: 'I_GetWindowStatus', params: { iWndIndex } })
                if (oWndInfo == null) {
                    szInfo = szInfo + "未在播放"
                    return resolve(szInfo)
                }
                await CommunicateWidthIframe.connect({ connectType: 'I_Stop', params: { iWndIndex } })
                szInfo = szInfo + '停止播放成功'
                resolve(true)
            } catch (error) {
                szInfo = szInfo + '停止播失败' + error
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    async stopPlay() {
        return new Promise(async (resolve, reject) => {
            let szInfo = `camera (${this.equipment.ip} ${this.channel} ${this.iWndIndex}) stopPlay:`;
            try {
                if (this.reactiveData.playStatus == 'prccessing') {
                    szInfo = szInfo + '加载中'
                    return reject(szInfo)
                }
                this.reactiveData.playStatus == 'processing'

                if (this.iWndIndex == null) {
                    szInfo = szInfo + '未在播放'
                    this.reactiveData.playStatus = 'stoped'
                    return resolve(szInfo)
                }

                await this.I_Stop(this.iWndIndex)
                this.reactiveData.playStatus = 'stoped'
                szInfo = szInfo + '停止播放成功'
                return resolve(true)
            } catch (error) {
                szInfo = szInfo + '停止播失败' + error
                reject(szInfo)
            } finally {

                console.log(szInfo)
            }
        })
    }

    stopPlayAndClear = async () => {
        return this.stopPlay().then(res => {
            this.iWndIndex = null
            return res
        })
    }

    startOrEndRecord = async () => {
        return new Promise(async (resolve, reject) => {
            let szInfo = `camera (${this.equipment.ip} ${this.channel} ${this.iWndIndex}) startRecord:`;
            if (this.reactiveData.recordStatus == 'processing') {
                szInfo = szInfo + '录像中'
                reject(szInfo)
            }
            try {
                let res = null;
                if (this.reactiveData.recordStatus == 'stoped') {
                    this.reactiveData.recordStatus = 'processing'
                    res = await CommunicateWidthIframe.connect({ connectType: 'startRecord' })
                    this.reactiveData.recordStatus = 'recording'
                    szInfo = szInfo + '开始录像成功'
                } else if (this.reactiveData.recordStatus == 'recording') {
                    this.reactiveData.recordStatus = 'processing'
                    res = await CommunicateWidthIframe.connect({ connectType: 'endRecord' })
                    this.reactiveData.recordStatus = 'stoped'
                    szInfo = szInfo + '结束录像成功'
                }
                resolve(res)
            } catch (error) {
                szInfo = szInfo + '开始录像失败' + error
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    startOrEndPlay = async () => {
        return new Promise(async (resolve, reject) => {
            let szInfo = `camera (${this.equipment.ip} ${this.channel} ${this.iWndIndex}) startOrEndPlay:`;
            try {
                let res = null;
                if (this.reactiveData.playStatus == 'stoped') {
                    await this.startRealPlay({ iWndIndex: null })
                } else if (this.reactiveData.playStatus == 'playing') {
                    await this.stopPlay()
                }
                resolve(res)
            } catch (error) {
                console.log(error)
                szInfo = szInfo + '失败-' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }
    startPlayBack = async ([startTime, endTime]) => {
        return new Promise(async (resolve, reject) => {
            let szInfo = `camera (${this.equipment.ip} ${this.channel} ${this.iWndIndex}) startPlayBack:`;
            try {
                const res = await CommunicateWidthIframe.connect({
                    connectType: 'I_StartPlayback',
                    params: { szDeviceIdentify: `${this.equipment.ip}_${this.equipment.port}`, options: { iWndIndex: this.iWndIndex, szStartTime: startTime, szEndTime: endTime, iChannelID: this.channel, iStreamType: 1 } }
                })
                resolve(res)
            } catch (error) {
                console.log(error)
                szInfo = szInfo + '失败-' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    capturePicture = async () => {
        return new Promise(async (resolve, reject) => {
            let szInfo = `camera (${this.equipment.ip} ${this.channel} ${this.iWndIndex}) capturePicture:`;
            try {
                const res = await CommunicateWidthIframe.connect({ connectType: 'I_CapturePic', params: { filename: `${new Date().getTime()}`, options: { bDateDir: true } } })
                szInfo = szInfo + '成功'
                resolve(true)
            } catch (error) {
                szInfo = szInfo + '失败' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    PTZControl = async ({ iPTZIndex, bStop = false, iPTZSpeed = 4 }) => {
        return new Promise(async (resolve, reject) => {
            let szInfo = `camera (${this.equipment.ip} ${this.channel} ${this.iWndIndex}) PTZControl:`;
            try {
                const res = await CommunicateWidthIframe.connect({ connectType: 'I_PTZControl', params: { iPTZIndex, bStop, options: { iPTZSpeed: this.reactiveData.iPTZSpeed } } })
                szInfo = szInfo + '成功'
                resolve(true)
            } catch (error) {
                szInfo = szInfo + '失败' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    goPreset = async (iPresetID) => {
        return new Promise(async (resolve, reject) => {
            let szInfo = `camera (${this.equipment.ip} ${this.channel} ${this.iWndIndex}) goPreset:`;
            try {
                const res = await CommunicateWidthIframe.connect({ connectType: 'I_GoPreset', params: { iPresetID } })
                szInfo = szInfo + '成功'
                resolve(true)
            } catch (error) {
                szInfo = szInfo + '失败' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }


    setPreset = async (iPresetID) => {
        return new Promise(async (resolve, reject) => {
            let szInfo = `camera (${this.equipment.ip} ${this.channel} ${this.iWndIndex}) setPreset:`;
            try {
                await CommunicateWidthIframe.connect({ connectType: 'I_SetPreset', params: { iPresetID } })
                szInfo = szInfo + '成功'
                resolve(true)
            } catch (error) {
                szInfo = szInfo + '失败' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    playFast = async () => {
        return new Promise(async (resolve, reject) => {
            let szInfo = `camera (${this.equipment.ip} ${this.channel} ${this.iWndIndex}) playFast:`;
            try {
                await CommunicateWidthIframe.connect({ connectType: 'I_PlayFast' })
                szInfo = szInfo + '成功'
                resolve(true)
            } catch (error) {
                szInfo = szInfo + '失败' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    playSlow = async () => {
        return new Promise(async (resolve, reject) => {
            let szInfo = `camera (${this.equipment.ip} ${this.channel} ${this.iWndIndex}) playSlow:`;
            try {
                await CommunicateWidthIframe.connect({ connectType: 'I_PlaySlow' })
                szInfo = szInfo + '成功'
                resolve(true)
            } catch (error) {
                szInfo = szInfo + '失败' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

}
