<template>
  <div class="table-panel w-full flex justify-between mt-4 pt-2 flex-col" style="height: 43vh;">
    <el-button class="w-1/30 ml-7 mb-2" type="primary" @click="exportExcel()">导出</el-button>
    <el-table ref="multipleTableRef" :data="tableData" style="width: 97%;margin:0 auto;height:78%;overflow-y: auto;"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column property="areaName" label="区域" align="center" />
      <el-table-column property="lineName" label="点位" align="center" />
      <el-table-column property="equipmentName" label="设备名称" align="center" />
      <el-table-column property="equipmentCode" label="设备编号" align="center" />
      <el-table-column property="sensorName" label="传感器名称" align="center" />
      <el-table-column property="sensorCode" label="传感器编号" align="center" />
      <el-table-column property="categoryName" label="告警类型" align="center" />
      <el-table-column property="warnTime" label="告警时间" align="center" width="180" />
      <el-table-column property="warnLevelName" label="告警等级" align="center" />
      <el-table-column property="equipmentStatus" label="设备状态" align="center" />
      <el-table-column property="auditStatus" label="状态" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" text :icon="Document">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background v-model:current-page="queryForm.pageIndex" :total="total"
      v-model:page-size="queryForm.pageSize" style="margin-bottom: 0.5rem;" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>
        
<script setup lang="ts">
import { Document } from "@element-plus/icons-vue";
import { ref, reactive, watch } from "vue";
import { ElTable } from "element-plus";
import { apiGetList, apiExport } from "@/api/interface/dataAnalyse/dataAnalyse";
import { downloadByData } from '@/utils/download';
import { ElMessage } from 'element-plus';


const props = defineProps(['searchParams'])


let tableData = ref([]);
let total = ref();
let checkTable = reactive([]);
const queryForm = reactive({
  pageIndex: 1,
  pageSize: 10,
  title: ""
});

// 分页
watch(() => [queryForm, props.searchParams], () => {
  console.log(222);

  getList();
});

getList()
// 获取列表信息
async function getList() {
  const params = {
    'page.pageIndex': queryForm.pageIndex,
    'page.pageSize': queryForm.pageSize,
    ...(props.searchParams || {})
  };
  await apiGetList(params).then(res => {
    console.log(res.data);

    tableData.value = res.data.list;
    total.value = res.data.totalCount;
  });
}

// 分页index
const handleCurrentChange = (val: number) => {
  queryForm.pageIndex = val;
  getList()
};
// 分页大小
const handleSizeChange = (val: number) => {
  queryForm.pageSize = val;
  getList()
};
// 表格选中
function handleSelectionChange(val: { id: number }[]) {
  checkTable = []
  val.forEach(item => {
    checkTable.push(item.id)
  });
}

// 导出表格
function exportExcel() {

  if (checkTable.length) {
    apiExport([...checkTable]).then(res => {
      downloadByData(res, '告警分析列表.xlsx')
      ElMessage({
        type: 'success',
        message: '导出成功'
      })
    })
  } else {
    ElMessage.error('请至少选中一项表格数据进行导出')
  }
}

</script>
        
<style scoped lang="scss">
.table-panel {
  color: white;
  background: #0b2363;
}

::v-deep .el-button.is-text {
  color: #0af0fd !important;
}
</style>
        