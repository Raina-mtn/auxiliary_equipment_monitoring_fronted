import { defHttp } from "@/api/http";
// 分页获取设备信息列表
export const apiGetStreamList = (params?: any) => {
    return defHttp.get({
        url: "/streaming/media",
        params,
    }
    );
};

export const apiGetStreamStatis = (params?: any) => {
    return defHttp.get({
        url: "/streaming/media/count",
        params,
    }
    );
};