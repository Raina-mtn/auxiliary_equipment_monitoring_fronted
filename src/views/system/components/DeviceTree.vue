<template>
  <div style="background-color: #0B2363;">
    <div class="header">
      设备搜索
    </div>
    <div class="tree h-7/8">
      <BasicTree class="org-tree" :title="'设备搜索'" :treeData="orgTreeData" :node-key="'id'" show-checkbox
        :showCheckRow="false" :filter-node-method="filterNode" :placeholder="'请输入点位名称或设备编号'" @onNodeClick="clickNode">
      </BasicTree>
    </div>
  </div>
</template>

<script setup lang="ts">
import BasicTree from '@/components/Tree/BasicTree.vue'
import { ref, reactive } from 'vue';
// import { apiGetOrgTree } from '@/api/interface/auth/org';
import type Node from 'element-plus/es/components/tree/src/model/node'
import { Tree } from '@/components/Tree/interface'
import { apiGetEquipmentTree } from "@/api/interface/intelliAuxiliary/equipment";
import { alarmStore } from "@/store";

const useAlarmStore = alarmStore()

let categoryList = reactive([]);
const emits = defineEmits(['onNodeClick'])
const orgTreeData = ref<Tree[]>([])
const props = defineProps(["type"]);
getOrgTree()

function getFirstNode(data = []) {
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item.children.length > 0) {
        getFirstNode(item.children[0])
      } else {
        useAlarmStore.setEquipmentId(item.id)
        return 0
      }
    });

  }
}

function getOrgTree() {
  categoryList.push(props.type)
  apiGetEquipmentTree({ categoryList: categoryList }).then(res => {
    orgTreeData.value = res.data
    if (res.data.length > 0) {
      getFirstNode(res.data || [])
    } else {
      useAlarmStore.setEquipmentId(null)
    }
  });
}

function clickNode(node: Node) {
  emits('onNodeClick', node)
  if (node.children.length < 1) {
    useAlarmStore.setEquipmentId(node.id)
  }
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

.header {
  width: 378px;
  height: 35px;
  background: url('../../../assets/images/tree_title_bg.png') no-repeat;
  background-size: 378px 35px;
  font-size: 18px;
  line-height: 35px;
  padding-left: 48px;
  background-color: #0B2363;
  color: #FFFFFF;
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
