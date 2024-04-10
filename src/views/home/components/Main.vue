<template>
  <div class="w-1/2">
    <section class="h-72px flex w-2/3 mx-auto">
      <div class=" flex flex-1 items-center" v-for="item in todoConfig" :key="item.key">
        <img :src="item.url" class="h-72px">
        <p class="text-white pl-2">
          <label class="block">{{ item.name }}</label>
          <CountTo :endVal="titleData[item.key]" color="#fff" class="text-3xl font-bold" />
        </p>
      </div>
    </section>
    <section class="h-45/50">
      <div class="main py-7">
        <div class="model3D">
          <myThree ref="mythreeRef" :iconData="props.warnData" :iconType="'warn'"></myThree>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import CountTo from '@/components/CountTo/CountTo.vue'
import { todoConfig } from '../config/index'
import { apiGetWarnNum } from "@/api/interface/home";
import { onMounted, provide } from "vue";
import myThree from "@/components/MyThree/index.vue";



const props = defineProps(['warnData', 'currentWarnInfo'])
const mythreeRef = ref()
const titleData = ref<Record<string, any>>({})
const getWarnNum = async () => {
  const res = await apiGetWarnNum();
  titleData.value = res.data
}

watch(() => props.currentWarnInfo, () => {
  nextTick(() => {
    mythreeRef.value.setIcon([props.currentWarnInfo])
  })
}, {
  immediate: true,
  deep: true
})

onMounted(() => {
  getWarnNum();
})
provide('titleData', titleData.value)
</script>

<style scoped>
.main {
  width: 98%;
  height: 100%;
  background-color: rgba(7, 34, 78, 1);
  background: transparent;
  margin: 0 auto;

  .model3D {
    width: 98%;
    height: 100%;
    margin: 0 auto;
  }
}
</style>
