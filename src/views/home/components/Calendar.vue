<template>
  <div class="calendar" v-if="warnData">
    <div class="hd flex justify-between mb-2">
      <p>{{ `${monthFormat}智能预警日历图` }}</p>
      <div>
        <el-icon @click="preMonth" class="cursor-pointer">
          <ArrowLeft/>
        </el-icon>
        <i class="el-icon-arrow-left "/>
        <span class="mx-4">{{ monthFormat }}</span>
        <el-icon @click="nextMonth" class="cursor-pointer">
          <ArrowRight/>
        </el-icon>
      </div>
    </div>
    <div class="week-bar">
      <span v-for="(item,index) in weekOption" :key="index" class="inline-block w-1/7 text-center">{{ item }}</span>
    </div>
    <div class="date-container flex flex-wrap" >
      <div v-for="(item,index) in dateArr" :key="index" class="w-1/7 text-center white my-2">
        <span :class="item.class">{{ formatDay(item.day) }}</span>
        <div style="display: inline-block;position: relative; top: -22px;" v-for="data in warnData">
          <span v-show="item.day === data.time " class="number absolute">{{ data.num }}次</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import { apiGetWarnCalendar } from '@/api/interface/home';
import dayjs from 'dayjs'
import {computed, onMounted, ref, watch} from "vue";

interface dateItem {
  class: string
  day: string
}


const curMonth = ref(dayjs().format('YYYY-MM')) // 当前月
const weekOption = ['日', '一', '二', '三', '四', '五', '六']
const dateArr = ref<dateItem[]>([])
const warnData = ref<any>()

const monthFormat = computed(() => {
  const date = curMonth.value.split('-')
  return `${date[0]}年${date[1]}月`
})

watch(curMonth, (val) => {
  getDate(val)
})

onMounted(() => {
  getDate(curMonth.value)
})

function getDate(date:string) {
  const dateList = []
  const startDay = dayjs(date).startOf('month')
  const endDay = dayjs(date).endOf('month')
  const startWeek = startDay.day() // 0星期天 6，星期六
  const endWeek = endDay.day() // 0星期天 6，星期六
  if (startWeek !== 0) { // 计算向前几位
    for (let i = 0; i < startWeek; i++) {
      dateList.push({
        class: 'pre-month',
        day: startDay.subtract(startWeek - i, 'day').format('YYYY-MM-DD')
      })
    }
  }
  const dayNumber = dayjs(date).daysInMonth() // 获取月天数
  for (let i = 0; i < dayNumber; i++) {
    dateList.push({
      class: 'cur-month',
      day: startDay.add(i, 'day').format('YYYY-MM-DD')
    })
  }
  if (endWeek !== 6) {
    for (let i = 1; i < 7 - endWeek; i++) {
      dateList.push({
        class: 'next-month',
        day: endDay.add(i, 'day').format('YYYY-MM-DD')
      })
    }
  }
  dateArr.value = dateList
  let minStatDate = dayjs(dateList[0].day).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      maxStatDate = dayjs(dateList[dateList.length - 1].day).endOf('day').format('YYYY-MM-DD HH:mm:ss')
  getWarnData({minStatDate, maxStatDate})
}

function formatDay(day:string):string {
  return dayjs(day).format('DD')
}

function preMonth() {
  curMonth.value = dayjs(curMonth.value).subtract(1, 'month').format('YYYY-MM')
}

function nextMonth() {
  curMonth.value = dayjs(curMonth.value).add(1, 'month').format('YYYY-MM')
}

const getWarnData = async(obj:{minStatDate:string, maxStatDate:string}) => {
  const res = await apiGetWarnCalendar({queryTime:curMonth.value})
  warnData.value = res.data
  // apiGetCompreWarningCalendar({minStatDate, maxStatDate}).then(res => {
  //   const {statDateList, countList} = res.data
  //   statDateList.forEach((date, index) => {
  //     this.warnData[date] = countList[index]
  //   });
  //   this.$forceUpdate()
  // })
}
</script>
<style lang="scss" scoped>
$white-light-color: #E2EDFF;
.calendar {
  color: #fff;

  .hd {
    color: $white-light-color;
  }

  .week-bar {
    background: rgba(86, 171, 255, 0.2);
    color: $white-light-color;
    height: 2rem;
  }

  .pre-month, .next-month {
    color: $white-light-color;
    opacity: 0.5;
  }

  .number {
    display: inline-block;
    width: 35px;
    height: 30px;
    background: linear-gradient(134deg, rgba(115, 190, 232, 0.29) 0%, rgba(18, 82, 141, 0.39) 100%);
    border-radius: 10px 10px 10px 0px;
    border: 1px solid;
    border-image: linear-gradient(135deg, rgba(76, 248, 254, 1), rgba(200, 240, 250, 0.27)) 1 1;
    padding: 2px;
    clip-path: inset(0 round 10px 10px 10px 0px);
    margin-left: 2px;
  }
}
</style>
