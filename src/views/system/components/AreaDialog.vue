<template>
  <el-dialog v-model="state.dialogVisible" :title="`${state.isEdit ? '编辑' : '添加'}区域`" width="30%" @close="close">
    <el-form label-width="120px" :rules="rules" ref="ruleFormRef" :model="form" status-icon>
      <el-form-item label="区域名称" prop="name">
        <el-input v-model="form.name" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="区域编号" prop="code">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="区域平面图" prop="plan">
        <el-upload v-model:file-list="fileList" :action="'#'" :auto-upload="false" list-type="picture-card" :limit="1"
          accept="image/*" class="plan-uploader" :on-remove="handleRemove" :on-change="handleChange"
          :on-exceed="handleExceed">
          <!-- <el-button type="primary">点击上传</el-button> -->
          <el-icon class="plan-uploader-icon">
            <Plus />
          </el-icon>
          <template #tip>
            <div style="color:  rgba(255,255,255,0.6);">
              建议：单个文件不超过100MB，最多可上传1个文件
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="form.memo" type="textarea" maxlength="500" show-word-limit />
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
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadProps, UploadUserFile, FormInstance, FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { add, update } from '@/api/interface/system/area'
import { upload } from '@/api/interface/file'
const emit = defineEmits(['getList'])
interface FormData {
  name: string
  code: string | number
  plan?: string | UploadUserFile[]
  memo?: string | null
}
interface RuleForms {
  name: string
  code: string | number
}
// const fileUrl = import.meta.env.VITE_APP_BASE_API + 'upload'

const state = reactive({
  dialogVisible: false,
  isEdit: false
})

const form = ref<FormData>({
  name: '',
  code: '',
  plan: '',
  memo: ''
})
const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules<RuleForms>>({
  name: [
    { required: true, message: '请输入区域名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在1-50字符之间', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入区域编码', trigger: 'blur', },
    { min: 1, max: 50, message: '长度在1-50字符之间', trigger: 'blur' }
  ]
})

const fileList = ref<UploadUserFile[]>([])

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handleChange = (file: any) => {
  if (file && file.status === 'ready') {
    if (file.size / 1024 / 1024 > 100) {
      ElMessage.error('图片大小不能超过100M!')
      return false
    }
    let fd = new FormData()
    fd.append('imgFile', file.raw)
    upload(fd).then(res => {
      form.value.plan = res.data
    })
  }
}

const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning(
    `最多可上传一个文件`
  )
}

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

function close() {
  ruleFormRef.value?.resetFields()
  form.value = {
    name: '',
    code: '',
    plan: '',
    memo: ''
  }
  fileList.value = []
  state.dialogVisible = false
}

function open(isEdit: boolean, props: any) {
  state.dialogVisible = true
  state.isEdit = isEdit
  if (isEdit) {
    form.value = { ...props }
    if (props.plan) {
      fileList.value.push({ name: '', url: import.meta.env.VITE_APP_BASE_API + props.plan })
    }
  }
}
defineExpose({
  open
})
</script>
        
<style>
.plan-uploader .el-upload {
  border: 1px solid #369EF8;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  background-color: transparent;
}

.plan-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.plan-uploader-icon {
  font-size: 28px;
  color: #fff;
  width: 178px;
  height: 178px;
  text-align: center;
}

.el-upload-list__item-preview {
  display: none !important;
}
</style>