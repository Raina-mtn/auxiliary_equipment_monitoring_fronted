<template>
  <div class="flex-1 p-4 bg-deepBlue">
    <ProTable ref="proTable" title="角色列表" :columns="columns" :searchToolButton="false" max-height="680"
      :request-api="getTableList">
    </ProTable>
  </div>
</template>

<script setup lang="ts">
import ProTable from "@/components/ProTable/index.vue";
import { columns } from './config'
import { apiGetLog } from '@/api/interface/auth/user'

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.accessTime && (newParams.minAccessTime = newParams.accessTime[0]);
  newParams.accessTime && (newParams.maxAccessTime = newParams.accessTime[1]);
  delete newParams.accessTime;
  console.log(newParams);
  
  return apiGetLog(newParams);
};
</script>

<style scoped></style>
