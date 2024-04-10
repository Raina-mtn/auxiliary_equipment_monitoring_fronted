<template>
    <el-tabs v-model="activeName" type="card" class="mt-4 ml-4" @tab-click="handleClick">
        <el-tab-pane v-for="item in equipmentTypeList" :label="item.label" :name="item.code">
        </el-tab-pane>
    </el-tabs>
    <component :is="obj[activeName]" @lockRecord="lockRecord"></component>
</template>
<script setup lang='ts'>
import { ref } from 'vue'
import { equipmentTypeList } from './config'
import LockList1 from "./component/lockList1/index.vue"
import LockList2 from "./component/lockList2/index.vue"
import LockList3 from "./component/lockList3/index.vue"
const activeName = ref(equipmentTypeList[0].code)
let obj = {
    "A":LockList1,
    "B":LockList2,
    "C":LockList3
} as any
const lockRecord = ()=>{
    activeName.value = "B"
}
</script>
    
<style scoped>
.el-tabs {
    height: 42px;
}
</style>