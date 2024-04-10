<template>
  <div class="flex h-full p-4">
    <OrgTree @onNodeClick="toggleOrg" />
    <div class="flex-1 p-4 bg-deepBlue ml-4 text-green">
      <ProTable ref="proTableRef" title="用户列表" :columns="columns" max-height="680" :initParam="initParam"
        :request-api="apiGetUserList">
        <template #searchHeader>
          <el-button type="primary" :icon="CirclePlus" @click="createUser"
            style="float: right; margin-bottom: 16px;">添加用户</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="{ row }">
          <el-button type="primary" link @click="editUser(row)" class="text-green-900"><i class="iconfont icon-bianji" />
            编辑 </el-button>
          <el-button type="primary" link @click="resetPass(row)"><i class="iconfont icon-xiugaimima" /> 修改密码 </el-button>
          <el-button type="primary" link :icon="Lock" @click="freezeAccount(row)"> {{ !ifLock(row) ? '冻结' : '解冻' }}
          </el-button>
          <el-button type="danger" link :icon="Delete" @click="deleteAccount(row)"> 删除 </el-button>
        </template>
      </ProTable>
    </div>
    <UserDialog ref="userDialogRef" @refresh="refresh" />
    <EditPassDialog ref="passDialogRef" @refresh="refresh" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import OrgTree from "./component/OrgTree.vue";
import ProTable from "@/components/ProTable/index.vue";
import { Delete, Edit, Lock, Refresh, CirclePlus } from "@element-plus/icons-vue";
import UserDialog from "./component/UserDialog.vue";
import EditPassDialog from "./component/EditPassDialog.vue";
import { columns, ifLock } from './config'
import { apiGetUserList, apiDelUser, apiLockUser, apiUnlockUser } from '@/api/interface/auth/user'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { User } from '@/api/interface/types'
import { ElMessageBox, ElMessage } from "element-plus";
import dayjs from "dayjs";

const initParam = reactive({ deptIdList: [] as number[], deptCascade: true }); //  用户列表的部门参数
const userDialogRef = ref()
const proTableRef = ref()
const passDialogRef = ref()

function editUser(scope: Omit<User.ReqUserParams, 'page'>) {
  userDialogRef.value.open(scope, true)
}

function createUser() {
  userDialogRef.value.open({})
}

function resetPass({ id }: { id: string }) {
  passDialogRef.value.open(id)

}
function freezeAccount(row: { username: string, lastLockedTime: null | string }) {

  const msg = ifLock(row) ? '解冻' : '冻结'
  const lockDay = dayjs().add(1, 'year')
  ElMessageBox.confirm(`确认${msg}该用户`, ' 提示').then(() => {
    const api = msg === '冻结' ? apiLockUser : apiUnlockUser
    const params = Object.assign({
      username: row.username,
    }, msg === '冻结' ? { duration: lockDay.diff(dayjs(), 's') } : {})
    api(params).then(() => {
      ElMessage.success(`已${msg}`)
      refresh()
    })
  })
}


function deleteAccount({ id }: { id: string }) {
  ElMessageBox.confirm('确认删除', ' 提示').then(() => {
    apiDelUser({ id }).then(() => {
      ElMessage.success('删除成功')
      refresh()
    })
  })
}

function refresh() {
  proTableRef.value.getTableList()
}

function toggleOrg(node: Node) {
  initParam.deptIdList = [node.id]
}
</script>

<style scoped></style>
