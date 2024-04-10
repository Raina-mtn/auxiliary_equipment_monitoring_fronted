<template>
    <TabItem :categoryCode="activeName" :activeItem="activeItem" ref="searchRef" :searchParams="searchParams">
        <SearchForm @search="getEquipmentList"></SearchForm>
    </TabItem>
</template>
    
<script setup lang='ts'>
import { ref } from 'vue'
import TabItem from '@/views/intelliAuxiliary/dynamicEnviMonitor/component/TabItem.vue';
import { fence } from '../config'
import SearchForm from '../components/SearchForm.vue'
const activeName = ref(fence[0].code)
const activeItem = ref(fence[0])
const searchRef = ref(null)
let searchParams = ref({})
function getEquipmentList(data) {
    searchParams.value = data
}
</script>
    
<style scoped>
.el-tabs {
    height: 42px;
}
</style>