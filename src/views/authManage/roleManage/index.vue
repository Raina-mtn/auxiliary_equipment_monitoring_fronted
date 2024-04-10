<template>
  <div class="flex-1 p-4 bg-deepBlue">
    <ProTable ref="proTableRef" title="角色列表" :columns="columns" :request-api="(params) => getRoleList(params)"
      max-height="680" @handleCreate="createRole">
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="openAuthDialog(row)" :disabled="row.roleName === 'ADMIN'"> <i
            class="iconfont icon-shouquan" />授权
        </el-button>
        <el-button type="primary" link @click="editRole(row)"><i class="iconfont icon-bianji" /> 编辑 </el-button>
        <el-button type="danger" link :icon="Delete" @click="del(row)"> 删除 </el-button>
      </template>
    </ProTable>
    <RoleDialog ref="roleDialogRef" @refresh="refresh" />
    <RoleAssignDialog ref="roleDialogAssignRef" @refresh="refresh" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Delete } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { columns } from './config'
import { apiGetRoleList, apiDelRole } from "@/api/interface/auth/role";
import { ElMessageBox, ElMessage } from "element-plus";
import RoleDialog from './component/RoleDialog.vue'
import RoleAssignDialog from './component/RoleAssignDialog.vue'
import dayjs from "dayjs";

const roleDialogRef = ref()
const roleDialogAssignRef = ref()
const proTableRef = ref()


function getRoleList(params: { createTime: [string, string], minCreateTime: string, maxCreateTime: string }) {
  if (params.createTime) {
    const [minCreateTime, maxCreateTime] = params.createTime
    params.minCreateTime = dayjs(minCreateTime).format('YYYY-MM-DD HH:mm:ss')
    params.maxCreateTime = dayjs(maxCreateTime).format('YYYY-MM-DD') + ' 23:59:59'
  }

  return apiGetRoleList(params)
}

// 打开授权弹窗
function openAuthDialog(row: object) {
  roleDialogAssignRef.value.open(row)
}
// 角色创建
function createRole() {
  roleDialogRef.value.open()
}
// 编辑
function editRole(row: object) {
  roleDialogRef.value.open(row, true)
}
//删除
function del({ id }: { id: string }) {
  ElMessageBox.confirm('确认删除', ' 提示').then(() => {
    apiDelRole({ id }).then(() => {
      ElMessage.success('删除成功')
      refresh()
    })
  })
}
// 删除
function refresh() {
  proTableRef.value.getTableList()
}
</script>

<style scoped></style>
