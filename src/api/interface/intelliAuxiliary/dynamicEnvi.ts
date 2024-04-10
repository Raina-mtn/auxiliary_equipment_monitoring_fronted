import { defHttp } from "@/api/http";
// 分页获取设备信息列表
export const apiGetEquipmentList = (params?: any) => {
    return defHttp.post({
        url: "/movingRingMonitoring/listEquipment",
        params,
    }
    );
};


// 获取设备状态统计数据
export const apiGetStateStatistics = (params?: any) => {
    return defHttp.post({
        url: "/movingRingMonitoring/stateStatistics",
        params,
    }
    );
};

//挂牌
export const apiGetStatus = (params?: any) => {
    return defHttp.post({
        url: "/movingRingMonitoring/nameplateCount",
        params,
    }
    );
};
// 根据设备id开关设备
export const apiSwitchEquipmentById = (params?: any) => {
    return defHttp.post({
        url: "/movingRingMonitoring/switchEquipmentById",
        params,
    }
    );
};

// 一键开关设备
export const apiSwitchEquipmentAll = (params?: any) => {
    return defHttp.get({
        url: "/demo/send",
        params,
    }
    );
};
// 空调一键开关设备
export const apiSwitchKTAll = (params?: any) => {
    return defHttp.get({
        url: "/demo/send-kt",
        params,
    }
    );
};


//门禁磁吸开门
export const openDoor = (params?: any) => {
    return defHttp.get({
        url: "/entrance-guard-control/open-door",
        params
    })
}
// 告警次数统计
export const warnNum = (params?: any) => {
    return defHttp.post({
        url: "/movingRingMonitoring/warnNum",
        params,
    }
    );
};
// 在线监测指标趋势
export const apiGetOnlineTrend = (params?: any) => {
    return defHttp.post({
        url: "/movingRingMonitoring/onlineMonitor/trend",
        params,
    }
    );
}

