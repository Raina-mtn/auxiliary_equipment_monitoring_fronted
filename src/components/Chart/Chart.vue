<template>
  <div style="width: 100%;
          height: 100%;">
    <div v-if="!hasNodata" ref="chartRef" style="
          width: 100%;
          height: 100%;
          position: relative;
        " />
    <NoData v-else />
  </div>
</template>

<script setup lang="ts">
import NoData from '../NoData.vue'
import 'echarts-liquidfill';
import * as echarts from 'echarts'
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useEventListener } from '@/utils/hooks/useEventListener';
import { useDebounceFn, tryOnUnmounted } from '@vueuse/core';

let removeResizeFn: Fn = () => {
};
let resizeFn: Fn = resize;
resizeFn = useDebounceFn(resize, 200);


const emits = defineEmits(['onload'])
const props = defineProps({
  option: {
    type: Object,
    default: () => ({})
  }
})
const hasNodata = ref(true)


const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null;

watch(() => props.option, (val) => {
  hasNodata.value = Object.keys(props.option).length === 0
  if (!hasNodata.value) {
    if (chartInstance !== null) {
      chartInstance.setOption(val, { replaceMerge: 'series' })
    } else {
      initChart()
    }
  } else {
    chartInstance && chartInstance.dispose();
    chartInstance = null;
  }
}, {
  deep: true,
  immediate: true
})

onMounted(() => {
  initChart()
})

tryOnUnmounted(() => {
  if (!chartInstance) return;
  removeResizeFn();
  chartInstance.dispose();
  chartInstance = null;
});

function initChart() {
  if (!hasNodata.value) {
    nextTick(() => {
      chartInstance = echarts.init(chartRef.value)
      chartInstance.setOption(props.option)
      emits('onload', chartInstance)
      const { removeEvent } = useEventListener({ // 监听window的resize
        el: window,
        name: 'resize',
        listener: resizeFn,
      });
      removeResizeFn = removeEvent;
    })
  }
}

function resize() {
  chartInstance?.resize();
}
</script>
