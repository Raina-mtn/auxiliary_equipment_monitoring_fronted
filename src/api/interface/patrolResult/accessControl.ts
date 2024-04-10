import { defHttp } from "@/api/http";
/**
 * 
 * @param params
 * @title 联动列表
 */
// 分页获取开门记录列表
export const apiGetRecordGuard = (params?: any) => {
  return defHttp.get({
      url: "/entrance-guard-control/record/list",
      params,
  }
  );
};

