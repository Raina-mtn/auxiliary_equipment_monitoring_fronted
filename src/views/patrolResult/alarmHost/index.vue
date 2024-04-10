<template>
    <TabItem :categoryCode="activeName" :activeItem="activeItem" ref="searchRef" :searchParams="searchParams"
        :switchOpenAllText="'一键布防'" :switchCloseAllText="'一键撤防'">
        <SearchForm @search="search"></SearchForm>
    </TabItem>
</template>
    
<script setup lang='ts'>
import { ref } from 'vue'
import TabItem from '@/views/intelliAuxiliary/dynamicEnviMonitor/component/TabItem.vue';
import { alarmHost } from '../config'
import SearchForm from '../components/SearchForm.vue'
const activeName = ref(alarmHost[0].code)
const activeItem = ref(alarmHost[0])
const searchRef = ref()
let searchParams = ref({})

function search(data: any) {
    searchParams.value = data
    searchRef.value.search()
}
</script>
    
<style scoped>
.el-tabs {
    height: 42px;
}
</style>