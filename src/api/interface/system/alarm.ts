/*
 * @Date: 2023-10-10 10:01:07
 * @LastEditors: zhusisheng zhusisheng@shenhaoinfo.com
 * @LastEditTime: 2023-10-10 19:17:27
 * @FilePath: \auxiliary_equipment_monitoring_fronted\src\api\interface\system\alarm.ts
 */
import { defHttp } from '@/api/http'

// 获取设备告警事件列表
export const apiGetWainList = (params: object) => {
  console.log('params :>> ', params);
  return defHttp.post({
    url: '/warnConfig/listWarnIncident',
    params
  })
}

// 获取设备告警延时设置
export const apiGetDelayConfig = (params: object) => {
  return defHttp.post({
    url: '/warnConfig/getDelayConfig',
    params
  })
}

// 获取设备告警通知方式设置
export const apiGetInformConfig = (params: object) => {
  return defHttp.post({
    url: '/warnConfig/getInformConfig',
    params
  })
}

// 设置设备通知延时设置
export const apiSetDelayConfig = (params: object) => {
  return defHttp.post({
    url: '/warnConfig/setDelayConfig',
    params
  })
}

// 设置设备告警通知方式
export const apiSetInformConfig = (params: object) => {
  return defHttp.post({
    url: '/warnConfig/setInformConfig',
    params
  })
}

// 设置删除
export const deleteWarnIncident = (params: object) => {
  return defHttp.post({
    url: '/warnConfig/deleteWarnIncident',
    params
  })
}

// 获取设备告警抑制
export const apiGetWarnRestrain = (params: object) => {
  return defHttp.post({
    url: '/warnConfig/getWarnRestrainConfig',
    params
  })
}
// 设置设备告警抑制
export const apiSetWarnRestrain = (params: object) => {
  return defHttp.post({
    url: '/warnConfig/setWarnRestrain',
    params
  })
}