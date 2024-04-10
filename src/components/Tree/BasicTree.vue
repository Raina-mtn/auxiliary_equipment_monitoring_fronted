<template>
  <div class="basic-tree flex flex-col h-full">
    <header class="basic-tree__header" v-if="props.showHeader">{{ props.title }}</header>
    <div class="basic-tree__content flex-1">
      <slot name="checkRow" v-if="props.showCheckRow"
        v-bind="{ label: currentNode?.label, id: currentNode?.id, ...currentNode }">
        <p>当前选中：{{ currentNode?.label }}</p>
      </slot>
      <div class="search-bar flex mb-4">
        <el-input class="mr-4" v-model="filterText" :placeholder="props.placeholder"></el-input>
        <el-button type="primary" :icon="Search">查询</el-button>
      </div>
      <slot name="other"></slot>
      <el-scrollbar :style="{ height: 'calc(100% - 200px)' }">
        <el-tree :data="props.treeData" default-expand-all @node-click="handleNodeClick" ref="treeRef" v-bind="$attrs"
          @check-change="check" />

      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { ref, reactive } from "vue";
import type Node from 'element-plus/es/components/tree/src/model/node'
import { Tree } from './interface'
import { watch } from "vue";
import { alarmStore } from '@/store'

const useAlarmStore = alarmStore();
const filterText = ref('')
const treeRef = ref()
// 过滤
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

let disabled = ref(true)
let checkList = reactive({ val: [] });
const emits = defineEmits(['onNodeClick'])
interface Props {
  title: string
  treeData: Tree[]
  showCheckRow: boolean,
  showHeader: boolean,
  placeholder: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  treeData: [] as any,
  showCheckRow: true,
  showHeader: false,
  placeholder: '请输入'
})
const currentNode = ref<Node | undefined>()

watch(() => props.treeData, () => {
  currentNode.value = props.treeData[0] as Node
}, {
  deep: true,
  immediate: true
})


function check(node: Node, checked: boolean) {
  if (checked) {
    checkList.val = treeRef.value.getCheckedNodes()
    if (checkList.val.length > 1) {
      disabled.value = false
    } else {
      disabled.value = true
    }
    handleNodeClick(node)
  } else {
    useAlarmStore.setEquipmentId(null)
  }
}

function handleNodeClick(node: Node) {
  currentNode.value = node
  emits('onNodeClick', node)
}


</script>

<style scoped lang="scss">
.basic-tree {
  &__header {
    height: 35px;
    line-height: 35px;
    color: #fff;
    background: url("@/assets/images/tree_title_bg.png") no-repeat;
    font-size: 1rem;
    text-indent: 2rem;
  }

  &__content {
    background: #0b2363;
    padding: 1rem;

    &>p {
      line-height: 32px;
      color: #fff;
      height: 32px;
      background: rgba(27, 61, 159, 0.7);
      padding: 0 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
