<template>
  <div class="main-container flex-1 p-4 bg-deepBlue ml-4 relative">
    >
    <ProTable ref="proTable" title="告警列表" :columns="columns" max-height="600" :requestApi="apiGetTaskList"
      :searchCol="searchCol">
      <template #searchHeader>
        <el-button style="float: right;" type="primary" :icon="Delete" @click="deleteInfo"
          :disabled="isShow">删除任务</el-button>
        <el-button style="float: right;" type="primary" :icon="CircleCheck" class="mr-4"
          @click="exportInfo">导出</el-button>
        <div class="h-10 w-1"></div>
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="CircleCheck" @click="open(scope.row)"
          :disabled="scope.row.checkStatus">审核</el-button>
        <!-- videoSurveillance -->
        <el-button type="primary" link :icon="VideoPlay" :disabled="scope.row.videoSurveillance" @click="monitor"> 监控
        </el-button>
        <el-button type="primary" link :icon="InfoFilled" @click="openDetail(scope.row)"> 详情 </el-button>
      </template>
    </ProTable>
    <CheckDialog ref="CheckDialogRef" @getList="getList"></CheckDialog>
    <AlarmDialog ref="AlarmDialogRef"></AlarmDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { CircleCheck, Delete, VideoPlay, InfoFilled } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { columns } from './config'
import CheckDialog from './component/CheckDialog.vue';
import AlarmDialog from './component/AlarmDialog.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { apiDeleteTask, apiExportTask, apiGetTaskList } from '@/api/interface/taskCenter';
import { downloadByData } from '@/utils/download';
import { router } from '@/router';

import { wsStore } from '@/store/index'
const useWsStore = wsStore()
useWsStore.$subscribe((_, state) => {
  if (state.refreshFlag) {
    getTaskList()
  }
})

const CheckDialogRef = ref<InstanceType<typeof CheckDialog> | null>(null);
const AlarmDialogRef = ref<InstanceType<typeof AlarmDialog> | null>(null);
const formData = ref();
const proTable = ref();
const searchCol = {
  xs: 1,
  sm: 2,
  md: 4,
  lg: 4,
  xl: 4
}


const isShow = computed(() => {
  if (proTable.value?.selectedListIds.length !== 0) {
    return false
  }
  return true
})
//获取列表数据
const getTaskList = async () => {
  const params = {
    page: {
      pageIndex: 1,
      pageSize: 10
    }
  }
  const res = await apiGetTaskList(params);
  formData.value = res.data.list
  useWsStore.setRefreshFlag(false)
}


const open = (row = {}) => {
  CheckDialogRef.value?.open(row)
}
const openDetail = (row = {}) => {
  AlarmDialogRef.value?.open(row)
}
function getList() {
  proTable.value.search()
}
//监控操作
const monitor = () => {

  router.push('/home/intelliAuxiliary/realtimeMonitor');
}

//导出数据
const exportInfo = () => {
  const data = proTable.value.selectedListIds.length ? proTable.value.selectedListIds : '';
  apiExportTask({ isList: data }).then((res) => {
    downloadByData(res, '告警中心列表.xlsx')
    ElMessage({
      type: 'success',
      message: '导出成功'
    })
    proTable.value.selectedListIds = []
  }).catch(() => {
    console.log('导出错误');

  })

}

//删除任务
const deleteInfo = () => {
  ElMessageBox.confirm('你确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      apiDeleteTask({ ids: proTable.value.selectedListIds }).then(() => {
        proTable.value.search()
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
      })
    })
}

onMounted(() => {
  getTaskList();
})

// provide('warnLevel',warnLevel.value)
</script>

<style>
.main-container {

  .el-button--primary.is-link.is-disabled,
  .el-button--primary.is-link.is-disabled:active {
    color: #255585;
  }
}
</style>