import { defHttp } from '@/api/http'

// 获取设备告警事件列表
export const apiGetConfig = (params: object) => {
    return defHttp.post({
        url: '/storage-config/get',
        params
    })
}

// 获取设备告警事件列表
export const apiSetConfig = (params: object) => {
    return defHttp.post({
        url: '/storage-config/update',
        params
    })
}