<template>
    <el-dialog v-model="state.dialogVisible" :title="`${state.isEdit ? '编辑' : '添加'}角色`" width="30%">
        <el-form label-width="120px" :model="form" :rules="rules" ref="ruleFormRef">
            <el-form-item label="角色名称" prop="roleName" required>
                <el-input v-model="form.roleName" maxlength="30" />
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="form.roleDesc" type="text" maxlength="50" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="state.dialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="submit">
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
        
<script setup lang='ts'>
import { reactive, ref } from 'vue';
import { Role } from '@/api/interface/types'
import type { FormInstance } from 'element-plus'
import { apiCreateRole, apiUpdateRole } from '@/api/interface/auth/role';
import { ElMessage } from 'element-plus'

const emits = defineEmits(['refresh'])
const ruleFormRef = ref<FormInstance>()
const rules = reactive({
    roleName: [
        { required: true, message: '用户名称必填', trigger: 'blur' },
    ],
})


const state = reactive({
    dialogVisible: false,
    isEdit: false
})

const form = ref({
    roleName: '',
    roleDesc: ''
})


function open(scope: Role.ReqUserParams, isEdit: boolean) {
    ruleFormRef.value?.resetFields()
    state.dialogVisible = true
    state.isEdit = isEdit
    form.value = scope ? { ...scope } : { roleName: '' }
}

async function submit() {

    if (!ruleFormRef.value) return
    const valid = await ruleFormRef.value.validate()
    if (valid) {
        const api = state.isEdit ? apiUpdateRole : apiCreateRole
        api(form.value).then(() => {
            ElMessage.success(state.isEdit ? '编辑成功' : '创建成功')
            state.dialogVisible = false
            emits('refresh')
        })
    }
}

defineExpose({
    open
})
</script>
        
<style></style>