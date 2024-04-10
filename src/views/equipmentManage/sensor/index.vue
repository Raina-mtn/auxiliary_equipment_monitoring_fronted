<template>
  <div class="flex-1 p-4 bg-deepBlue ml-4 relative">
    <ProTable ref="proTable" title="传感器管理" :columns="columns" :requestApi="deviceList" :initParam="{ grade: 2 }"
      max-height="600" :searchCol="searchCol">
      <template #searchHeader>
        <el-button style="float: right;" type="primary" :icon="Delete" @click="deleteAccount(selects)">删除</el-button>
        <el-button style="float: right;" type="primary" class="mr-4" :icon="CirclePlus" @click="open()">新增</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="open(true, scope.row)"> 编辑 </el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row.id)"> 删除 </el-button>
        <el-button type="primary" link :icon="Refresh" @click="handleLock(scope.row)"> {{ scope.row.signCount > 0 ? '解除挂牌'
          : '挂牌' }} </el-button>
      </template>
    </ProTable>
  </div>
  <SensorDialog ref="SensorDialogRef" @getList="getList" />
</template>
<script setup lang="ts">
import { Delete, EditPen, Refresh, CirclePlus } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from 'element-plus'
import ProTable from "@/components/ProTable/index.vue";
import SensorDialog from "./SensorDialog.vue";
import { columns } from './config'
import { ref, computed } from "vue";
import { deviceList, deviceDelete, apiLockEquipment, apiUnLockEquipment } from "@/api/interface/device";
import dayjs from "dayjs";

const SensorDialogRef = ref<InstanceType<typeof SensorDialog> | null>(null)
const proTable = ref()
const searchCol = {
  xs: 1,
  sm: 2,
  md: 6,
  lg: 6,
  xl: 6
}

const selects = computed(() => {
  return proTable.value.selectedListIds
})

function open(isEdit = false, row = {}) {
  SensorDialogRef.value?.open(isEdit, row)
}

function deleteAccount(id: [string | number]) {
  ElMessageBox.confirm(
    `确定删除吗?`
  ).then(
    () => {
      deviceDelete({ idList: [id] }).then(res => {
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


function handleLock(row: { id: string, signCount: number }) {
  let api = row.signCount > 0 ? apiUnLockEquipment : apiLockEquipment
  const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const params = {
    equipmentId: row.id,
  }
  if (row.signCount > 0) {
    params.endTime = time
  } else {
    params.startTime = time
  }
  api(params).then(() => {
    ElMessage.success(`${row.signCount > 0 ? '解除' : ''}挂牌成功`)
    getList()

  })
}

function getList() {
  proTable.value.search()
}

</script>