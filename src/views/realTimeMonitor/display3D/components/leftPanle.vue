<template>
  <div class="left-panel w-1/4 flex flex-col">
    <Title title="设备搜索" class="h-1/12" />
    <div class="main p-4">
      <div class="search flex flex-row justify-between mb-4">
        <el-input v-model="input" placeholder="请输入点位名称或设备编号" clearable class="w-2/3" />
        <el-button type="primary" class="w-1/5 mr-4" :icon="Search">查询</el-button>
        <!--  @click="search()" -->
      </div>
      <div class="down-tree">
        <!-- show-checkbox -->
        <el-tree ref="tree" class="h-auto" :data="state.treeData" node-key="id" default-expand-all :props="defaultProps"
          @node-click="handleNodeClick" />
      </div>
    </div>
    <securityDailog ref="securityDailogRef" :info="state.info"></securityDailog>
  </div>
</template>
  
<script setup lang="ts">
import securityDailog from "./securityDailog.vue";
import { Search } from "@element-plus/icons-vue";
import Title from "./Title.vue";
import { apiGetEquipmentTree } from "@/api/interface/intelliAuxiliary/equipment";
import {
  apiGetPoint,
  equipmentInfoByCode
} from "@/api/interface/realTimeMonitor/display3D";
import { ref, reactive, watch } from "vue";
import { equipmentTypeList } from '@/views/intelliAuxiliary/dynamicEnviMonitor/config'
import { treeToList } from "@/utils/treeHelper";
import { isNull } from "@/utils/is";

const props = defineProps(['currentTab'])
const emits = defineEmits(['getPoints'])

const input = ref("");
let tree = ref(null);
const state = reactive({
  treeData: [],
  info: {}
})


const securityDailogRef = ref();
const defaultProps = {
  children: "children",
  label: "label"
};

getEquipmentTree();
watch(() => props.currentTab, () => {
  console.log(props.currentTab);

  getEquipmentTree();
});

// 生成设备树
function getEquipmentTree() {
  let categoryList = [];
  if (props.currentTab === "视频监控") {
    categoryList = ["CAMERA"];
  } else if (props.currentTab === "安全防卫") {
    categoryList = [
      "ELECTRONIC_FENCE",
      "BURGLARY_ALARM_MASTER_PANEL",
      "INFRARED_RADIATION",
      "INFRARED_DUAL_DISCRIMINATION",
      "ANTI_DRONE",
      "FIRE_MONITORING",
      "DOOR"
    ];
  } else if (props.currentTab === "动环监控") {
    categoryList = equipmentTypeList.map(v => v.code);
  } else if (props.currentTab === "在线监测") {
    categoryList = [
      "OIL_CHROMATOGRAPHY",
      "CORE_GROUND_CURRENT",
      "SF6",
      "PARTIAL_DISCHARGE"
    ];
  } else {
    categoryList = [
      "TRANSFORMER",
      "CIRCUIT_BREAKER",
      "GIS",
      "LIGHTNING_ARRESTED",
      "SF6",
      "WATER_IMMERSION",
      "WATER_PUMP",
      "AIR_CONDITIONING",
      "FIRE_MONITORING",
      "ELECTRONIC_FENCE",
      "INFRARED_RADIATION",
      "INFRARED_DUAL_DISCRIMINATION",
      "ENTRANCE_GUARD",
      "ANTI_DRONE",
      "NVR",
      "OIL_CHROMATOGRAPHY",
      "CORE_GROUND_CURRENT",
      "PARTIAL_DISCHARGE",
      "SMOKE_DETECTOR",
      "BURGLARY_ALARM_MASTER_PANEL",
      "MICROMETEOROGRAPH",
      "WATER_MONITOR",
      "TEMPERATURE_HUMIDITY_SENSOR"
    ];
  }
  apiGetEquipmentTree({ categoryList }).then(res => {
    state.treeData = res.data;

    const equipmentIds = treeToList(res.data).map((v: { id: string }) => v.id)
    getPoint(equipmentIds);
  });
}



// 获取点位
async function getPoint(equipmentIds: number[]) {
  await apiGetPoint({ equipmentIds: equipmentIds }).then(res => {
    let position = res.data.filter((v: any) => !isNull(v.emapX) && !isNull(v.emapY) && !isNull(v.emapY)).map((v: any) => ({
      emapX: parseFloat(v.emapX),
      emapY: parseFloat(v.emapY),
      emapZ: parseFloat(v.emapZ)
    }))
    console.log(position);
    emits('getPoints', position)
  });
}

// 点击点位
function handleNodeClick(node: any) {
  // console.log('object :>> ', node.equipmentCode);
  if (node.equipmentCode) {
    equipmentInfoByCode({ equipmentCode: node.equipmentCode }).then(res => {
      state.info = res.data;
      securityDailogRef.value.open();
    });
  } else {
    console.log("equipmentCode 为空！");
  }
}
</script>
  
  
<style scoped lang="scss">
.left-panel {
  height: 95%;
  background-color: #0b2363;
}

.down-tree {
  overflow: auto;
  // max-height: 90%;
  height: 65vh;

  // background-color: #fff;
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    background-color: #1b3d9f;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;

    // box-shadow: inset 0 0 3px rgb(255, 255, 255);

    border-radius: 5px;
  }

  &::-webkit-scrollbar-button {
    // background-color: rgb(255, 255, 255);
    display: none;
  }
}

.el-tree {
  min-width: 100%;
  display: inline-block;
}
</style>
  