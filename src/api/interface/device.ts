import { defHttp } from '@/api/http'

/**
 * 
 * @param params grade=1，设备; grade=2，传感器
 * @title 设备类目列表
 */
export const categoryList = (params: object) => {
  return defHttp.post({
    url: '/equipment/category/list',
    params
  })
}

/**
 * 
 * @param params grade=1，设备; grade=2，传感器
 * @title 设备列表
 */
export const deviceList = (params: object) => {
  return defHttp.post({
    url: '/equipment/list',
    params
  })
}

// 删除设备
export const deviceDelete = (params: object) => {
  return defHttp.post({
    url: '/equipment/delete',
    params
  })
}

// 新增设备
export const deviceAdd = (params: object) => {
  return defHttp.post({
    url: '/equipment/create',
    params
  })
}

// 新增设备
export const deviceUpdate = (params: object) => {
  return defHttp.post({
    url: '/equipment/update',
    params
  })
}

//获取视频流
export const getSteamPoint = (lineId: number) => {
  return defHttp.get({
    url: `/streaming/real-time/first-info/${lineId}`,
  }
  );
}

// 设备挂牌
export const apiLockEquipment = (params: object) => {
  return defHttp.post({
    url: `/sign/add`,
    params: {
      ...params,
      nameplateCategory: 'MAINTENANCE'
    }
  }
  );
}

// 解锁设备挂牌
export const apiUnLockEquipment = (params: object) => {
  return defHttp.post({
    url: `/sign/remove`,
    params
  }
  );
}

// 解锁设备挂牌
export const apiExportEquipment = (params: object) => {
  return defHttp.get({
    responseType: 'blob',
    url: `/equipment/export-data`,
    params
  }, { isTransformResponse: false }
  );
}