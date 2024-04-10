import {defHttp} from '@/api/http'
import { number } from 'vue-types';
// 获取列表数据
  export const apiGetRuleList = (params?: any) => {
    return defHttp.get({
        url: "/linkage/rule",
        params,
    }
    );
};
// 获取设备告警事件列表
export const listWarnIncident = (params: object) => {
  return defHttp.post({
    url:'/warnConfig/listWarnIncident',
    params
  })
}
// 增加联动数据
export const linkAdd = (params: object) => {
  return defHttp.post({
    url:'/linkage/rule',
    params
  })
}
// 修改联动数据
export const linkPut = (id:number,params: object) => {
  return defHttp.put({
    url:`/linkage/rule/${id}`,
    params
  })
}

// 删除联动数据
export const linkDel = (params: object) => {
  return defHttp.delete({
    url:'/linkage/rule',
    params
  })
}

// 联动详情数据
export const linkDetail = (id: number | string) => {
  return defHttp.get({
    url:`/linkage/rule/${id}`
  })
}

