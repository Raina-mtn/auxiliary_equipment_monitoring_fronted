import {defHttp} from '@/api/http'

// 获取站点
export const getStation = ()=>{
  return defHttp.post({
    url:'/station/get'
  })
}

// 更新站点
export const updateStation = (params: object)=>{
  return defHttp.post({
    url:'/station/update',
    params
  })
}
