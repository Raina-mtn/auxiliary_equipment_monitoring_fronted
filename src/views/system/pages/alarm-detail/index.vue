<template>
  <div class="flex h-full p-4">
    <DeviceTree @onNodeClick="toggleOrg" :type="type" />
    <mainPanle></mainPanle>
    <AlarmDialog ref="passDialogRef" />
    <BatchSetting></BatchSetting>
  </div>
</template>

<script setup lang="ts">
import BatchSetting from "../../components/BatchSetting.vue";
import mainPanle from "../../components/main.vue";
import { ref, reactive } from "vue";
import DeviceTree from "../../components/DeviceTree.vue";
import AlarmDialog from "../../components/AlarmDialog.vue";
import type Node from 'element-plus/es/components/tree/src/model/node'
import { useRoute } from "vue-router";

const initParam = reactive({ deptIdList: [] as number[], deptCascade: true }); //  用户列表的部门参数
let type = ref()
let route = useRoute()
type.value = route.query.type


function toggleOrg(node: Node) {
  initParam.deptIdList = [node.id]
}
</script>

<style scoped></style>
