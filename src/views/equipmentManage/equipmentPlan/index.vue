<template>
  <div class="bg-[#0B2363] w-[100%_-_48px] h-[100%_-_48px] flex flex-col items-center p-32px m-24px">
    <div class="flex self-end mb-32px">
      <div class="w-70px flex items-center text-[#fff] text-[14px]" v-for="item in legendList" :key="item.label">
        <div class="w-8px h-8px mr-7px rounded-2px" :style="{'background-color':item.color}"></div>
        <div>{{ item.label }}</div>
      </div>
    </div>
    <div class="bg w-1400px h-650px relative">
      <div class="w-250px h-400px flex flex-wrap absolute place-content-start top-250px">
        <IconItem class="w-[50%] h-[25%]" v-for="item in environmentalList" :item="item" :status="warnList.find(i=>i.categoryCode === item.code)?.status||0"></IconItem>
      </div>
      <div class="w-250px h-400px flex flex-wrap absolute place-content-start top-250px left-[27%]">
        <IconItem class="w-[50%] h-[25%]" v-for="item in dynamicList" :item="item" :status="warnList.find(i=>i.categoryCode === item.code)?.status||0"></IconItem>
      </div>
      <div class="w-250px h-400px flex flex-wrap absolute place-content-start top-250px left-[55%]">
        <IconItem class="w-[50%] h-[25%]" v-for="item in safeList" :item="item" :status="warnList.find(i=>i.categoryCode === item.code)?.status||0"></IconItem>
      </div>
      <div class="w-250px h-400px flex flex-wrap absolute place-content-start top-250px left-[82%]">
        <IconItem class="w-[50%] h-[25%]" v-for="item in equipmentList" :item="item" :status="warnList.find(i=>i.categoryCode === item.code)?.status||0"></IconItem>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import {ref,onMounted,onBeforeUnmount} from 'vue'
import {legendList,environmentalList,dynamicList,safeList,equipmentList} from './config'
import {apiGetAbnormalList} from '@/api/interface/intelliAuxiliary/equipment'
import IconItem from './iconItem.vue';
interface WarnItem {
  categoryCode:string
  status:number
}
const warnList = ref<WarnItem[]>([])
const timer = ref()
const getList = ()=>{
  apiGetAbnormalList({}).then(res=>{
    warnList.value = res.data
  })
}
onMounted(() => {
  getList()
  timer.value = setInterval(()=>{
    getList()
  },5*1000)
})
onBeforeUnmount(()=>{
  clearInterval(timer.value)
})

</script>
    
<style lang="scss" scoped>
  .bg{
    background: url('@/assets/images/equipmentBg.png') no-repeat;
    background-size: 100% 100%;
  }
</style>