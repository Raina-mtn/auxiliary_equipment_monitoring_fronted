import { defineStore } from "pinia";
import { connectWebSocket, onWebSocket } from '@/utils/core/useWebSocket';
import { ElNotification, ElMessage } from 'element-plus'
import { isEqual } from "lodash-es";
import { getAssetsImge } from "@/utils";




const VITE_GLOB_DOMAIN_URL = import.meta.env.VITE_GLOB_DOMAIN_URL
const wsUrl = `ws://${VITE_GLOB_DOMAIN_URL}/ws`

const WARN_INFO_CODE = '1001' // 告警信息
const LINKAGE_CONFIRM_CODE = '1002' // 联动确认
const CAMERA_INFO_CODE = '1003'  // 视频弹窗信息
const LINKAGE_INFO_CODE = '1004' // 联动信息记录
const WARN_DURATION_TIME = 8000
export const wsStore = defineStore({
    id: 'ws', // 必须指明唯一的pinia仓库的id
    state: () => ({
        websocket: '',
        warnList: [] as any[],
        currentWarnInfo: {}, // 当前推送的报警信息
        refreshFlag: false, // 有新消息通知时要刷新首页和告警中心列表
        showAlarm: false,
        timer: '' as any,
        linkageInfo: {} as any,// 联动信息
        linkageDialogVisible: false, // 联动弹窗
        cameraDialogVisible: false, // 视频监控弹窗
        cameraInfo: {} as any,
    }),
    actions: {
        initWs() {
            this.websocket = connectWebSocket(wsUrl)
            // @ts-ignore
            onWebSocket(this.onWebSocketMessage)
        },
        onWebSocketMessage(msg: { detail: string, data: any }) {
            console.log('>>>>>>', msg);

            if (msg.detail === WARN_INFO_CODE) { // 报警
                this.currentWarnInfo = msg.data
                this.warnList.push(msg.data)
                this.showNoticefy(msg.data)
                this.refreshFlag = true
                this.showAlarm = true
                clearTimeout(this.timer)
                this.countTime()
            }
            // {
            //     "equipmentCode": "SmartCard",
            //     "lineName": "rongyu-1",
            //     "linkageEventCode": "E00708",
            //     "equipmentId": 18,
            //     "areaName": "新城变",
            //     "equipmentName": "声卡传感器",
            //     "linkageInstruction": "OPEN"
            // }
            if (msg.detail === LINKAGE_CONFIRM_CODE) { // 联动确认
                this.linkageDialogVisible = true
                this.linkageInfo = msg.data
            }

            if (msg.detail === CAMERA_INFO_CODE) { // 视频信息
                this.cameraDialogVisible = true
                this.cameraInfo = msg.data
            }
            if (msg.detail === LINKAGE_INFO_CODE) {
                if (msg.data.linkageResult === 'FAILED') {
                    ElMessage.error(`${msg.data.linkageEquipmentName}状态为：已${msg.data.controlStatus === 'OPEN' ? '开启' : '关闭'}! 联动失败!`)
                } else {
                    ElMessage.success(`${msg.data.linkageEquipmentName}状态为：已${msg.data.controlStatus === 'OPEN' ? '开启' : '关闭'}! 联动成功!`)
                }
            }

        },
        // 告警
        showNoticefy(warnObj: any) {
            ElNotification({
                title: `${warnObj.categoryName}`,
                dangerouslyUseHTMLString: true,
                position: 'bottom-left',
                duration: WARN_DURATION_TIME, //8s后主动关闭
                message: `<div class="content">
                          <div>
                            <img src="${getAssetsImge('warnImg.png')}" alt="" style="width: 100px; height: 100px;">
                          </div>
                          <div class="desc">
                            <p>区域：${warnObj.areaName}</p>
                            <p>点位：${warnObj.lineName}</p>
                            <p>预警等级：${warnObj.warnLevelName}</p>
                            <p>告警时间：${warnObj.warnTime}</p>
                        </div>
                    </div>`,
                onClose: () => {
                    const index = this.warnList.findIndex(v => isEqual(v, warnObj))
                    if (index) {
                        this.warnList.splice(index, 1)
                    }
                    if (this.warnList.length < 2) {
                        this.showAlarm = false; clearTimeout(this.timer)
                    }
                }
            })
        },
        setRefreshFlag(flag: boolean) {
            this.refreshFlag = flag
        },
        closeCameraDialog() {
            this.cameraDialogVisible = false
        },
        closeLinkageDialog() {
            this.linkageDialogVisible = false

        },
        // 报警弹窗8s后关闭
        countTime() {
            this.timer = setTimeout(() => {
                this.showAlarm = false
            }, WARN_DURATION_TIME + 1000) // ElNotification的打开动画有1s延时，所以这里退出加1s
        }
    },
})
