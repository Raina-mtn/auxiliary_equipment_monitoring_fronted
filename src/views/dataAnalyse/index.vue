<template>
    <div class="warnAnalyse flex px-4  mt-4 flex-col">
        <search @search="getSearchParams"></search>
        <mainPanel :searchParams="searchParams"></mainPanel>
        <tablePanel :searchParams="searchParams"></tablePanel>
    </div>
</template>
    
<script setup lang='ts'>
import tablePanel from './components/table.vue';
import mainPanel from './components/main.vue';
import search from './components/search.vue';
import { ref } from 'vue';

const searchParams = ref({})

function getSearchParams(params: object) {
    searchParams.value = { ...params }
}

</script>
<style>
.warnAnalyse {
    width: 100%;
    height: 100%;
}
</style>