import { defHttp } from '@/api/http'
/**
 * 
 * @param params
 * @title 联动列表
 */

// 分页获取设备信息列表
export const apiGetLinkList = (params?: any) => {
    return defHttp.get({
        url: "/linkage/trigger-record",
        params,
    }
    );
};
// 确认联动
export const apiConfirmRecord = (params?: any) => {
    return defHttp.post({
        url: "/linkage/trigger-record/confirm",
        params,
    }
    );
};
//导出接口
export const apiLinkExportTask = (params?: any) => {
    return defHttp.post({
        responseType: 'blob',
        url: "/warn/analysis/export",
        params,

    }, { isTransformResponse: false })
}