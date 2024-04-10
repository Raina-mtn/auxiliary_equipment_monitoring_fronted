<template>
  <div class="flex-1 p-4 bg-deepBlue ml-4 text-green">
    <div class="flex mt-4 justify-between">
      <Title title="告警等级设置" />
      <el-button type="primary" @click="addAlarmConfig">
        <i class="iconfont icon-bianji mr-1" /> 新增
      </el-button>
    </div>
    <div class="h-full" style="width: 99%; margin: 10px auto 0 auto">
      <div class="title   mb-2 flex py-2" style="background-color: #095cbd; color: #fff">
        <div class="w-1/6 text-center leading-loose">告警等级</div>
        <div class="w-1/6 text-center leading-loose">告警目标</div>
        <div class="w-1/6 text-center leading-loose">阈值</div>
        <div class="w-1/6 text-center leading-loose">是否上送</div>
        <div class="w-1/6 text-center leading-loose">备注</div>
        <div class="w-1/6 text-center leading-loose">操作</div>
      </div>
      <div v-if="tableData.val.length > 0">
        <div class="title mb-2 flex" style="background-color: #043f91; color: #fff" v-for="(item, index) in tableData.val"
          :key="index">
          <div class="w-1/6 text-center leading-10" :style="{ color: colors[item.warnLevelId - 1] }">
            {{ item.warnLevelName }}
          </div>
          <div class="w-1/6 text-center leading-10">
            {{ item.warnTargetName }}
          </div>
          <div class="w-1/6 text-center leading-10">
            {{ item.lowerThreshold }} {{ item.lowerUnit }} ~ {{ item.upperThreshold }} {{ item.upperUnit }}
          </div>
          <div class="w-1/6 text-center leading-10">{{ item.transmit ? '是' : '否' }}</div>
          <div class="w-1/6 text-center leading-10">{{ item.remark }}</div>
          <div class="w-1/6 text-center leading-10">
            <el-button type="primary" :icon="Edit" @click="addAlarmConfig(item)" text>编辑</el-button>
            <el-button type="danger" :icon="Delete" @click="deleteAlarmConfig(item)" text>删除</el-button>
          </div>
        </div>
      </div>
      <div v-else class=" text-center mt-30" style="color: #fff">
        暂无数据
      </div>

      <Title title="告警屏蔽设置" class="my-4" />
      <label class="text-white m-2 ">是否屏蔽告警:</label>
      <el-switch v-model="state.restrain" size="large" active-text="是" inactive-text="否" @change="setRestrainStatus" />
    </div>
    <AlarmDialog ref="passDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import Title from "./Title.vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { alarmStore } from "@/store";
import {
  apiGetWainList,
  deleteWarnIncident,
  apiGetWarnRestrain,
  apiSetWarnRestrain
} from "@/api/interface/system/alarm";
import AlarmDialog from "./AlarmDialog.vue";

const useAlarmStore = alarmStore();

let equipmentId = computed(() => {
  return useAlarmStore.equipmentId;
});
const colors = ref(["#48ACFF", "#F7DE01", "#FF7729", "#F70103"]);
let tableData = reactive({ val: [] });

const passDialogRef = ref();
const state = reactive({
  restrain: false
})


watch(equipmentId, () => {

  getWainList();
  getRestrainStatus()
});

// 获取设备告警事件列表
function getWainList(id?: string) {
  apiGetWainList({ equipmentId: id || equipmentId.value }).then((res) => {
    console.log("res :>> ", res);
    tableData.val = res.data;
  });
}
// 获取告警抑制状态
function getRestrainStatus() {
  if (equipmentId.value) {
    apiGetWarnRestrain({ equipmentId: equipmentId.value }).then(res => {
      state.restrain = res.data.open
    })

  }
}
// 设置告警抑制状态
function setRestrainStatus() {
  if (equipmentId.value) {
    apiSetWarnRestrain({ equipmentId: equipmentId.value, open: state.restrain }).then(() => {
      ElMessage.success("设置成功")

    }).catch(() => {
      state.restrain = !state.restrain
    })
  } else {
    ElMessage.error("必须点击设备")
  }
}


// 添加告警等级
const addAlarmConfig = async (data = {}) => {
  const { equipmentId } = useAlarmStore;
  console.log("equipmentId>>>", equipmentId);
  if (!equipmentId) return ElMessage.error("必须点击设备");
  await passDialogRef.value.open({
    equipmentId,
    ...data,
  });
  console.log("编辑成功");
  getWainList(equipmentId);
};

// 添加告警等级
const deleteAlarmConfig = async (data = {}) => {
  const { id } = data;
  await deleteWarnIncident({ id });
  const { equipmentId } = useAlarmStore;
  getWainList(equipmentId);
};
</script>
<style></style>
