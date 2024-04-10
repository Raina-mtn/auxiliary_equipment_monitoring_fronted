<template>
  <div class="left-panel w-1/4 flex flex-col justify-between">
    <!--    站点信息-->
    <section class="h-2/7 mb-2" v-if="stationData">
      <Title title="站点信息" sub-title="Site Information" class="mb-2" />
      <div class="left-panel__station flex items-center">
        <div class="h-full w-1/2">
          <Chart :option="waterChartOption" />
        </div>
        <div class="w-1/2 text-white">
          <h3>{{ stationData.name }}</h3>
          <p><label>负责人:</label><span>{{ stationData.charger }}</span></p>
          <p><label>联系方式:</label><span>{{ stationData.mobile }}</span></p>
          <p><label>详细地址:</label><span>{{ stationData.addressDetail }}</span></p>
        </div>
      </div>
    </section>
    <!--    运行概况-->
    <section class="mb-2 h-1/3" v-if="runOverview">
      <Title title="运行概况" sub-title="Operation Profile" class="mb-2" />
      <div class="left-panel__profile flex items-center">
        <div class="w-1/2">
          <div class="h-180px">
            <Chart :option="profileOption" />
          </div>
          <div class="number">
            <div class="number-item">
              <span class="text-white">正常</span>
              <span class="text-primary">{{ runOverview.normalNum }}</span>
            </div>
            <div class="number-item">
              <span class="text-white">异常</span>
              <span class="text-danger">{{ runOverview.abnormalNum }}</span>
            </div>
          </div>
        </div>
        <div class="w-1/2 text-white">
          <div class="list-item">
            <p><label>主设备数量:</label><span><b class="text-primary">{{ runOverview.mainNum }}</b>个</span></p>
          </div>
          <div class="list-item">
            <p><label>传感器数量:</label><span><b class="text-primary">{{ runOverview.sensorNum }}</b>个</span></p>
          </div>
          <div class="list-item">
            <p><label>告警次数:</label><span><b class="text-primary">{{ runOverview.warnTotalNum }}</b>次</span></p>
          </div>
          <div class="list-item">
            <p><label>已处理告警次数:</label><span><b class="text-primary">{{ runOverview.handleWarnNum }}</b>次</span></p>
          </div>
        </div>
      </div>
    </section>
    <!--    实时告警-->
    <section class="flex-1 h-8/21">
      <Title title="实时告警" sub-title="Real-time Alarm" class="mb-2" />
      <div style="height: calc(100% - 40px); overflow-y: auto; scrollbar-width: thin;" v-if="props.warnData.length !== 0">
        <div v-for="item in props.warnData" :key="item.id" class="warn-item">
          <p class="title">
            <label><span>{{ item.warnTargetName }}</span>
              <span class="title-status title-status__danger">{{ item.warnLevelName }}</span></label>
            <!-- :disabled="item.auditStatus === '已处理' ? true : false " -->
            <el-button @click="open(item.id)" v-show="item.checkStatus === 0">审核</el-button>
          </p>
          <el-descriptions :column="2">
            <el-descriptions-item v-for="alarm in alarmConfig" v-bind="alarm">
              <span>{{ alarm.transObj ? alarm.transObj[item[alarm.key]] : item[alarm.key] }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <p class="text-primary text-center cursor-pointer" @click="getMore">查看更多
          <el-icon>
            <ArrowDown />
          </el-icon>
        </p>
      </div>
      <NoData v-else></NoData>
    </section>
    <CheckDialog ref="checkRef" @polling="refresh"></CheckDialog>
  </div>
</template>

<script setup lang="ts">
import Title from './Title.vue'
import Chart from '@/components/Chart/Chart.vue'
import CheckDialog from './CheckDialog.vue'
import { pieOption, waterOption } from '../config/chart.config'
import { ref, onMounted, onBeforeUnmount, inject } from "vue";
import { alarmConfig } from '../config/index'
import { apiGetRunOverview } from '@/api/interface/home';
import { router } from '@/router';
import { getStation } from '@/api/interface/system/site';

import NoData from '@/components/NoData.vue';

const props = defineProps(['warnData'])
const emits = defineEmits(['refresh'])
const waterChartOption = ref(waterOption())
const profileOption = ref();
const stationData = ref()
const runOverview = ref()

const checkRef = ref()
let timer: string | number | NodeJS.Timeout | null | undefined = null;
const titleData = inject('titleData')



//站点信息
const getStationInfo = async () => {
  const res = await getStation();
  const addressDetail = res.data.districtName.replace(/-/g, '') + res.data.address;
  stationData.value = res.data
  stationData.value.addressDetail = addressDetail
  //优，良，差显示
  if (titleData) {
    switch (titleData.health) {
      case '优':
        waterChartOption.value = waterOption(1);
        break
      case '良':
        waterChartOption.value = waterOption(2);
        break
      case '差':
        waterChartOption.value = waterOption(3);
        break
    }
  }
}



//运行概括
const getRunOverview = async () => {
  const res = await apiGetRunOverview();
  runOverview.value = res.data;
  profileOption.value = pieOption(res.data.totalAccessNum, '接入设备数量', 240);
}

//审核按钮
const open = (value: number) => {
  const data = props.warnData.find((item: any) => item.id === value)
  checkRef.value?.open(data)
}
//查看更多
const getMore = () => {
  router.push('/home/taskCenter/warningList')
}

function refresh() {
  emits('refresh')
}

onBeforeUnmount(() => {
  clearInterval(timer)
  timer = null
})
onMounted(() => {
  getStationInfo();
  getRunOverview();
})

</script>


<style scoped lang="scss">
.left-panel {
  position: relative;

  &__station {
    height: calc(100% - 60px);
    border: 1px solid rgba(78, 164, 235, 0.5);
    background: rgba(78, 164, 235, 0.2);
    min-height: 160px;
    margin: 10px 0;
  }

  &__profile {
    height: calc(100% - 40px);

    .number {
      display: flex;
      margin-top: 1rem;

      .number-item {
        width: 6rem;
        height: 2rem;
        background: linear-gradient(270deg, rgba(63, 127, 220, 0.35) 0%, rgba(63, 127, 220, 0) 100%);
        border-radius: 0px 0px 0px 0px;
        opacity: 1;
        border: 1px solid;
        border-image: linear-gradient(342deg, rgba(46, 194, 252, 1), rgba(46, 194, 252, 1), rgba(46, 194, 252, 0)) 1 1;
        display: flex;
        justify-content: space-between;
        margin: 0 1rem;


        span:first-child {
          margin-top: -1rem;
        }

        span:last-child {
          margin-right: 1rem;
        }
      }
    }

    .list-item {
      border: 1px solid rgba(78, 164, 235, 0.5);
      background: rgba(63, 127, 220, 0.25);
      margin-bottom: 1rem;
      clip-path: polygon(0 0, 100% 0, 100% 70%, 95% 100%, 0% 100%);

      p {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: calc(100% - 2px);
        padding: 4px;
        background: rgba(63, 127, 220, 0.25);
      }

      b {
        margin-right: 5px;
      }
    }
  }

  .warn-item {
    margin-bottom: 0.2rem;
    padding: 0.8rem 0.5rem;
    background: rgba(63, 127, 220, 0.2);
    border: 1px solid rgba(78, 164, 235, 0.5);

    :deep(.el-descriptions__body) {
      background: none;
    }


    p {


      &.title {
        color: #fff;
        justify-content: space-between;
        display: flex;

        .title-status {
          border-radius: 4px 4px 4px 4px;
          opacity: 1;
          margin-left: 5px;
          font-size: 0.8rem;
          padding: 2px 4px;

          &__danger {
            background: #280F0C;
            border: 1px solid #FF5C43;
            color: #FF5C43;
          }
        }

        .el-button {
          background: linear-gradient(180deg, rgba(19, 47, 95, 0.7) 0%, rgba(80, 140, 245, 0.7) 100%);
          border-radius: 4px 4px 4px 4px;
          opacity: 1;
          border: 1px solid #148FF5;

        }
      }

    }
  }
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: transparent;
}

/*定义滚动条轨道
内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  // background-color:#F5F5F5;
  background-color: transparent;

}

/*定义滑块
内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: rgba(59, 130, 246, 0.5);
}
</style>
