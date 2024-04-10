<template>
    <TabItem :categoryCode="activeName" :activeItem="activeItem" ref="searchRef" :searchParams="searchParams">
        <SearchForm @search="getEquipmentList"></SearchForm>
    </TabItem>
</template>
    
<script setup lang='ts'>
import { ref } from 'vue'
import TabItem from '@/views/intelliAuxiliary/dynamicEnviMonitor/component/TabItem.vue';

import { antiDrone } from '../config'
import SearchForm from '../components/SearchForm.vue'
const activeName = ref(antiDrone[0].code)
const activeItem = ref(antiDrone[0])
const searchRef = ref()
let searchParams = ref({})
function getEquipmentList(data: any) {
    searchParams.value = data
    searchRef.value.search()
}
</script>
    
<style scoped>
.el-tabs {
    height: 42px;
}
</style>