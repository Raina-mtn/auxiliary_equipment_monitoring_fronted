<template>
    <div class="online-monitor ">
        <el-tabs v-model="activeName" type="card" class="mt-4 ml-4">
            <el-tab-pane v-for="item in equipmentTypeList" :label="item.label" :name="item.code">
            </el-tab-pane>
        </el-tabs>
        <div class="flex online-monitor__content">
            <leftPanel class="w-1/4 h-full" :activeName="activeName" @pointClick="pointClick"></leftPanel>
            <rightPanel class="w-3/4 h-full" :activeName="activeName" :activeIds="activeIds"></rightPanel>
        </div>
    </div>
</template>
<script setup lang='ts'>
import leftPanel from './components/leftPanel.vue';
import rightPanel from './components/rightPanel.vue';

import { ref } from "vue";
const activeName = ref('OIL_CHROMATOGRAPHY')
const equipmentTypeList = [
    { label: '油色谱', code: 'OIL_CHROMATOGRAPHY' },
    { label: '铁芯接地电流', code: 'CORE_GROUND_CURRENT' },
    { label: 'SF6', code: 'SF6' },
    { label: '局放', code: 'PARTIAL_DISCHARGE' },
]
const activeIds = ref<any>([])
function pointClick(val: any) {
    activeIds.value = [...val.value]
}
</script>
    
<style  scoped lang="scss">
.online-monitor {
    width: 100%;
    height: 100%;

    .el-tabs {
        height: 42px;
        margin: 0 !important;
        width: auto !important;

        ::v-deep .el-tabs__item {
            width: auto !important;
        }

    }

    &__content {
        height: calc(100% - 50px);

    }

}
</style>