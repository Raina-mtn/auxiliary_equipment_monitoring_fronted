import { getAssetsImge } from '@/utils/index'

export const todoConfig = [
    { url: getAssetsImge('icon_warn.png'), key: 'warnNum', name: '今日预警' },
    { url: getAssetsImge('icon_done.png'), key: 'handleWarnNum', name: '今日处理' },
    { url: getAssetsImge('icon_todo.png'), key: 'unHandleWarnNum', name: '今日待处理' },
]

const checkObj = {
    0: '待审核',
    1: '已审核'
}

export const alarmConfig = [
    { label: "区域:", key: "areaName" },
    { label: "点位:", key: "pointName" },
    { label: "审核状态:", key: "checkStatus", transObj: checkObj },
    { label: "告警时间:", key: "warnTime", 'width': 240 },
]
export const columns = []