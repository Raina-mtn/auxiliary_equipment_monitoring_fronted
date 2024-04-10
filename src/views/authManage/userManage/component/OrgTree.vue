<template>
  <BasicTree :title="'部门搜索'" class="org-tree" :treeData="orgTreeData" @onNodeClick="clickNode"
    :default-expanded-keys="[0]" :node-key="'id'" :filter-node-method="filterNode" :placeholder="'请输入部门名称'">
    <template #checkRow="scope">
      <div class="flex justify-between check-row">
        <p class="text-white truncate">当前选中：<span class="text-sm" :title="scope.label">{{ scope.label }}</span></p>
        <span style="flex: 0 0 120px" v-show="scope.label">
          <el-button type="primary" link :icon="EditPen" @click="editOrg(scope as unknown as Node)"
            :disabled="scope.id === 0"> 编辑 </el-button>
          <el-button type="danger" link :icon="Delete" @click="delOrg(scope)" :disabled="scope.id === 0"> 删除 </el-button>
        </span>
      </div>
    </template>
    <template #other>
      <el-button type="primary" :icon="CirclePlus" class="mb-4" @click="createOrg()">添加部门</el-button>
    </template>
  </BasicTree>
  <OrgDialog ref="orgDialogRef" @refresh="refresh" />
</template>

<script setup lang="ts">
import BasicTree from '@/components/Tree/BasicTree.vue'
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
import OrgDialog from './OrgDialog.vue';
import { ref } from 'vue';
import { apiGetOrgTree, apiDelOrg } from '@/api/interface/auth/org';
import { ElMessageBox, ElMessage } from 'element-plus';
import type Node from 'element-plus/es/components/tree/src/model/node'
import { Tree } from '@/components/Tree/interface'

const emits = defineEmits(['onNodeClick'])
const orgTreeData = ref<Tree[]>([])
const orgDialogRef = ref()

getOrgTree()


function getOrgTree() {
  apiGetOrgTree().then(res => {
    orgTreeData.value = [
      {
        id: 0,
        children: res.data,
        label: '全部'
      }
    ]
  })
}

function editOrg(scope: Node) {
  orgDialogRef.value.open(orgTreeData.value, true, scope)
}

function createOrg() {
  orgDialogRef.value.open(orgTreeData.value, false)
}

function delOrg(scope: { children?: [], id: number | undefined }) {
  // @ts-ignore
  const message = scope?.children.length ? '该部门下存在下级部门,确认删除吗？' : '确认删除该部门吗'
  ElMessageBox.confirm(message, '提示').then(() => {
    const params = {
      idList: [scope.id],
      enableCascade: true
    }
    apiDelOrg(params).then(() => {
      ElMessage.success('删除成功')
      getOrgTree()
    })
  })
}

function clickNode(node: Node) {
  emits('onNodeClick', node)
}

function refresh() {
  getOrgTree()
}

interface TreeNode {
  [key: string]: any
}
const filterNode = (value: string, data: TreeNode) => {
  if (!value) return true
  return data.label.includes(value)
}
</script>

<style scoped lang="scss">
.org-tree {
  width: 378px;
  // flex: 0 0 378px;
}

.check-row {
  background: rgba(27, 61, 159, 0.7);
  line-height: 32px;
  height: 32px;
  margin-bottom: 1rem;

  &>p {
    color: #fff;
    padding: 0 10px;
  }
}
</style>
