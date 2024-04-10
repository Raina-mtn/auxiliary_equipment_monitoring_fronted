<template>
    <el-tabs v-model="activeName" type="card" class="mt-4">
        <el-tab-pane v-for="item in equipmentTypeList" :label="item.label" :name="item.code">
        </el-tab-pane>
    </el-tabs>
    <TabItem :categoryCode="activeName" :activeItem="activeItem" ref="searchRef" :searchParams="searchParams">
        <SearchForm @search="getEquipmentList"></SearchForm>
    </TabItem>
</template>
    
<script setup lang='ts'>
import { ref } from 'vue'
import TabItem from '@/views/intelliAuxiliary/dynamicEnviMonitor/component/TabItem.vue';
import { equipmentTypeList } from '../config'
import { watch } from 'vue';
import SearchForm from '../components/SearchForm.vue'


const activeName = ref(equipmentTypeList[0].code)
const activeItem = ref(equipmentTypeList[0])
const searchRef = ref()
let searchParams = ref({})
watch(() => activeName.value, () => {
    activeItem.value = equipmentTypeList.find(v => v.code === activeName.value)
})
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