<template>
<div class="text-center text-[#fff] text-14px">
  <div class="w-52px h-52px rounded-1/2 flex justify-center items-center mx-auto mb-5px" :style="{'background-color':currentStatus.bg}" >
    <i :class="['iconfont','!text-32px','text-[#fff]',item.icon]" :style="{'color':currentStatus.color}"></i>
  </div>
  {{ item.label }}
</div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
interface Item {
  code:string
  label:string
  icon:string
}
interface Props {
  item:Item
  status:number
}
const props = defineProps<Props>()
const currentStatus = computed(()=>{
  if(props.status===2){
    console.log('props.status :>> ', props.status);
  }
  switch(props.status){
    case 1:
      return {
        color:'#FF7729',
        bg:'#52320E'
      }
    case 2:
      return {
        color:'#F2274A',
        bg:'#5E0C0C'
      }
      default:
        return {
          color:'#0AF0FD',
          bg:'#1B3D9F'
        }
  }
})
</script>

<style lang="scss" scoped>

</style>