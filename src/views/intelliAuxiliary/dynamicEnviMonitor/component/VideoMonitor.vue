<template>
  <div class="video-container">
    <header class="p-4 flex justify-between">
      <span>视频监控</span>
      <el-select v-model="state.choosedCameraIndex" value-key="id">
        <el-option v-for="item in state.cameraList" :key="item.id" :label="item.equipmentName" :value="item.id" />
      </el-select>
    </header>
    <section class="p-4">
      <div class="camera_ifame">
        <HkNoPlugin ref="cameraIfameRef" :iWndowType="1" :camera-list="state.cameraList" />
      </div>
      <p>云台控制</p>
      <PTZ />
      <p>灯光控制 <el-switch class="mx-4" :value="state.lightStatus" @change="changeStatus"></el-switch>已开启</p>
    </section>
  </div>
</template>
    
<script setup lang='ts'>
import PTZ from '@/components/HkCamera/NoPlugin/PTZ.vue';
import HkNoPlugin from '@/components/HkCamera/NoPlugin/index.vue'
import { apiGetEquipmentSelectList, apiControlLight, apiGetLightStatus } from '@/api/interface/intelliAuxiliary/equipment';
import type { Camera } from '@/api/interface/types';
import { watch, reactive } from 'vue';
import { monitorStore } from '@/store/modules/monitor';

const useMonitorStore = monitorStore()


const props = defineProps(['categoryCode'])
const state = reactive({
  cameraList: [] as Camera[],
  choosedCameraIndex: 0,
  lightStatus: false
})
watch(() => state.choosedCameraIndex, (val) => {
  const camera = state.cameraList[val] // 这里id是他的index
  useMonitorStore.playCamera(camera)
  getLightStatus(val)
})

watch(() => props.categoryCode, () => {
  getSelectList()
})


getSelectList()
function getSelectList() {
  const params = {
    page: {
      pageIndex: 1,
      pageSize: 100
    },
    categoryCode: props.categoryCode
  }
  apiGetEquipmentSelectList(params).then(res => {
    state.cameraList = (res.data || []).map((v: any, index: number) => ({
      ip: v.ipAddress,
      port: v.port,
      userName: v.account,
      password: v.secretKey,
      channel: v.channelNumber,
      equipmentName: v.equipmentName,
      id: index,
      lineId: v.lineId
    }))
    getLightStatus(state.choosedCameraIndex)
  })
}

// 获取灯光状态
function getLightStatus(index: number) {
  const { lineId } = state.cameraList[index]
  apiGetLightStatus(lineId).then(res => {
    state.lightStatus = !!res.data
  })
}
// 切换灯光控制
function changeStatus() {
  const params = {
    lightStatus: state.lightStatus,
    lineId: state.cameraList[state.choosedCameraIndex].lineId
  }
  apiControlLight(params).then(() => {
    state.lightStatus = !state.lightStatus
  })
}
</script>
    
<style lang="scss" scoped>
header {
  height: 62px;
  background: #1765E3;
  color: #fff;
}

.video-container {
  background: #193580;
}

section {
  .camera_ifame {
    width: 100%;
    height: 312px;
  }

  p {
    font-size: 14px;
    color: #fff;
    margin-top: 10px;
  }
}
</style>