<template>
  <div class="right-panel w-1/4 flex flex-col justify-between">
    <!--    告警类型排行TOP5-->
    <section class="mb-1">
      <Title title="告警类型排行TOP5" sub-title="TOP5 Alarm Types" class="mb-2"/>
      <div class="h-200px">
        <Chart :option="alarmBarOption"/>
      </div>
    </section>
    <!--    告警联动趋势-->
    <section class="mb-1 flex-1 ">
      <Title title="告警联动趋势" sub-title="Alarm Linkage Trend" class="mb-2"/>
      <div class="h-200px">
        <Chart :option="alarmLineOption"/>
      </div>
    </section>
    <!--    实时告警-->
    <section class="flex-1">
      <Title title="告警日历" sub-title="Alarm Calendar" class="mb-2"/>
      <Calendar/>
    </section>
  </div>
</template>

<script setup lang="ts">
import Title from './Title.vue'
import Calendar from './Calendar.vue';
import Chart from '@/components/Chart/Chart.vue'
import {barOption, lineOption} from '../config/chart.config'
import { onMounted, reactive, ref } from 'vue';
import { apiGetWarnTrend, apiGetWarnTypeRanking } from '@/api/interface/home';

const alarmBarOption = ref()
const alarmLineOption = ref()

let AlarmTypesTop5Data = [{name: '', data: 0}]
let alarmLineData = {
  xData:[] as any,
  sData:[{name:'告警',ydata:[] as any},{name:'联动',ydata:[] as any}]
}

//告警类型排行
const getWarnTypeRanking = async() => {
  const res = await apiGetWarnTypeRanking()
  AlarmTypesTop5Data = res.data.map((item:any,index:number) => ({
    name:`NO.${index+1} ${item.warnType}`,
    data:item.warnNum
  }))
  if (AlarmTypesTop5Data.length !==5 ) {
    for(let i = AlarmTypesTop5Data.length+1;i<6;i++){
      const data = {name:`NO.${i} 暂无`,data:0}
      AlarmTypesTop5Data = [...AlarmTypesTop5Data,data]
    }
  }
  alarmBarOption.value = barOption(AlarmTypesTop5Data)
}

//告警联动趋势
const getWarnTrend = async() => {
  const res = await apiGetWarnTrend();
  //通过slice取出time中的最后两位数，然后转化为10进制
  let start = parseInt(res.data.linkageStatistics[0].time.slice(-2),10)
  for(let i = 0;i<res.data.linkageStatistics.length;i++){
    const data = start+i;
    alarmLineData.xData.push(`${data}月`)
    alarmLineData.sData[1].ydata.push(res.data.linkageStatistics[i].num)
    alarmLineData.sData[0].ydata.push(res.data.warnStatistics[i].num)
  }
  alarmLineOption.value = lineOption(alarmLineData)
}

onMounted(() => {
  getWarnTypeRanking();
  getWarnTrend();
})
</script>

<style scoped>

</style>
