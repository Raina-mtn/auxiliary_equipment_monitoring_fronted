<template>
  <el-dialog v-model="state.dialogVisible" title="告警详情" width="95%" @close="close">
    <div class="main-content">
      <div class="main-top">
        <el-descriptions column="6">
          <template #title>
            <h4><i class="tri-arrow" />基本信息</h4>
          </template>
          <el-descriptions-item label="区域名称:">{{ state.basicInfo.areaName ? state.basicInfo.areaName : '--'}}</el-descriptions-item>
          <el-descriptions-item label="点位名称:">{{ state.basicInfo.pointName ? state.basicInfo.pointName : '--' }}</el-descriptions-item>
          <el-descriptions-item label="点位编号:">{{ state.basicInfo.pointId ? state.basicInfo.pointId : '--'}}</el-descriptions-item>
          <el-descriptions-item label="设备名称:">{{ state.basicInfo.primaryEquipmentName ? state.basicInfo.primaryEquipmentName : '--'}}</el-descriptions-item>
          <el-descriptions-item label="设备编号:">{{ state.basicInfo.primaryEquipmentId ? state.basicInfo.primaryEquipmentId : '--'}}</el-descriptions-item>
          <el-descriptions-item label="告警时间:">{{ state.basicInfo.warnTime ? state.basicInfo.warnTime : '--'}}</el-descriptions-item>

          <el-descriptions-item label="传感器名称:">{{ state.basicInfo.equipmentName ? state.basicInfo.equipmentName : '--'}}</el-descriptions-item>
          <el-descriptions-item label="传感器编号:">{{ state.basicInfo.equipmentCode ? state.basicInfo.equipmentCode : '--'}}</el-descriptions-item>
          <el-descriptions-item label="告警类型:">{{ state.basicInfo.warnTargetName ? state.basicInfo.warnTargetName : '--'}}</el-descriptions-item>
          <el-descriptions-item label="告警等级:">
            <span :style="{ color: data.alarmLevelColor }">{{ data.alarmLevelText }}</span>
          </el-descriptions-item>
          <!-- <el-descriptions-item label="传感器状态:">
            <span :style="{ color: state.basicInfo.equipmentStatus==='1' ? '#FF0000' : '#69EF00'}">
              {{ state.basicInfo.equipmentStatus === '1' ? '故障' : '正常' }}
            </span>
          </el-descriptions-item> -->
          <el-descriptions-item label="确认状态:">
            <span :style="{ color: state.basicInfo.checkStatus ? '#69EF00' : '#FF0000' }">
              {{ state.basicInfo.checkStatus ? '已审核' : '待审核' }}
            </span>
          </el-descriptions-item>

          <el-descriptions-item label="遥测值:">{{ state.basicInfo.distantReading ? state.distantReadings : '--'}}</el-descriptions-item>
          <el-descriptions-item label="越限范围:">{{ state.outLimitRange ? state.outLimitRange : '--'}}</el-descriptions-item>
          <el-descriptions-item label="偏移量:">{{ state.basicInfo.offsetValue ? state.basicInfo.offsetValue : '--'}}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="main-middle-top">
        <el-descriptions>
          <template #title>
            <h4><i class="tri-arrow" />联动事件</h4>
          </template>
        </el-descriptions>
        <el-table :data="state.basicInfo.linkageIncidentList">
          <el-table-column type="index" label="序号" width="52" fixed="left" :index="indexMethod" />
          <el-table-column prop="linkageEventCode" label="联动事件" width="100" />
          <el-table-column prop="linkageScenarios" label="联动场景" width="280">
            <template #default="{ row }">
              <div class="special" style="height: 30px;" v-for="(item, index) in row.linkageScenarios" :key="index">
                <i class="cycle">{{ index + 1 }}</i>
                <span class="content">: {{ item }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="linkageNode" label="联动节点" />
          <el-table-column prop="areaName" label="区域" />
          <el-table-column prop="lineName" label="点位" />
          <el-table-column prop="linkageEquipmentCode" label="设备编号" />
          <el-table-column prop="controlStatus" label="控制状态" />
          <el-table-column prop="linkageTime" label="联动时间" />
          <el-table-column prop="linkageResult" label="联动结果">
            <template #default="{ row }">
              <div :style="{ color: row.linkageResult === 'IN_OPERATION' ? '#69EF00' : '#FF0000' }">
                {{ row.linkageResult === 'IN_OPERATION' ? '成功' : '失败' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="comment" label="备注" />
        </el-table>
      </div>
      <!-- <div class="main-middle-bottom mb-3">
        <el-descriptions>
          <template #title>
            <h4><i class="tri-arrow" />告警截图</h4>
          </template>
        </el-descriptions>
        <div class="picture-container flex">
          <div style="margin: 0 5px 0 5px;">
            <img style="width: 300px;height: 250px;"
            src="https://cdn.pixabay.com/photo/2023/09/05/16/39/sunrise-8235458_1280.jpg" alt="">
            <span style="text-align: center;width: 300px;display: inline-block;">水浸告警001.jpg</span>
          </div>
          <div style="margin: 0 5px 0 5px;">
            <img style="width: 300px;height: 250px;"
            src="https://cdn.pixabay.com/photo/2023/09/05/16/39/sunrise-8235458_1280.jpg" alt="">
            <span style="text-align: center;width: 300px;display: inline-block;">水浸告警002.jpg</span>
          </div>
        </div>
      </div> -->
      <div class="main-bottom">
        <el-descriptions column="2">
          <template #title>
            <h4><i class="tri-arrow" />审核信息</h4>
          </template>
          <el-descriptions-item label="告警等级:">{{state.basicInfo.checkWarnLevelName}}</el-descriptions-item>
          <el-descriptions-item label="审核人:">{{state.basicInfo.checkUserName}}</el-descriptions-item>
          <el-descriptions-item label="审核意见:">{{state.basicInfo.checkOpinion}}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="close">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
<script setup lang="ts">
import { apiGetTaskById } from '@/api/interface/taskCenter';
import { reactive,ref } from 'vue'


const indexMethod = ref()
// const formData: any[] = [
//   {
//     event: 'E20039934',
//     scene: [
//       { event: '当【水浸】告警等级为【严重】' },
//       { event: '当【水泵】告警等级为【严重】' },
//       { event: '当【局放】值超过【1000pC】' },
//     ],
//     node: '远程自动开启【风机】',
//     area: '开关室北侧',
//     point: '53kVk开关室S0912',
//     number: 'S877342',
//     name: '风机',
//     status: '开',
//     createTime: '2023 12-12 12:00:00',
//     results: 1,
//     note: '信号连接断开'
//   },
// ]
const data = reactive({
  alarmLevelColor: '',
  alarmLevelText: '',
})
const state = reactive({
  dialogVisible: false,
  distantReadings:'',
  outLimitRange:'',
  offSet:'',
  basicInfo: {} as any
})
const getColorAndText = () => {
  switch (state.basicInfo.warnLevelId) {
    case 1:
      data.alarmLevelColor = '#ffcd40';
      data.alarmLevelText = '一般';
      break;
    case 2:
      data.alarmLevelColor = '#7e57c2';
      data.alarmLevelText = '提示';
      break;
    case 3:
      data.alarmLevelColor = '#FF0000';
      data.alarmLevelText = '严重';
      break;
    // case 3:
    //   data.alarmLevelColor = '#FF0000';
    //   data.alarmLevelText = '故障';
    //   break;
    default:
      data.alarmLevelText = '--';
  }
}
//获取详细信息
const getData = async(value:any) => {
  const res = await apiGetTaskById({id:value.id});
  state.basicInfo = res.data;
  state.distantReadings = `${state.basicInfo.distantReading}${state.basicInfo.distantReadingUnit}`;
  if (state.basicInfo.lowerThreshold && state.basicInfo.upperThreshold) {
    state.outLimitRange = `${state.basicInfo.lowerThreshold}${state.basicInfo.lowerUnit} - ${state.basicInfo.upperThreshold}${state.basicInfo.upperUnit}`
  }else{
    state.outLimitRange = '--'
  }
}
const open = (props: any) => {
  getData(props)
  getColorAndText();
  state.dialogVisible = true;
}
const close = () => {
  state.dialogVisible = false;
}

defineExpose({
  open
})
</script>
  
<style>
.main-content {

  h4 {
    font-size: 16px;
    color: #fff;
    padding-left: 16px;
    position: relative;

    i {
      width: 9px;
      height: 9px;
      background: #3CC9F5;
      clip-path: polygon(0 0%, 100% 0, 0 100%);
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .main-top {
    .el-descriptions__body {
      background: none;

      .el-descriptions__label {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }

  .main-middle-top {
    th {
      text-align: center;
    }

    td {
      text-align: center;
    }

    .special {
      text-align: left;

      .cycle {
        width: 21px;
        height: 21px;
        border: 1px solid rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
      }

      .content {
        position: relative;
        top: -21px;
        left: 25px;
      }
    }
  }

  .main-bottom {
    .el-descriptions__body {
      background: none;

      .el-descriptions__label {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}
</style>