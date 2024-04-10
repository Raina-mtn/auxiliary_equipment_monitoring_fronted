<template>
  <el-dialog v-model="state.dialogVisible" :title="`${state.isEdit ? '编辑' : '添加'}点位`" width="30%" @close="close">
    <el-form label-width="120px" :rules="rules" ref="ruleFormRef" :model="form" status-icon>
      <el-form-item label="点位名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="点位编号" prop="code">
        <el-input v-model="form.code" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="所属区域" prop="parentId">
        <el-select v-model="form.parentId" class="w-full" placeholder="请选择">
          <el-option v-for="item in chooseList.areaList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="绑定设备" prop="masterEquipmentIdList">
        <el-select v-model="form.masterEquipmentIdList" multiple class="w-full" placeholder="请选择">
          <el-option v-for="item in chooseList.mDevicesList" :key="item?.id" :label="item.title" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="绑定传感器" prop="auxiliaryEquipmentIdList">
        <el-select v-model="form.auxiliaryEquipmentIdList" multiple class="w-full" placeholder="请选择">
          <el-option v-for="item in chooseList.aDevicesList" :key="item?.id" :label="item.title" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="form.memo" type="textarea" maxlength="250" show-word-limit placeholder="请输入" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">关闭</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
      
<script setup lang='ts'>
import { reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { add, update } from '@/api/interface/system/point'
import { deviceList } from '@/api/interface/device'
import { list } from '@/api/interface/system/area'
const emit = defineEmits(['getList'])
interface FormData {
  name: string
  code: string | number
  masterEquipmentIdList: (string | number)[],
  auxiliaryEquipmentIdList: (string | number)[],
  parentId: string | number,
  memo?: string | null
}
interface RuleForms {
  name: string
  code: string | number
  masterEquipmentIdList: (string | number)[],
  auxiliaryEquipmentIdList: (string | number)[],
  parentId: string | number,
  memo?: string | null
}
interface DeviceData {
  mDevicesList: ({ title: string, id: string | number })[]
  aDevicesList: ({ title: string, id: string | number })[]
  areaList: ({ name: string, id: string | number })[]
}
const state = reactive({
  dialogVisible: false,
  isEdit: false
})

const form = ref<FormData>({
  name: '',
  code: '',
  parentId: '',
  masterEquipmentIdList: [],
  auxiliaryEquipmentIdList: [],
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<RuleForms>>({
  name: [
    { required: true, message: '请输入点位名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在1-50字符之间', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入点位编码', trigger: 'blur', },
    { min: 1, max: 50, message: '长度在1-50字符之间', trigger: 'blur' }
  ],
  parentId: [
    {
      required: true,
      message: '请选择所属区域',
      trigger: 'blur',
    },
  ],
  masterEquipmentIdList: [
    {
      required: false,
      message: '请选择设备',
      trigger: 'blur',
    },
  ],
  auxiliaryEquipmentIdList: [
    {
      required: false,
      message: '请选择传感器',
      trigger: 'blur',
    },
  ],
})

const chooseList = reactive<DeviceData>({
  // 关联设备列表
  mDevicesList: [],
  // 传感器列表
  aDevicesList: [],
  areaList: []
})

onMounted(async () => {
  chooseList.mDevicesList = await getDeviceList(1)
  chooseList.aDevicesList = await getDeviceList(2)
  getAreaList()
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const params = { ...form.value }
      if (state.isEdit) {
        update(params).then(res => {
          if (res.status.code === 1) {
            ElMessage({
              message: '编辑成功！',
              type: 'success'
            })
            emit('getList')
            close()
          }
        })
      } else {
        add(params).then(res => {
          if (res.status.code === 1) {
            ElMessage({
              message: '新增成功！',
              type: 'success'
            })
            emit('getList')
            close()
          }
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 获取设备和传感器列表
async function getDeviceList(type: number) {
  let list = null
  const res = await deviceList({ grade: type, page: { pageIndex: 1, pageSize: 10 } })
  if (res && res.data) {
    list = res.data.list.map((item: any) => {
      return {
        id: item.id,
        title: `${item.title}[${item.code}]`
      }
    })
  } else {
    list = []
  }
  return list
}

// 获取区域列表
function getAreaList() {
  list({ level: 1, pageIndex: 1, pageSize: 100000 }).then(res => {
    chooseList.areaList = res.data.list
  })
}

function close() {
  state.dialogVisible = false
  ruleFormRef.value?.resetFields()
  form.value = {
    name: '',
    code: '',
    parentId: '',
    masterEquipmentIdList: [],
    auxiliaryEquipmentIdList: [],
  }
}

function open(isEdit: boolean, props: any) {
  state.dialogVisible = true
  state.isEdit = isEdit
  if (isEdit) {
    form.value = { ...props }
    form.value.auxiliaryEquipmentIdList = props.auxiliaryEquipmentList && props.auxiliaryEquipmentList.map((item: { id: number | string }) => {
      return item.id
    })
    form.value.masterEquipmentIdList = props.masterEquipmentList && props.masterEquipmentList.map((item: { id: number | string }) => {
      return item.id
    })
  }
}
defineExpose({
  open
})
</script>
      
<style></style>
