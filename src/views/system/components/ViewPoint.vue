<template>
  <el-dialog v-model="state.dialogVisible" :title="`查看点位`" width="30%">
    <div class="flex-1 p-4 bg-deepBlue">
      <ProTable
        ref="proTable"
        title="查看点位"
        :columns="columns"
        :requestApi="areaPoint"
        :initParam="initParam"
        :pagination="false"
        max-height="400"
      >
      </ProTable>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import ProTable from "@/components/ProTable/index.vue"
import {  ColumnProps } from "@/components/ProTable/interface"
import { areaPoint } from '@/api/interface/system/area'

const state = reactive({
  dialogVisible: false,
})
const initParam = reactive({
  rootAreaId: 0
})

const columns:ColumnProps[] = [
  { type: "index", label: "序号", width: 80 },
  {
    prop: "code",
    label: "点位编号",
  },
  {
    prop: "name",
    label: "点位名称",
  }
]

function open(id: number) {
  state.dialogVisible = true
  initParam.rootAreaId = id
}

defineExpose({
  open
})

</script>
<style scoped lang="scss">

</style>
