<template>
  <div class="area text-light-50 p-16px">
    <left-panel title="区域管理" />
    <div class="area-content">
      <div class="flex-1 p-4 bg-deepBlue">
        <ProTable
          ref="proTable"
          title="区域列表"
          :columns="columns"
          :requestApi="list"
          :initParam="{level: 1}"
          max-height="600"
          :searchCol="searchCol"
          @handleCreate="openModal"
        >
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openModal(true, scope.row)"> 编辑 </el-button>
          <el-button type="primary" link :icon="Refresh" @click="openViewPoint(scope.row.id)"> 查看点位 </el-button>
          <el-button type="primary" link :icon="View" @click="openViewPlan(scope.row.plan)"> 查看平面图 </el-button>
          <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row.id)"> 删除 </el-button>
        </template>
        </ProTable>
      </div>
    </div>
    <AreaDialog ref="areaDialog" @get-list="getList" />
    <ViewPoint ref="viewPoint" />
    <ViewPlan ref="viewPlan" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import LeftPanel from '../../components/LeftPanel.vue'
import ProTable from "@/components/ProTable/index.vue"
import AreaDialog from "../../components/AreaDialog.vue"
import ViewPoint from "../../components/ViewPoint.vue"
import ViewPlan from "../../components/ViewPlan.vue"
import { Delete, EditPen, View, Refresh } from "@element-plus/icons-vue"
import { ElMessageBox, ElMessage } from 'element-plus'
import {columns} from './config'
import { list, onDelete } from '@/api/interface/system/area'

const areaDialog = ref()
const viewPoint = ref()
const viewPlan = ref()
const proTable = ref()
const searchCol = {
  xs:1,
  sm:2,
  md:6,
  lg: 5,
  xl: 6
}

onMounted(() => {
})

function openModal(isEdit: boolean = false, props: object){
  areaDialog.value.open(isEdit, props)
}

function openViewPoint (id: string | number) {
  viewPoint.value.open(id)
}

function openViewPlan (planUrl: string) {
  if (!planUrl) {
    return ElMessage.warning(`当前区域无平面图！`)
  }
  viewPlan.value.open(planUrl)
}
function deleteAccount(id: string | number){
  ElMessageBox.confirm(
    `确定删除吗?`
  ).then(
    () => {
      onDelete({id}).then(res => {
        if (res.status.code === 1) {
          ElMessage({
            message: '删除成功！',
            type: 'success'
          })
          getList()
        }
      })
    },
    () => false
  )
}

function getList () {
  proTable.value.search()
}


</script>
<style scoped lang="scss">
  .area {
    display: flex;
    width: 100%;
    height: 100%;
    padding-top: 24px;

    &-content {
      flex: 1;
      height: 100%;
      background: #0B2363;
      margin-left: 16px;
    }
  }
</style>
