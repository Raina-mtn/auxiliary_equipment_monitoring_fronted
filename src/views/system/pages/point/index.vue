<template>
  <div class="point text-light-50 p-16px">
    <left-panel title="点位管理" />
    <div class="point-content">
      <div class="flex-1 p-4 bg-deepBlue">
        <ProTable
          ref="proTable"
          title="点位列表"
          :columns="columns"
          :requestApi="list"
          :initParam="{level: 2}"
          max-height="600"
          :searchCol="searchCol"
        >
          <template #searchHeader>
            <el-button style="float: right;" type="primary" class="mr-4" :icon="CirclePlus" @click="openModal(false, {})">新增</el-button>
          </template>
          <!-- 表格操作 -->
          <template #operation="scope">
            <el-button type="primary" link :icon="EditPen" @click="openModal(true, scope.row)"> 编辑 </el-button>
            <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row.id)"> 删除 </el-button>
          </template>
        </ProTable>
      </div>
    </div>
    <PointDialog ref="pointDialog" @getList="getList" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import LeftPanel from '../../components/LeftPanel.vue'
import ProTable from "@/components/ProTable/index.vue"
import PointDialog from '../../components/PointDialog.vue'
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue"
import { ElMessageBox, ElMessage } from 'element-plus'
import {columns} from './config'
import { list, onDelete } from '@/api/interface/system/point'

const pointDialog = ref()
const proTable = ref()
const searchCol = {
  xs:1,
  sm:2,
  md:6,
  lg: 5,
  xl: 6
}

function openModal(isEdit: boolean = false, props: object){
  pointDialog.value.open(isEdit, props)
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
  .point {
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
