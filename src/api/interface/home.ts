import { defHttp } from '@/api/http'

//实时告警
export const apiGetRealWarn = (params?:any) =>{
    return defHttp.get({
        url:'/home/real-time/warn',
        params
    })
}

//运行概括
export const apiGetRunOverview = (params?:any) => {
    return defHttp.get({
        url:'/home/run/overview',
        params
    })
}
//告警日历
export const apiGetWarnCalendar = (params?:any) => {
    return defHttp.get({
        url:'/home/warn-calendar',
        params
    })
}
//告警联动趋势
export const apiGetWarnTrend = (params?:any) => {
    return defHttp.get({
        url:'/home/warn-linkage/trend',
        params
    })
}
//今日告警次数统计
export const apiGetWarnNum = (params?:any) => {
    return defHttp.get({
        url:'/home/warn-num/statistics',
        params
    })
}
//告警类型排行
export const apiGetWarnTypeRanking = (params?:any) => {
    return defHttp.get({
        url:'/home/warn-type/ranking',
        params
    })
}