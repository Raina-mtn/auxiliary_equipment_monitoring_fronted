<template>
    <div class="flex-1 p-4 bg-deepBlue ml-4 relative">
      <ProTable
      ref="proTable"
      title="联动列表"
      :columns="columns"
      :requestApi="getTableList"
      max-height="600"
      :searchCol="searchCol"
      >
      <template #searchHeader>
        <el-button style="float: right;" type="primary" class="mr-4" :icon="Download" @click="exportInfo">导出</el-button>
    </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="VideoPlay" >联动录像 </el-button>
        <el-button type="primary" link :icon="VideoCameraFilled"> 实时监控 </el-button>
      </template>
      </ProTable>
    </div>
</template>
<script setup lang="ts">
import {VideoPlay,VideoCameraFilled, Download} from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import {columns} from './config'
import { ref } from "vue";
import { apiGetLinkList } from "@/api/interface/linkList";
import { downloadByData } from '@/utils/download';
import { apiLinkExportTask } from '@/api/interface/linkList';
import { ElMessage } from 'element-plus';
const proTable = ref()
const searchCol = {
  xs:1,
  sm:2,
  md:6,
  lg: 6,
  xl: 6
}
const getTableList = (params: any) => {
    let newParams = JSON.parse(JSON.stringify(params));
    const params2 = {
        ...newParams,
        'page.pageIndex': newParams.page.pageIndex,
        'page.pageSize': newParams.page.pageSize,
    }
    console.log(params2);
    delete params2.page
    return apiGetLinkList(params2);
};
//导出数据
const exportInfo = () => {
  const data = proTable.value.selectedListIds.length ? proTable.value.selectedListIds : '' ;
  apiLinkExportTask([...data]).then((res) => {
    downloadByData(res,'联动列表.xlsx')
    ElMessage({
      type: 'success',
      message: '导出成功'
    })
    proTable.value.selectedListIds = []
  }).catch(() => {
    console.log('导出错误');
    
  })

}


</script>