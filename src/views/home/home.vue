<template>
  <div class="home-container flex justify-between px-4">
    <LeftPanel :warnData="state.leftWarnData" @refresh="getWarnList" />
    <Main :warnData="state.mainWarnData" :currentWarnInfo="state.currentWarnInfo" />
    <RightPanel />
  </div>
</template>
<script setup lang="ts">
import LeftPanel from "./components/LeftPanel.vue";
import Main from "./components/Main.vue";
import RightPanel from "./components/RightPanel.vue";
import { wsStore } from '@/store/index'
import { apiGetTaskList } from '@/api/interface/taskCenter'
import { reactive } from "vue";
import { isEqual, cloneDeep } from "lodash-es";


const useWsStore = wsStore()
const state = reactive({
  ifRefresh: false, // 是否是首次进入
  leftWarnData: [], // 左边右下角展示的报警数据，最多3条,
  mainWarnData: [], // 中间3维定位展示icon点 
  currentWarnInfo: {}
})


useWsStore.$subscribe((_, wsstate) => {
  if (wsstate.refreshFlag) {
    state.ifRefresh = true
    getWarnList()
  }
  if (!isEqual(state.currentWarnInfo, wsstate.currentWarnInfo)) {
    state.currentWarnInfo = cloneDeep(wsstate.currentWarnInfo)
  }
})
getWarnList()
function getWarnList() {
  const params = {
    page: {
      pageIndex: 1,
      pageSize: 10
    }
  }
  apiGetTaskList(params).then(res => {
    if (!state.ifRefresh) { // 刷新后中间模型从推送中拿消息，不从接口拿了
      state.mainWarnData = res.data.list
    }
    state.leftWarnData = res.data.list.slice(0, 3)
    useWsStore.setRefreshFlag(false)
  })
}



</script>
<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100%;
  background: url('@/assets/images/home_bg.png') center bottom no-repeat;
  background-size: 100% auto;
}
</style>
