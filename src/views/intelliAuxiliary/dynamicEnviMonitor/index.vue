<template>
    <el-tabs v-model="activeName" type="card" class="mt-4">
        <el-tab-pane v-for="item in equipmentTypeList" :label="item.label" :name="item.code">
        </el-tab-pane>
    </el-tabs>
    <TabItem :categoryCode="activeName" :activeItem="activeItem" />
</template>
    
<script setup lang='ts'>
import { ref } from 'vue'
import TabItem from './component/TabItem.vue';
import { equipmentTypeList } from './config'
import { watch } from 'vue';


const activeName = ref(equipmentTypeList[0].code)
const activeItem = ref(equipmentTypeList[0])

watch(() => activeName.value, () => {
    activeItem.value = equipmentTypeList.find(v => v.code === activeName.value)
    console.log(activeItem.value);
})

</script>
    
<style scoped>
.el-tabs {
    height: 42px;
}
</style>