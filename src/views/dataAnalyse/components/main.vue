<template>
  <div class="main-panel w-full flex justify-between h-1/3 mt-4">
    <div class="left w-69/100 h-full flex flex-col">
      <Title title="告警趋势统计" class="h-12 w-full"></Title>
      <div class="flex h-1/4 w-full">
        <div class="flex h-4/5 w-1/3 flex-col pl-8 my-2">
          <span class="w-30 text-center number">{{ state.totalWarnNum }}</span>
          <span class="w-30 text-center"
            style="font-size: 14px;font-weight: 400;color: rgba(255,255,255,0.7);">新增总告警数</span>
        </div>
        <div class="flex h-4/5 w-1/3 flex-col pl-8 my-2" style="border-left: 2px solid #244BB2;">
          <span class="w-30 text-center number number1">{{ state.finishWarnNum }}</span>
          <span class="w-30 text-center"
            style="font-size: 14px;font-weight: 400;color: rgba(255,255,255,0.7);">已确认告警数</span>
        </div>
        <div class="flex h-4/5 w-1/3 flex-col pl-8 my-2" style="border-left: 2px solid #244BB2;">
          <span class="w-30 text-center number number2">{{ state.finishWarnRate }}</span>
          <span class="w-30 text-center"
            style="font-size: 14px;font-weight: 400;color: rgba(255,255,255,0.7);">告警确认率</span>
        </div>
      </div>
      <div class="chart-container w-full">
        <Chart :option="LineOption" />
      </div>
    </div>
    <div class="right w-30/100 h-full flex flex-col">
      <Title title="告警占比统计" class="h-12 w-full"></Title>
      <div class="h-10 w-full flex justify-end mr-8 mt-5">
        <div class="btn px-4" :class="item.checked ? 'active' : ''" v-for="(item, index) in profile" :key="index"
          @click="choseBtn(item)">{{ item.name }}</div>
      </div>
      <div class="chart-container w-full">
        <div class="h-full w-full">
          <Chart :option="profileOption" />
        </div>
      </div>
    </div>
  </div>
</template>
      
<script setup lang="ts">
import Title from "./Title.vue";
import Chart from "@/components/Chart/Chart.vue";
import { reactive, ref, onMounted, watch } from "vue";

import { qxOption, pieOption } from "../config/chart.config";

import {
  apiGetProportion,
  apiGetTrend
} from "@/api/interface/dataAnalyse/dataAnalyse";



const props = defineProps(['searchParams'])

let state = reactive({
  finishWarnNum: null,
  finishWarnRate: null,
  totalWarnNum: null
});
// 占比
const profile = reactive([
  {
    name: "告警类型",
    value: "WARN_TYPE",
    checked: true
  },
  {
    name: "区域",
    value: "AREA",
    checked: false
  },
  {
    name: "告警等级",
    value: "WARN_LEVEL",
    checked: false
  },
  {
    name: "处理状态",
    value: "HANDLE_STATUS",
    checked: false
  }
]);
let profileOption = ref();
let LineOption = ref();


// 告警占比
async function getProportion() {
  let type = "";
  profile.forEach(item => {
    if (item.checked === true) {
      type = item.value;
    }
  });
  apiGetProportion({
    proportionType: type,
    ...(props.searchParams || {})
  }).then(res => {
    let TypeName = [] as string[];
    let value = [] as string[];
    if (res.data?.proportionList.length) {
      res.data.proportionList.forEach((i: any) => {
        TypeName.push(i.name);
        value.push(i.value);
      });
      profileOption.value = pieOption({
        totalWarnNum: res.data.totalWarnNum,
        data: res.data.proportionList,
        TypeName: TypeName,
        value: value
      });

    } else {
      profileOption.value = {}
    }
    console.log(profileOption);

  });
}

// 告警趋势统计
function getTrend() {
  apiGetTrend(props.searchParams).then(res => {
    state.finishWarnNum = res.data.finishWarnNum;
    state.finishWarnRate = res.data.finishWarnRate;
    state.totalWarnNum = res.data.totalWarnNum;
    const warnNumList = res.data.warnNumList || []
    if (warnNumList.length) {
      const xData = warnNumList[0]?.dateNumVOList.map((v: { time: string }) => v.time)
      const sData = warnNumList.map((v: { type: string, dateNumVOList: any[] }) => ({
        name: v.type,
        ydata: (v.dateNumVOList || []).map(v => v.num)
      }))
      LineOption.value = qxOption({ xData, sData })

    } else {
      LineOption.value = {}
    }
  })
}

// 告警占比选择
function choseBtn(item: { checked: boolean }) {
  profile.forEach(i => {
    i.checked = false;
  });
  item.checked = true;
  getProportion();
}

watch(() => props.searchParams,
  () => {
    getProportion();
    getTrend();
  },
  { immediate: true, deep: true }
);
onMounted(() => {
  getProportion();
  getTrend();
});
</script>
      
<style scoped lang="scss">
.main-panel {
  color: white;

  .chart-container {
    height: calc(100% - 110px);
  }

  .left {
    background: #0b2363;
  }

  .right {
    background: #0b2363;

    .btn {
      width: auto;
      height: 2.5rem;
      line-height: 2.5rem;
      text-align: center;
      background: #1b3d9f;
      cursor: pointer;
    }

    .active {
      background: #369ef8;
    }
  }

  .number {
    font-size: 28px;
    font-weight: bold;
  }

  .number1 {
    color: #0af0fd;
  }

  .number2 {
    color: #ff7729;
  }
}
</style>
      