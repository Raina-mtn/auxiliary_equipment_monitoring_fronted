import {defHttp} from '@/api/http'

// 获取列表数据
export const list = (params: object) => {
  return defHttp.post({
    url:'/position/list',
    params
  })
}

// 更新点位
export const update = (params: object) => {
  return defHttp.post({
    url:'/position/update',
    params
  })
}

// 新增点位
export const add = (params: object) => {
  return defHttp.post({
    url:'/position/create',
    params
  })
}

// 删除点位
export const onDelete = (params: object) => {
  return defHttp.post({
    url:'/position/delete',
    params
  })
}
