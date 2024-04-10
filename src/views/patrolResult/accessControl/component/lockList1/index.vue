<template>
    <TabItem ref="tabItemRef" :categoryCode="activeName" :activeItem="activeItem" :is-one-touch="true"
        :searchParams="searchParams">
        <SearchForm @search="getEquipmentList"></SearchForm>
    </TabItem>>
</template>
    
<script setup lang='ts'>
import { ref, provide } from 'vue'
import TabItem from '@/views/intelliAuxiliary/dynamicEnviMonitor/component/TabItem.vue';
import { door } from '../../../config'
import SearchForm from '../../../components/DoorSearchForm.vue'

const activeName = ref(door[0].code)
const activeItem = ref(door[0])
const tabItemRef = ref()
const typeCode = "DOOR" //门禁
provide('typeCode', typeCode)
let searchParams = ref({})
function getEquipmentList(data: any) {
    searchParams.value = data
    tabItemRef.value.search()
}
</script>
    
<style scoped>
.el-tabs {
    height: 42px;
}
</style>