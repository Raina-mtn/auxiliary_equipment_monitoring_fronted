<template>
  <el-dialog v-model="state.dialogVisible" :title="`${state.isEdit ? '编辑' : '添加'}设备`" width="40%" @close="close">
    <el-form label-width="90px" :rules="rules" ref="ruleFormRef" :model="form" status-icon label-suffix=":">
      <el-row>
        <el-col :span="12" :gutter="20">
          <el-form-item label="区域" prop="areaId">
            <el-select v-model="form.areaId" class="w-full" placeholder="请选择">
              <el-option v-for="item in chooseList.areaList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :gutter="20">
          <el-form-item label="点位" prop="deployAreaId">
            <el-select v-model="form.deployAreaId" class="w-full" placeholder="请选择">
              <el-option v-for="item in chooseList.pointList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :gutter="20">
          <el-form-item label="设备编号" prop="code">
            <el-input v-model="form.code" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12" :gutter="20">
          <el-form-item label="设备名称" prop="title">
            <el-input v-model="form.title" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12" :gutter="20">
          <el-form-item label="设备类型" prop="categoryId ">
            <el-select v-model="form.categoryId" clearable class="w-full" placeholder="请选择">
              <el-option v-for="item in chooseList.deviceTypeList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :gutter="20">
          <el-form-item label="设备型号" prop="desc">
            <el-input v-model="form.desc" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
      </el-row>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="form.memo" type="textarea" maxlength="500" show-word-limit />
      </el-form-item>
      <el-form-item label="图片" prop="name">
        <el-upload v-model:file-list="fileList" :action="'#'" accept="image/*" list-type="picture" :limit="3"
          :auto-upload="false" :on-preview="handlePreview" :on-remove="handleRemove" :on-change="handleChange"
          :on-exceed="handleExceed">
          <el-button type="primary" :icon="Upload">点击上传</el-button>
          <template #tip>
            <div class="el-upload__tip">
              最多上传3张图片
            </div>
          </template>
        </el-upload>
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
import { Upload } from "@element-plus/icons-vue";
import type { UploadProps, UploadUserFile, FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { deviceAdd, deviceUpdate, categoryList } from '@/api/interface/device'
import { upload } from '@/api/interface/file'
import { list } from '@/api/interface/system/area'
import { list as pointListApi } from '@/api/interface/system/point'
import { reactive, ref, onMounted, watch } from 'vue';

const emit = defineEmits(['getList'])
interface FormData {
  title: string
  areaId: string | number
  deployAreaId: string | number
  categoryId: string | number
  code: string,
  desc?: string | number,
  memo?: string,
  imageList?: string[],
}
interface RuleForms {
  title: string
  areaId: string | number
  deployAreaId: string | number
  categoryId: string | number
  code: string,
  desc?: string | number,
  memo?: string | null,
  imageList?: string[],
}
interface DeviceData {
  areaList: ({ name: string, id: string | number })[]
  pointList: ({ name: string, id: string | number })[]
  deviceTypeList: ({ name: string, id: string | number })[]
}
const state = reactive({
  dialogVisible: false,
  isEdit: false
})

const fileList = ref<UploadUserFile[]>([])
const saveData = ref()
const chooseList = reactive<DeviceData>({
  // 区域列表
  areaList: [],
  // 点位列表
  pointList: [],
  // 设备类型列表
  deviceTypeList: []
})
const ruleFormRef = ref<FormInstance>()
const form = ref<FormData>({
  title: '',
  areaId: '',
  deployAreaId: '',
  categoryId: '',
  code: '',
})
const rules = reactive<FormRules<RuleForms>>({
  title: [
    { required: true, message: '请输入设备名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在1-50字符之间', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入设备编码', trigger: 'blur', },
    { min: 1, max: 50, message: '长度在1-50字符之间', trigger: 'blur' }
  ],
  deployAreaId: [
    {
      required: true,
      message: '请选择点位',
      trigger: 'blur',
    },
  ],
  areaId: [
    {
      required: true,
      message: '请选择区域',
      trigger: 'blur',
    },
  ]
})

watch(() => form.value.areaId, (val, oldVal) => {
  if (oldVal) {
    form.value.deployAreaId = ''
  }
  getPointList(val)
})

onMounted(async () => {
  getAreaList()
  getTypeList()
})

const handleChange = (file: any) => {
  if (file && file.status === 'ready') {
    if (file.size / 1024 / 1024 > 100) {
      ElMessage.error('图片大小不能超过100M!')
      return false
    }
    let fd = new FormData()
    fd.append('imgFile', file.raw)
    upload(fd).then(res => {
      //   form.value.fileList?.push(res.data)
      file.keys = res.data
    })
  }
}

const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning(
    `最多可上传3个文件`
  )
}

function handlePreview() {

}

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

// 获取区域列表
function getAreaList() {
  list({ level: 1, pageIndex: 1, pageSize: 100000 }).then(res => {
    chooseList.areaList = res.data.list
  })
}

// 获取点位列表
function getPointList(id: number | string) {
  pointListApi({ level: 2, rootAreaId: id, pageIndex: 1, pageSize: 100000 }).then(res => {
    chooseList.pointList = res.data.list
  })
}

// 获取设备类型列表
function getTypeList() {
  categoryList({ grade: 1, pageIndex: 1, pageSize: 100000 }).then(res => {
    chooseList.deviceTypeList = res.data
  })
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const params = { ...form.value, grade: 1 }
      if (fileList.value.length > 0) {
        params.imageList = fileList.value.map((item: any) => {
          return item.keys
        })
      }
      if (state.isEdit) {
        deviceUpdate(params).then(res => {
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
        deviceAdd(params).then(res => {
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
  form.value = {
    title: '',
    areaId: '',
    deployAreaId: '',
    categoryId: '',
    code: '',
    imageList: []
  }
  fileList.value = []
}
function open(isEdit: boolean, props: any) {
  state.dialogVisible = true
  state.isEdit = isEdit
  if (isEdit) {
    form.value = { ...props }
    saveData.value = { ...props }
    if (props.imageList && props.imageList.length > 0) {
      fileList.value = props.imageList.map((item: string) => {
        return { name: '', url: import.meta.env.VITE_APP_BASE_API + item, keys: item }
      })
    }
    form.value.areaId = props.areaIdList[0]
  }
}
defineExpose({
  open
})
</script>
        
<style></style>