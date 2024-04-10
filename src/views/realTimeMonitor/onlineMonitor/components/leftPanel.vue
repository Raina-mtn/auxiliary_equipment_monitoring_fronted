<template>
  <div class="left-panel  flex flex-col">
    <Title title="设备搜索" class="h-1/12" />
    <div class="main p-4">
      <div class="search flex flex-row justify-between mb-4">
        <el-input v-model="filterText" placeholder="请输入点位名称" clearable class="w-2/3" />
        <el-button type="primary" class="w-1/5 mr-4" :icon="Search" @click="search()">查询</el-button>
      </div>
      <el-tree ref="treeRef" class="h-auto" :show-checkbox="true" :data="treeData.val" :check-on-click-node="true"
        node-key="id" default-expand-all :props="defaultProps" :filter-node-method="filterNode" />
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import Title from "./Title.vue";
import { apiGetEquipmentTree } from "@/api/interface/intelliAuxiliary/equipment";
import { ref, reactive, watch } from "vue";

const emits = defineEmits(['pointClick'])
const filterText = ref('')

let treeRef = ref();
let treeData = reactive({ val: [] });
const defaultProps = {
  children: "children",
  label: "label"
};
let equipmentIds = ref([])


getEqupimentTree()

// 过滤
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.label.includes(value)
}

// 查询点位
function search() {
  console.log(treeRef.value.getCheckedNodes());

  equipmentIds.value = treeRef.value.getCheckedNodes().filter((v: { children: any[] }) => !v.children || (Array.isArray(v.children) && v.children.length === 0)).map((v: { id: number }) => v.id);
  emits('pointClick', equipmentIds)
}


function getEqupimentTree() {
  const categoryList = ['TRANSFORMER', 'LIGHTNING_ARRESTED', 'CIRCUIT_BREAKER'] // 写死，查主设备

  apiGetEquipmentTree({ categoryList }).then(res => {
    treeData.val = res.data;

  });
}
</script>
  
  
<style scoped lang="scss">
.left-panel {
  background-color: #0b2363;
}
</style>
  