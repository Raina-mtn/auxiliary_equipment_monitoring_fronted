import { defHttp } from '@/api/http'

//分页获取告警记录列表
export const apiGetTaskList = (params?: any) => {
    return defHttp.post({
        url: "/warnRecord/listWarnRecord",
        params
    }
    );
};
//告警记录审核
export const apiCheckTask = (params?:any) => {
    return defHttp.post({
        url:"/warnRecord/checkWarnRecord",
        params
    })
}
//告警记录批量删除
export const apiDeleteTask = (params?:any) => {
    return defHttp.post({
        url:"/warnRecord/batchDelete",
        params
    })
}
//导出接口
export const apiExportTask = (params?:any) => {
    return defHttp.post({
        responseType:'blob',
        url:"/warnRecord/export",
        params,
        
    },{isTransformResponse: false})
}
//根据id查询告警记录详情
export const apiGetTaskById = (params?:any) => {
    return defHttp.post({
        url:"/warnRecord/queryInfoById",
        params
    })
}

//根据点位id获取点位下第一个视频信息
export const apiGetFirstInfo = (params?:any) => {
    return defHttp.get({
        url:`/streaming/real-time/first-info/${params}`,
    })
}

//根据设备类型获取告警目标列表
export const apiGetWarnType = (params?:any) => {
    return defHttp.post({
        url:"/warnConfig/listWarnTarget",
        params
    })
}