import { defHttp } from "@/api/http";
/**
 * 
 * @param params
 * @title 联动列表
 */
// 点位信息获取
export const apiGetPoint = (params?: any) => {
    return defHttp.post({
        url: "/display-3d/point-info",
        params,
    }
    );
  };

// 在线监测点位详情
export const apiGetOnline = (params?: any) => {
  return defHttp.get({
      url: "/display-3d/point-info/detail/online-monitor",
      params,
  }
  );
};

// 根据设备id获取设备信息
export const equipmentInfoByCode = (params?: any) => {
  return defHttp.post({
      url: "/movingRingMonitoring/equipmentInfoByCode",
      params,
  }
  );
};
