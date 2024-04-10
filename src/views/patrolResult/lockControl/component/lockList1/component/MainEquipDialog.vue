<template>
  <el-dialog v-model="state.dialogVisible" :title="`${state.isEdit ? '编辑' : '添加'}锁控任务`" width="40%" @close="close">
    <el-form label-width="115px" ref="ruleFormRef" :model="form" status-icon>
      <el-row>
        <el-col :span="12" :gutter="20">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :gutter="20">
          <el-form-item label="任务类型" prop="taskType">
            <el-select v-model="form.taskType" class="w-full" placeholder="请选择">
              <el-option v-for="item in chooseList.taskList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :gutter="20">
          <el-form-item label="计划开始时间" prop="scheduledStartTime">
            <el-date-picker v-model="form.scheduledStartTime" format="YYYY/MM/DD HH:mm:ss" type="datetime"
              placeholder="Select date and time" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :gutter="20">
          <el-form-item label="关联设备" prop="equipmentCodes">
            <el-select v-model="form.equipmentCodes" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="3"
              placeholder="Select" style="width: 240px">
              <el-option v-for="item in equipmentCodesOptions" :key="item.id" :label="item.title"
                :value="item.code" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
      </el-row>
      <el-form-item label="备注" prop="comment">
        <el-input v-model="form.comment" type="textarea" />
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
        
<script setup lang='ts' name="MainEquipDialog">
import type { FormInstance, } from 'element-plus'
import { ElMessage } from 'element-plus'
import { lockAdd,apiLockDevice,lockUpdate } from '@/api/interface/patrolResult/lockControl'
import { reactive, ref, } from 'vue';
import dayjs from 'dayjs'
const emit = defineEmits(['getList'])
interface FormData {
  name: string
  taskType: string | number
  scheduledStartTime: string | number,
  equipmentCodes: Object,
  comment: string | number,
  [key:string]:any
}
interface TaskData {
  taskList: ({ label: string, value: string | number })[]
}
interface equipData {
  code:number,
  title:string,
  id?:number|string
}
const state = reactive({
  dialogVisible: false,
  isEdit: false
})
const equipmentCodesOptions = ref<equipData[]>([
])
apiLockDevice().then(res=>{
  equipmentCodesOptions.value = res.data
})
let  id = ref(null) 
const chooseList = reactive<TaskData>({
  // 任务类型列表
  taskList: [
    {
      label: '有序',
      value: 'ORDER'
    },
    {
      label: '无序',
      value: 'DISORDER'
    },
  ]
})
const ruleFormRef = ref<FormInstance>()
const form = ref<FormData>({
  name: '',
  taskType: '',
  scheduledStartTime: '',
  equipmentCodes: [],
  comment: ''
})
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const time = dayjs(form.value.scheduledStartTime).format('YYYY-MM-DD HH:mm:ss')
      form.value.scheduledStartTime = time
      let params = { ...form.value }
      if (state.isEdit) {
        lockUpdate(id.value,params).then(res => {
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
        lockAdd(params).then(res => {
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

function close() {
  state.dialogVisible = false
  ruleFormRef.value?.resetFields()
}
function open(isEdit: boolean, props: any) {
  state.dialogVisible = true
  state.isEdit = isEdit
  if (isEdit) {
    id.value = props.id
    for (const key in form.value) {
      form.value[key] = props [key]
    }
  }else {
    ruleFormRef.value?.resetFields()
  }
  
}
defineExpose({
  open
})
</script>
        
<style></style>