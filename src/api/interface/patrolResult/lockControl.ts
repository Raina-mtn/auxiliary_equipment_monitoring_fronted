import { defHttp } from "@/api/http";
/**
 * 
 * @param params
 * @title 联动列表
 */

// 分页获取锁控任务列表
export const apiGetLockist = (params?: any) => {
    return defHttp.get({
        url: "/lock-control/task",
        params,
    }
    );
};
// 新增锁控任务
export const lockAdd = (params: object) => {
    return defHttp.post({
      url:'/lock-control/task',
      params
    })
  }
  //关联设备下拉数据
  export const apiLockDevice = () => {
    return defHttp.get({
      url:'/lock-control/task/equipment-list',
    })
  }
  // 编辑锁控任务
export const lockUpdate = (id:any,params?:any) => {
  return defHttp.put({
    url: `/lock-control/task/${id}`,
    params
  })
}
//删除锁控任务
export const lockDel = (id:any) => {
  return defHttp.delete({
    url: `/lock-control/task/${id}`,
  })
}
//权限管理

// 分页查询人员信息
export const apiGetUser = (params?: any) => {
  return defHttp.get({
      url: "/control-permission/user",
      params,
  }
  );
};
//获取区域
export const apiGetArea = (params?: any) => {
  return defHttp.post({
      url: "/zone/list",
      params,
  }
  );
};
//获取设备信息
export const apiGetAuthDevice = (params?: any) => {
  return defHttp.get({
      url: "/control-permission/authorize/equipment-list",
      params,
  }
  );
};

//授权
export const apiAuthorize = (params?: any) => {
  return defHttp.post({
      url: "/control-permission/authorize",
      params,
  }
  );
};
// 分页获取开锁记录列表
export const apiGetRecordist = (params?: any) => {
  return defHttp.get({
      url: "/lock-control/record",
      params,
  }
  );
};

