import { defHttp } from "@/api/http";

// 获取设备类目
export const apiGetDeviceList = (params?: any) => {
    return defHttp.post({
        url: "/equipment/category/list",
        params,
    }
    );
};