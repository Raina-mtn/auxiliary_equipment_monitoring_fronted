<!--
 * @Date: 2023-07-18 08:55:45
 * @LastEditors: zhusisheng zhusisheng@shenhaoinfo.com
 * @LastEditTime: 2023-10-10 19:17:54
 * @FilePath: \auxiliary_equipment_monitoring_fronted\src\views\system\components\AlarmDialog.vue
-->
<script lang="ts" setup>
import { onBeforeMount, reactive, defineExpose, ref } from "vue";
import type { FormInstance } from "element-plus";
import {
  apiGetListWarnLevel,
  apiListWarnTarget,
  addWarnIncident,
  listUnit,
  updateWarnIncident,
} from "@/api/interface/index";
import { useRouter } from "vue-router";

const $router = useRouter();

let openResolve: null | Function = null;
let openReject: null | Function = null;
let showUnit = ref(true)
const formDataDefault = {
  lowerThreshold: 0,
  lowerUnit: "",
  remark: "",
  upperThreshold: 0,
  upperUnit: "",
  warnLevelId: null,
  warnTargetId: null,
  transmit: false
};

const state = reactive({
  visible: false,
  loading: true,
  formData: JSON.parse(JSON.stringify(formDataDefault)),
  originData: {
    equipmentId: null,
    equipmentIds: [],
  },
  warnLevelOptions: [],
  warnTagetOptions: [],
  listUnitOptions: [],
});

onBeforeMount(async () => {
  state.warnLevelOptions = (await apiGetListWarnLevel()).data;

  const { type: categoryCode } = $router.currentRoute.value.query;
  if (categoryCode === 'ELECTRONIC_FENCE' ||
    categoryCode === 'WATER_IMMERSION' ||
    categoryCode === 'WATER_PUMP' ||
    categoryCode === 'SMOKE_DETECTOR' ||
    categoryCode === 'BURGLARY_ALARM_MASTER_PANEL' ||
    categoryCode === 'INFRARED_RADIATION' ||
    categoryCode === 'INFRARED_DUAL_DISCRIMINATION' ||
    categoryCode === 'ANTI_DRONE' ||
    categoryCode === 'DOOR'
  ) {
    showUnit.value = false
    console.log('showUnit.value :>> ', showUnit.value);
  } else {
    showUnit.value = true
  }
  state.warnTagetOptions = (await apiListWarnTarget({ categoryCode })).data;
});

const onWarnTagetChange = async (id: string) => {
  console.log("onWarnTagetChange>>>>", id);

  let item = state.warnTagetOptions.find((item) => item["id"] == id);
  if (item) {
    const { unitCategory } = item;
    state.listUnitOptions = (await listUnit({ unitCategory })).data;
  }
  console.log("item>>>>", item);
};

const validateUpperThreshold = (_, value: any, callback: any) => {
  if (value < state.formData.lowerThreshold) {
    callback(new Error("不能小于阈值下限"));
  } else {
    callback();
  }
};

const validatelowerThreshold = (_, value: any, callback: any) => {
  if (value > state.formData.upperThreshold) {
    callback(new Error("不能大于阈值下限"));
  } else {
    callback();
  }
};

const formRef = ref<FormInstance>();

// 打开
const open = async (data: any) => {
  return new Promise((resolve, reject) => {
    state.originData = data;

    for (const [k] of Object.entries(state.formData)) {
      state.formData[k] = data[k];
    }

    openResolve = resolve;
    openReject = reject;
    state.visible = true;
  });
};

// 关闭
const close = () => {
  openReject && openReject("form closed");
  reset();
};

const reset = () => {
  openResolve = null;
  openReject = null;
  state.formData = JSON.parse(JSON.stringify(formDataDefault));
  formRef.value && formRef.value.resetFields();
  state.visible = false;
};

const submit = async () => {
  try {
    await formRef.value.validate();
    const { equipmentId, id = null } = state.originData;
    let res;
    if (equipmentId) {
      if (!id) {
        // 创建
        res = await addWarnIncident({ equipmentId, ...state.formData });
      } else {
        res = await updateWarnIncident({ equipmentId, id, ...state.formData });
      }
    }
    openResolve && openResolve(res);
    reset();
  } catch (error) {
    console.log("提交失败");
  }
};
defineExpose({
  open,
});
</script>

<template>
  <el-dialog class="alarm-dailog" v-model="state.visible" title="告警事件" width="fit-content" :before-close="close">
    <el-form class="alarm-form" style ref="formRef" :model="state.formData" label-width="150px" status-icon>
      <el-form-item label="告警目标" prop="warnTargetId" :rules="[{ required: true, message: '告警目标不能为空' }]"
        style="width: 100%">
        <el-select v-model="state.formData.warnTargetId" placeholder="输入告警目标" @change="onWarnTagetChange"
          style="width: 100%">
          <el-option v-for="item in state.warnTagetOptions" :label="item['name']" :value="item['id']" />
        </el-select>
      </el-form-item>
      <el-form-item label="阈值上限" prop="upperThreshold" style="width: 50%" :rules="[
        { required: showUnit, message: '阈值上限不能为空' },
        { validator: validateUpperThreshold, trigger: 'blur' },
      ]">
        <el-input-number :disabled="!showUnit" v-model="state.formData.upperThreshold" />
      </el-form-item>

      <el-form-item label="阈值上限单位" prop="upperUnit" style="width: 50%" :rules="[
        { required: showUnit, message: '请选择阈值上限单位' },
      ]">
        <el-select :disabled="!showUnit" v-model="state.formData.upperUnit" placeholder="请选择阈值上限单位">
          <el-option v-for="item in state.listUnitOptions" :label="item['units']" :value="item['units']" />
        </el-select>
      </el-form-item>
      <el-form-item label="阈值下限" :rules="[
        { required: showUnit, message: '阈值下限不能为空' },
        { validator: validatelowerThreshold, trigger: 'blur' },
      ]" prop="lowerThreshold" style="width: 50%">
        <el-input-number :disabled="!showUnit" v-model="state.formData.lowerThreshold" />
      </el-form-item>

      <el-form-item label="阈值下限单位" prop="lowerUnit" style="width: 50%" :rules="[
        { required: showUnit, message: '请选择阈值上限单位' },
      ]">
        <el-select :disabled="!showUnit" v-model="state.formData.lowerUnit" placeholder="请选择阈值上限单位">
          <el-option v-for="item in state.listUnitOptions" :label="item['units']" :value="item['units']" />
        </el-select>
      </el-form-item>
      <el-form-item label="告警等级" prop="warnLevelId" :rules="[{ required: true, message: '告警等级不能为空' }]" style="width: 50%">
        <el-select v-model="state.formData.warnLevelId" placeholder="输入告警等级">
          <el-option v-for="item in state.warnLevelOptions" :label="item['name']" :value="item['id']" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否上送" prop="transmit" style="width: 50%">
        <el-switch v-model="state.formData.transmit" placeholder="输入告警等级">
        </el-switch>
      </el-form-item>
      <el-form-item label="备注" prop="remark" style="width: 100%" :rules="[{ required: false, message: '备注不能为空' }]">
        <el-input v-model="state.formData.remark" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" @click="close">取消</el-button>
      <el-button size="small" @click="submit">保存</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss" scope>
.alarm-dailog {
  .alarm-form {
    width: 800px;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
