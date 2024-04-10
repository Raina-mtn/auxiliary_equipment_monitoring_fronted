import { defHttp } from '@/api/http'

// 获取列表数据
export const list = (params: object) => {
  return defHttp.post({
    url: '/zone/list',
    params
  })
}

// 更新区域
export const update = (params: object) => {
  return defHttp.post({
    url: '/zone/update',
    params
  })
}

// 新增区域
export const add = (params: object) => {
  return defHttp.post({
    url: '/zone/create',
    params
  })
}

// 区域树
export const apiGetZoneTree = () => {
  return defHttp.post({
    url: '/zone/tree'
  })
}

// 删除区域
export const onDelete = (params: object) => {
  return defHttp.post({
    url: '/zone/delete',
    params
  })
}

// 获取区域点位
export const areaPoint = (params: object) => {
  return defHttp.post({
    url: '/position/list',
    params
  })
}
