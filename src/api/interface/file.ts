import {defHttp} from '@/api/http'

// 上传文件接口
export const upload = (params: any) => {
  return defHttp.post({
    url:'/upload',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    params
  })
}

// 下载文件接口
export const download = (params: any) => {
  return defHttp.post({
    url:'/download',
    params
  })
}
