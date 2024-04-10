<template>
    <div class="display3D flex justify-between px-4  mt-4">
        <leftPanle @getPoints="getPoints" :currentTab="currentTab"></leftPanle>
        <mainPanle :points="points" @changTab="handleChangeTab"></mainPanle>
    </div>
</template>
    
<script setup lang='ts'>
import { ref } from 'vue';
import leftPanle from './components/leftPanle.vue';
import mainPanle from './components/main.vue';

const points = ref<any[]>([])
const currentTab = ref('视频监控')
function getPoints(data: any[]) {
    points.value = data
}

function handleChangeTab(name: string) {
    currentTab.value = name
}

</script>
    
<style>
.display3D {
    width: 100%;
    height: 100%;
}
</style>