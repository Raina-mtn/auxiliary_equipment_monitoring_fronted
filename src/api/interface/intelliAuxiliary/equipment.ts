import { defHttp } from "@/api/http";

// 设备树
export const apiGetEquipmentTree = (params?: any) => {
    return defHttp.post({
        url: "/equipment-tree",
        params
    }
    );
};

// 视频监控下拉列表
export const apiGetEquipmentSelectList = (params?: any) => {
    return defHttp.post({
        url: '/streaming/real-time/equipment-select',
        params
    })
}

// 预置位接口
export const apiCreatePreset = (params?: any) => {
    return defHttp.post({
        url: "/streaming/real-time/preset",
        params,
    }
    );
};

export const apiUpdatePreset = (params?: any) => {
    return defHttp.put({
        url: "/streaming/real-time/preset" + (params.id ? `/${params.id}` : ''),
        params,
    }
    );
};

export const apiGetPresetList = (params?: any) => {
    return defHttp.get({
        url: "/streaming/real-time/preset/list",
        params,
    }
    );
};

export const apiSearchPreset = (params?: any) => {
    return defHttp.post({
        url: "/streaming/real-time/preset",
        params,
    }
    );
};

export const apiDelPreset = (id?: any) => {
    return defHttp.delete({
        url: `/streaming/real-time/preset/${id}`,
    }
    );
};

export const apiGetAbnormalList = (params?: any) => {
    return defHttp.post({
        url: "/graph/equipment/abnormal/list",
        params,
    }
    );
};
// 灯光控制
export const apiControlLight = (params?: any) => {
    return defHttp.post({
        url: "/streaming/real-time/light/control",
        params,
    }
    );
}
// 获取灯光状态
export const apiGetLightStatus = (lineId?: any) => {
    return defHttp.get({
        url: `/streaming/real-time/light/status/${lineId}`,
    }
    );
}