<template>
  <div class="site text-light-50 p-16px">
    <left-panel title="站点管理" />
    <div class="site-content relative">
      <div v-if="!isEdit" class="absolute right-24px top-24px">
        <el-button type="primary" @click="isEdit = !isEdit">
          编辑
        </el-button>
      </div>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="isEdit ? rules : {}" label-width="120px" class="w-1/2 mt-16"
        :size="formSize" status-icon label-suffix="：">
        <el-form-item label="站点名称" prop="name">
          <el-input v-if="isEdit" v-model="ruleForm.name" maxlength="50" show-word-limit />
          <span class="inline-block w-full border pl-16px border-[#369EF8]" v-else>{{ ruleForm.name || '--' }}</span>
        </el-form-item>
        <el-form-item label="负责人" prop="charger">
          <el-input v-if="isEdit" v-model="ruleForm.charger" maxlength="20" show-word-limit />
          <span class="inline-block w-full border pl-16px border-[#369EF8]" v-else>{{ ruleForm.charger || '--' }}</span>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-if="isEdit" v-model="ruleForm.mobile" placeholder="请输入" />
          <span class="inline-block w-full border pl-16px border-[#369EF8]" v-else>{{ ruleForm.mobile || '--' }}</span>
        </el-form-item>
        <el-form-item label="地址" :required="isEdit">
          <div v-if="isEdit" class="flex w-full">
            <div class="w-2/5">
              <el-form-item prop="district">
                <el-cascader v-model="ruleForm.district" :options="regionData"
                  :props="{ expandTrigger: 'hover' as const, label: 'name', value: 'code' }" style="width: 100%;" placeholder="请选择省市区"
                  @change="handleChange" />
              </el-form-item>
            </div>
            <div class="flex-auto ml-16px">
              <el-form-item prop="address" class="w-full">
                <el-input class="inline-block w-full pl-16px" v-model="ruleForm.address"
                  placeholder="请输入详细地址" maxlength="50" show-word-limit />
              </el-form-item>
            </div>
          </div>
          <span class="inline-block w-full border pl-16px border-[#369EF8]" v-else>{{ ruleForm.districtName +
            ruleForm.address }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input v-if="isEdit" v-model="ruleForm.desc" type="textarea" resize="none" maxlength="500" show-word-limit />
          <span class="inline-block w-full border pl-16px border-[#369EF8]" v-else>{{ ruleForm.desc || '--' }}</span>
        </el-form-item>
        <el-form-item v-if="isEdit">
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            保存
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import LeftPanel from '../../components/LeftPanel.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getStation, updateStation } from '@/api/interface/system/site'
import regionData from '@/mock/area'

// // const regionData = ref(_.regionData)
// const a= Area.map(e=>{const n=e.children?a(e.children):void 0;return{value:e.code,label:e.name,children:n}}),
// const regionData = ref(a)


const validatePassPhone = (_rule: any, value: string, callback: Function) => {
  if (value === '' || !value) {
    callback(new Error('请输入联系方式'))
  } else {
    let reg = new RegExp(/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/)
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('手机号格式不正确,请重新输入'))
    }
  }
}

interface RuleForms {
  name: string
  mobile: string
  charger: string
  address: string
  district: string
  districtName: string
  desc: string
}

const formSize = ref('default')
let isEdit = ref(false)
const ruleFormRef = ref<FormInstance>()
let ruleForm = ref<RuleForms>({
  name: '',
  mobile: '',
  charger: '',
  address: '',
  district: '',
  desc: '',
  districtName: ''
})

const rules = reactive<FormRules<RuleForms>>({
  name: [
    { required: true, message: '请输入站点名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在1-50字符之间', trigger: 'blur' },
  ],
  charger: [
    {
      required: true,
      message: '请输入负责人',
      trigger: 'blur',
    },
  ],
  mobile: [
    {
      required: true,
      validator: validatePassPhone,
      trigger: 'blur',
    },
  ],
  address: [
    {
      required: true,
      message: '请输入详细地址',
      trigger: 'blur',
    },
  ],
  district: [
    {
      required: true,
      message: '请选择省市区',
      trigger: 'blur',
    },
  ],
  desc: [
    { required: false, message: '请输入描述', trigger: 'blur' },
  ],
})

onMounted(() => {
  getInfo()
})

const submitForm = async (formEl: FormInstance | undefined) => {

  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const params = { ...ruleForm.value }
      params.district = Array.isArray(ruleForm.value.district) ? ruleForm.value.district[ruleForm.value.district.length - 1] : ruleForm.value.district
      updateStation(params).then(res => {
        if (res.status.code === 1) {
          ElMessage({
            message: '保存成功！',
            type: 'success'
          })
          getInfo()
          isEdit.value = false
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  isEdit.value = false
  if (!formEl) return
  formEl.clearValidate()
}

const handleChange = (value: any) => {
  console.log(value)
}

const getInfo = async () => {
  const res = await getStation()
  ruleForm.value = res.data
}

</script>
<style scoped lang="scss">
.site {
  display: flex;
  width: 100%;
  height: 100%;
  padding-top: 24px;

  &-content {
    display: flex;
    justify-content: center;
    flex: 1;
    height: 100%;
    background: #0B2363;
    margin-left: 16px;
    padding-top: 50px;
    // :deep(.el-input__wrapper) {
    //   background: #052366;
    //   // border-color: red !important;
    // }
    // :deep(.el-input) {
    //   // border-color: #369EF8;
    // }
    // :deep(.el-textarea__inner) {
    //   background: #052366;

    // }
  }
}
</style>
