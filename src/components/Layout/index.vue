<template>
  <div class="layout-content" @mouseover="onmouseovered">
    <Header />
    <div class="layout-route-view">
      <router-view></router-view>
    </div>
    <CameraDialog />
    <LinkageDialog />
    <div class="alarm-icon" v-if="showAlarmGif">
      <img :src="getAssetsImge('alarm.gif')">
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './header/index.vue'
import { ElMessageBox } from 'element-plus'
import { userStore, wsStore } from '@/store/index'
import { ref, onUnmounted } from "vue";
import CameraDialog from './component/CameraDialog.vue'
import LinkageDialog from './component/LinkageDialog.vue'
import { getAssetsImge } from '@/utils';

const useUserStore = userStore();
const useWsStore = wsStore()

let timer = ref()
const showAlarmGif = ref(false)


onUnmounted(() => {
  clearTimeout(timer.value)
})

useWsStore.initWs()

useWsStore.$subscribe((_, wsState) => {
  if (wsState.showAlarm) {
    showAlarmGif.value = true
  } else {
    showAlarmGif.value = false
  }
})


function onmouseovered() {
  clearTimeout(timer.value)
  countTime()
}
// 无操作30分钟后自动登出
function countTime() {
  timer.value = setTimeout(function () {

    ElMessageBox.alert(
      '您在30min内未进行任何操作，即将自动结束会话',
      '提示',
    ).then(() => {
      useUserStore.logout()
    })
    setTimeout(() => {
      ElMessageBox.close()
      useUserStore.logout()
      clearTimeout(timer.value)
    }, 3000)
  }, 30 * 60 * 1000)
}
</script>

<style lang="scss" scoped>
.layout-content {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #081F4D;

  .layout-route-view {
    width: 100%;
    flex: 1;
    max-height: calc(100% - 130px);
  }
}

.alarm-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
