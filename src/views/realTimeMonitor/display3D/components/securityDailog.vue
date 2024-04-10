<template>
  <el-dialog v-model="securityShow" title='设备信息' width="20%">
    <div class="mian">
      <div class="icons w-full h-4/5 flex flex-col">
        <div class="line h-1/5 mb-1 flex justify-between">
          <div class="h-full flex">
            <i class="iconfont icon-zhuangtai mr-2"></i>
            <div class="leading-normal" :style="{ color: props.info.monitorState ? 'red' : '#36B236' }">{{
              props.info.monitorState ? '警告' : '正常' }}</div>
          </div>
          <el-switch v-model="props.info.switchState" />
        </div>
        <div class="line h-1/5 mb-4 flex">
          <i class="iconfont icon-dingwei mr-2"></i>
          <div class="leading-normal" style="color: #FFFFFF;">{{ props.info.deployAreaName }}</div>
        </div>
        <div class="line h-1/5 mb-4 flex">
          <i class="iconfont icon-bianhao mr-2"></i>
          <div class="leading-normal" style="color: #FFFFFF">{{ props.info.equipmentCode }}</div>
        </div>
        <div class="line h-1/5 mb-4 flex">
          <i class="iconfont icon-leixing mr-2"></i>
          <div class="leading-normal" style="color: #FFFFFF">{{ props.info.equipmentName }}</div>
        </div>
      </div>
      <div class="w-full w-full h-1/5 leading-loose mt-2" style="color: #FFFFFF;">{{ time }}</div>
    </div>
  </el-dialog>
</template>
<script lang='ts' setup>
import { ref, onMounted, onBeforeUnmount, defineExpose } from "vue";
import dayjs from "dayjs";

let securityShow = ref(false)
const props = defineProps(["equipmentCode", "info"]);
let timer: string | number | NodeJS.Timeout | null | undefined = null;
let time = ref(dayjs().format("YYYY-MM-DD HH:mm:ss"));

function open() {
  securityShow.value = true
};

onMounted(() => {
  timer = setInterval(() => {
    time.value = dayjs().format("YYYY-MM-DD HH:mm:ss");
  }, 1000);
});
onBeforeUnmount(() => {
  clearInterval(timer)
  timer = null
})
defineExpose({
  open,
});
</script>
  
<style scoped lang='scss'>
.dialog {
  z-index: 9999999999999999999999999999999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background-color: #0b2363;

  .title {
    height: 2.5rem;
    background-color: #1765e3;
    color: #fff;
    line-height: 2.5rem;

    .text {
      font-size: 16px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
    }
  }

  .mian {
    width: 90%;
    height: calc(100% - 4.5rem);
    margin: 1rem auto 0 auto;

    // background-color: #fff;
    .icons {
      border-bottom: 1px solid rgba(255, 255, 255, 0.25);

      i {
        width: 18px;
        height: 18px;
        color: #16dbe7;
      }
    }
  }
}

.icons {
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);

  i {
    width: 18px;
    height: 18px;
    color: #16dbe7;
  }
}
</style>