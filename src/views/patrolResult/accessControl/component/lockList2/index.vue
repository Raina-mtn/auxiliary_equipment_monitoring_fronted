<template>
    <div class="flex-1 p-4 bg-deepBlue ml-4 relative">
        <ProTable ref="proTable" title="主设备管理" :columns="lockcolumns2" :requestApi="getTableList"
            max-height="600" :searchCol="searchCol">
            <template #searchHeader>
                <span></span>>
            </template>
        </ProTable>
    </div>
</template>
<script  setup lang='ts'>
import ProTable from "@/components/ProTable/index.vue";
import { apiGetRecordGuard } from "@/api/interface/patrolResult/accessControl";
import {lockcolumns2} from '../../config'
const searchCol = {
  xs:1,
  sm:2,
  md:6,
  lg: 6,
  xl: 6
}
const getTableList = (params: any) => {
    let newParams = JSON.parse(JSON.stringify(params));
    if (Array.isArray(newParams?.operateTime) && newParams?.operateTime.length) {
        newParams.startTime = newParams.operateTime[0]
        newParams.endTime = newParams.operateTime[1]
        delete newParams.operateTime;
    }
    const params2 = {
        ...newParams,
        'page.pageIndex': newParams.page.pageIndex,
        'page.pageSize': newParams.page.pageSize,
    }
    delete params2.page
    return apiGetRecordGuard(params2);
};
</script>