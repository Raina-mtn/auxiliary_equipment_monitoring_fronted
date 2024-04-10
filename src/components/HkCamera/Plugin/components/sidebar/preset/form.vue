<template>
  <el-popover
    @show="show"
    @hide="hide(ruleFormRef)"
    v-model:visible="visible"
    trigger="click"
    :width="250"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="预置点名称" prop="presetname">
        <el-input v-model="ruleForm.presetname" />
      </el-form-item>
      <el-form-item label="预置点位" prop="presetindex">
        <el-input-number
          v-model="ruleForm.presetindex"
          class="mx-4"
          :min="1"
          :max="256"
          controls-position="right"
          :controls="false"
        />
      </el-form-item>
    </el-form>
    <div style="text-align: right; margin: 0">
      <el-button @click="close(ruleFormRef)" size="small" text>取消</el-button>
      <el-button @click="submitForm(ruleFormRef)" size="small">提交</el-button>
    </div>
    <template #reference>
      <slot />
    </template>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { addPreset } from "@/api/interface";
import { ElMessage as createMessage } from "element-plus";
const props = defineProps({
  formData: {
    type: Object,
    default: {
      presetname: "",
      presetindex: 0,
    },
  },
  getList: {
    type: Function,
    default: () => {},
  },
});

const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive<RuleForm>({
  presetname: "",
  presetindex: 0,
});

const rules = reactive<FormRules<RuleForm>>({
  presetname: [
    { required: true, message: "请输入预置点名", trigger: "blur" },
    { min: 3, max: 5, message: "长度应该在3 - 10", trigger: "blur" },
  ],
  presetindex: [{ required: true, message: "请输入预置点位", trigger: "blur" }],
});

const close = (formEl: FormInstance | undefined) => {
  visible.value = false;
  reset(formEl);
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      const { presetip, presetchannel } = props.formData;
      await addPreset({ presetip, presetchannel, ...ruleForm });
      props.getList()
      close(ruleFormRef)
      createMessage.success("保存成功");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const reset = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

let visible = ref(false);
const show = () => {
  console.log("show>>>>", props);
  ruleForm.presetname = props.formData.presetname;
  ruleForm.presetindex = props.formData.presetindex;
};

const hide = (formEl: FormInstance | undefined) => {
  reset(formEl);
};
</script>
