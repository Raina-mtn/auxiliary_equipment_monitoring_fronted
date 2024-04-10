/*
 * @Date: 2023-10-10 10:01:07
 * @LastEditors: zhusisheng zhusisheng@shenhaoinfo.com
 * @LastEditTime: 2023-10-10 19:46:02
 * @FilePath: \auxiliary_equipment_monitoring_fronted\src\api\interface\dataAnalyse\dataAnalyse.ts
 */
import { defHttp } from "@/api/http";
/**
 * 
 * @param params
 * @title 联动列表
 */
// 告警趋势统计
export const apiGetTrend = (params?: any) => {
  return defHttp.get({
    url: "/warn/analysis/trend",
    params,
  }
  );
};

// 告警占比统计
export const apiGetProportion = (params?: any) => {
  return defHttp.get({
    url: "/warn/analysis/proportion",
    params,
  }
  );
};

// 分页列表
export const apiGetList = (params?: any) => {
  return defHttp.get({
    url: "/warn/analysis/page/list",
    params,
  }
  );
};

// 告警等级
export const apiGetListWarnLevel = () => {
  return defHttp.post({
    url: "/warnConfig/listWarnLevel"
  }
  );
};

//  区域列表
export const apiGetZoneList = () => {
  return defHttp.post({
    url: "/zone/list"
  }
  );
};

//  根据设备类型获取告警目标列表
export const apiListWarnTarget = (params: any) => {
  return defHttp.post({
    url: "/warnConfig/listWarnTarget",
    params
  }
  );
};

//  根据设备类型获取告警目标列表
export const addWarnIncident = (params: any) => {
  return defHttp.post({
    url: "/warnConfig/addWarnIncident",
    params
  }
  );
};

//  根据设备类型获取告警目标列表
export const listUnit = (params: any) => {
  return defHttp.post({
    url: "/warnConfig/listUnit",
    params
  }
  );
};

// 设置设备告警通知方式
export const updateWarnIncident  = (params: object) => {
  return defHttp.post({
    url:'/warnConfig/updateWarnIncident',
    params
  })
}

// 导出
export const apiExport  = (params: object) => {
  return defHttp.post({
    responseType:'blob',
    url:'/warn/analysis/export',
    params
  },{isTransformResponse: false})
}

