<template>
    <el-dialog v-model="state.dialogVisible" :title="`修改密码`" width="30%">
        <el-form label-width="120px" ref="ruleFormRef" :model="form" :rules="rules">
            <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="form.oldPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="form.newPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="确认密码" prop="newPassword2">
                <el-input v-model="form.newPassword2" type="password" show-password />
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
import { apiUpdatePass } from '@/api/interface/auth/user'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['refresh'])
const check = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@;:])|(?=.*[A-Z])(?=.*[0-9])(?=.*[!@;:])|(?=.*[a-z])(?=.*[0-9])(?=.*[!@;:]))/;
const validateOldPassword = (_rule: any, value: any, callback: any) => {
    if (value.length < 8) {
        callback(new Error("用户密码不得小于8位"));
    } else if (!check.test(value)) {
        callback(new Error("密码应为大写字母、小写字母、数字、特殊字符中三种或三种以上的组合"));
    } else {
        callback();
    }
};
const validatePass = (_rule: any, value: any, callback: any) => {
    if (value.length < 8) {
        callback(new Error("用户密码不得小于8位"));
    } else if (!check.test(value)) {
        callback(new Error("密码应为大写字母、小写字母、数字、特殊字符中三种或三种以上的组合"));
    } else {
        if (!ruleFormRef.value) return
        ruleFormRef.value.validateField('newPassword2', () => null)
    }
    callback();
};
const validatePass2 = (_rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'));
    } else if (value !== form.newPassword) {
        callback(new Error('两次输入密码不一致!'));
    } else {
        callback();
    }
};

const ruleFormRef = ref<FormInstance>()
const rules = reactive({
    oldPassword: [
        { required: true, message: '请输入旧密码', trigger: 'change' },
        { validator: validateOldPassword, trigger: 'change' },
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'change' },
        { validator: validatePass, trigger: 'change' },
    ],
    newPassword2: [
        { required: true, message: '请再次输入密码', trigger: 'change' },
        { validator: validatePass2, trigger: 'change' },
    ],
})
const state = reactive({
    dialogVisible: false,
    id: 0
})

const form = reactive({
    oldPassword: '',
    newPassword: '',
    newPassword2: ''
})


function open(id: number) {
    state.dialogVisible = true
    state.id = id
    reset()
}

function reset() {
    ruleFormRef.value && ruleFormRef.value.resetFields()
}

async function submit() {
    if (!ruleFormRef.value) return
    const valid = await ruleFormRef.value.validate()
    if (valid) {
        const params = { id: state.id, needCheckOldPass: true, oldPassword: form.oldPassword, newPassword: form.newPassword }
        apiUpdatePass(params).then(() => {
            ElMessage.success('修改成功')
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