<template>
  <div class="time text-light-50 p-16px">
    <left-panel title="告警设置" />
    <div class="flex-1 p-4 bg-deepBlue ml-4 text-green">
      <Title title="告警延时设置" class="mt-4 mb-2" />
      <div class="flex items-center text-light-100 text-14px">
        <span>告警发生后，延时</span>
        <el-input v-model="delayed.time" class="w-80px ml-3" placeholder="请输入" @blur="setDelayConfig()" />
        <el-select v-model="delayed.unit" class="m-3 w-80px" placeholder="请选择" @change="setDelayConfig()">
          <el-option v-for="item in unitList" :key="item.units" :label="item.description" :value="item.units" />
        </el-select>
        <span>后上报平台。</span>
        <el-switch v-model="delayed.switch" class="ml-4" @change="setDelayConfig()" />
      </div>
      <Title title="告警通知设置" class="mt-8 mb-2" />
      <div class="flex text-light-100 text-14px mt-4">
        <div
          class="flex items-center justify-center w-88px h-40px border border-[#1765E3] bg-[#1B3D9F] rounded-3px cursor-pointer"
          :style="{ background: inform.platformPopup ? '#369EF8' : '#1B3D9F' }" @click="
            inform.platformPopup = !inform.platformPopup;
          setInformConfig();
          ">
          平台弹窗
        </div>
        <div
          class="flex items-center justify-center w-88px h-40px border border-[#1765E3] bg-[#1B3D9F] rounded-3px ml-4 cursor-pointer"
          :style="{
            background: inform.photoacousticAlarm ? '#369EF8' : '#1B3D9F',
          }" @click="
  inform.photoacousticAlarm = !inform.photoacousticAlarm;
setInformConfig();
">
          光声报警
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftPanel from '../../components/LeftPanel.vue'
import Title from "@/views/system/components/Title.vue";
import { ElMessage } from "element-plus";
import {
  apiGetInformConfig,
  apiGetDelayConfig,
  apiSetDelayConfig,
  apiSetInformConfig,
} from "@/api/interface/system/alarm";
import { listUnit } from '@/api/interface/dataAnalyse/dataAnalyse'
import { reactive, ref, onMounted } from 'vue';
// 设置设备通知延时设置

const delayed = reactive({
  time: null,
  unit: "",
  switch: false,
  equipmentId: 0
});
const inform = reactive({
  platformPopup: true,
  photoacousticAlarm: true,
});
const unitList = ref();

function setDelayConfig() {
  if (delayed.time && delayed.unit) {
    apiSetDelayConfig({
      open: delayed.switch,
      ...delayed,
    }).then((res) => {
      if (res.status.code === 1) {
        // ElMessage.success('告警延时设置成功!')
        ElMessage({
          showClose: true,
          message: "告警延时设置成功!",
          type: "success",
        });
      }
    });
  } else {
    if (!delayed.time) return ElMessage.error('请输入延时时间')
    if (!delayed.unit) return ElMessage.error('请输入延时时间单位')
  }
}

// 设置设备告警通知方式
function setInformConfig() {
  apiSetInformConfig({ ...inform }).then(
    (res) => {
      if (res.status.code === 1) {
        ElMessage({
          showClose: true,
          message: "设备告警通知方式设置成功!",
          type: "success",
        });
      }
    }
  );
}
onMounted(() => {
  getDelayConfig()
  getInformConfig()
})
// 获取设备告警延时设置
function getDelayConfig() {
  apiGetDelayConfig({ equipmentId: '0' }).then((res) => {
    delayed.time = res.data.time ? res.data.time : 0;
    delayed.unit = res.data.unit === "" ? "秒" : res.data.unit;
    delayed.switch = res.data.open;
  });
}
// 获取设备告警通知方式设置
function getInformConfig() {
  apiGetInformConfig({ equipmentId: '0' }).then((res) => {
    inform.platformPopup = res.data.platformPopup;
    inform.photoacousticAlarm = res.data.photoacousticAlarm;
  });
}

getUnitList()
async function getUnitList() {
  const res = await listUnit({ unitCategory: 'TIME' })
  unitList.value = res.data || []

}
</script>
<style scoped lang="scss">
.time {
  display: flex;
  width: 100%;
  height: 100%;
  padding-top: 32px;

  &-content {
    flex: 1;
    height: 100%;
    background: #0B2363;
    margin-left: 16px;

    &__header {
      .header-line {
        width: 4px;
        height: 20px;
        background: #0AF0FD;
        border-radius: 8px 8px 8px 8px;
        opacity: 1;
      }

      .header-name {
        font-size: 16px;
        color: #FFFFFF;
        margin-left: 10px;
      }
    }

    &__types {
      padding-left: 4px;
      margin-top: 20px;

      .types-item {
        margin-bottom: 16px;
        font-size: 14px;
      }
    }
  }
}
</style>
