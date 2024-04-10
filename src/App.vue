<template>
  <router-view />
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { userStore } from '@/store/index'


const useUserStore = userStore()
let beforeUnloadTime = ref(0)
let gapTime = ref(0)

const beforeunloadHandler = () => {
  beforeUnloadTime.value = new Date().getTime();
}

const unloadHandler = () => {
  gapTime.value = new Date().getTime() - beforeUnloadTime.value;
  console.log(gapTime.value);

  //判断是窗口关闭还是刷新
  if (gapTime.value <= 10) {//浏览器关闭
    window.localStorage.clear()
    useUserStore.logout()
  }
}

onMounted(() => {
  //监听页面卸载（关闭）或刷新
  window.addEventListener('beforeunload', () => beforeunloadHandler())

  window.addEventListener('unload', () => unloadHandler())
})

</script>

<style>
.content {
  width: 1000px;
  display: flex;

  .desc {
    font-size: 14px;
    color: #FFFFFF;
    margin-left: 16px;

    p {
      margin-bottom: 2px;
    }
  }
}

.el-notification__group {
  margin-left: 0 !important;
}

.el-notification {
  width: 380px !important;
}
</style>