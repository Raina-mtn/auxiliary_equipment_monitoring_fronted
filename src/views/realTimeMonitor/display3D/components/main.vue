<template>
  <div class="main-panle w-3/4">
    <div class="tabs flex">
      <div class="tab mr-2 w-28" style="cursor: pointer;" :class="activeIndex === index ? 'active' : ''"
        v-for="(item, index) in tabs" :key="index" @click="handleChangeTab(index)">{{ item.name }}</div>
    </div>
    <div class="main py-7">
      <div class="model3D">
        <myThree ref="mythreeRef" :icon-type="tabs[activeIndex].iconType"></myThree>
      </div>
    </div>
  </div>
</template>
    
<script setup lang='ts'>
import myThree from '@/components/MyThree/index.vue';
import { ref, watch, nextTick } from "vue";

const props = defineProps(['points'])
const emits = defineEmits(['changTab'])
const mythreeRef = ref()

let tabs = [
  {
    name: '视频监控',
    iconType: 'monitor'
  },
  {
    name: '安全防卫',
    iconType: 'safty'
  },
  {
    name: '动环监控',
    iconType: 'movingRing'
  },
  {
    name: '在线监测',
    iconType: 'online'
  },
  {
    name: '告警分布',
    iconType: 'warn'
  },
]
const activeIndex = ref(0)
const handleChangeTab = (index: number) => {
  activeIndex.value = index
}

watch(activeIndex, (newVal, oldVal) => {
  mythreeRef.value.delIcon(tabs[oldVal].iconType)
  emits('changTab', tabs[newVal].name)
})

watch(() => props.points, (val) => {
  nextTick(() => {
    mythreeRef.value.setIcon(val)
  })
}, {
  deep: true,
  immediate: true
})

</script>
    
<style scoped lang="scss">
.main-panle {
  height: 95%;

  .tabs {
    width: 97%;
    height: 38px;
    margin: 0 auto;

    .tab {
      height: 38px;
      background: #1b3d9f;
      border-radius: 4px 4px 0px 0px;
      opacity: 1;
      border: 1px solid #1765e3;
      text-align: center;
      font-size: 18px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
      line-height: 38px;
    }

    .active {
      background: #1765e3;
    }
  }

  .main {
    width: 97%;
    height: calc(100% - 38px);
    background-color: #0b2363;
    margin: 0 auto;

    .model3D {
      width: 95%;
      height: 100%;
      margin: 0 auto;
    }
  }
}
</style>