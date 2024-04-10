<template>
    <el-dialog v-model="state.dialogVisible" :title="`${state.isEdit ? '编辑' : '添加'}用户`" width="30%">
        <el-form label-width="120px" :model="form" :rules="rules" ref="ruleFormRef">
            <el-form-item label="姓名" prop="username" required>
                <el-input v-model="form.username" maxlength="30" />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile" required>
                <el-input v-model="form.mobile" clearable />
            </el-form-item>
            <el-form-item label="所属部门" prop="deptId" required>
                <el-tree-select v-model="form.deptId" :data="state.orgTreeData" :render-after-expand="false"
                    check-on-click-node check-strictly node-key="id" />
            </el-form-item>
            <el-form-item label="角色分配" prop="roleIdList" required>
                <el-select v-model="form.roleIdList" multiple>
                    <el-option v-for="item in state.roleList" :key="item.id" :label="item.roleName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="登录密码" prop="password" v-if="!state.isEdit">
                <el-input v-model="form.password" type="password" show-password :disabled="state.isEdit">
                </el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" clearable />
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
import { reactive, ref, PropType } from 'vue';
import { User, Role } from '@/api/interface/types'
import type { FormInstance, FormRules } from 'element-plus'
import { apiGetRoleList, apiGetOrgTree, apiCreateUser, apiUpdateUser } from '@/api/interface';
import { ElMessage } from 'element-plus'
import { checkPhone, checkEmail } from '../config'

const emits = defineEmits(['refresh'])
const ruleFormRef = ref<FormInstance>()
const check = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@;:])|(?=.*[A-Z])(?=.*[0-9])(?=.*[!@;:])|(?=.*[a-z])(?=.*[0-9])(?=.*[!@;:]))/;
const validatePassword = (_rule: any, value: any, callback: any) => {

    if (value === "") {
        callback(new Error("请输入密码"));
    } else if (value.length < 8) {
        callback(new Error("用户密码不得小于8位"));
    } else if (!check.test(value)) {
        callback(new Error("密码应为大写字母、小写字母、数字、特殊字符中三种或三种以上的组合"));
    } else {
        callback();
    }
};
const rules = reactive<FormRules<Omit<User.ReqUserParams, 'page'>>>({ // 去掉org 的page属性
    username: [
        { required: true, message: '用户名称必填', trigger: 'blur' },
    ],
    deptId: [
        { required: true, message: '请选择部门', trigger: 'blur' },
    ],
    roleIdList: [
        { required: true, message: '请选择角色', trigger: 'blur' },
    ],
    mobile: [
        { required: true, message: '手机号必填', trigger: 'blur' },
        { validator: checkPhone, message: '请输入正确的手机号', trigger: 'change' },
    ],
    email: [{ validator: checkEmail, message: '请输入正确的邮箱', trigger: 'change' }],
    password: [
        { required: true, message: '密码必填', trigger: 'blur' },
        { validator: validatePassword, trigger: 'change' },
    ]
})


const state = reactive({
    dialogVisible: false,
    isEdit: false,
    roleList: [] as unknown as PropType<Omit<Role.ReqUserParams, 'page'>[]>,
    orgTreeData: []
})

const form = ref<Omit<User.ReqUserParams, 'page'>>({
    username: '',
    deptId: '',
    roleIdList: [],
    mobile: '',
    email: '',
    password: ''
})

// 获取角色 和 部门
function getFormOption() {
    apiGetRoleList({ page: { pageIndex: 1, pageSize: 999 } }).then(res => {
        state.roleList = res.data?.list || []
    })
    apiGetOrgTree().then(res => {
        state.orgTreeData = res.data
    })
}

function open(scope: User.UserResponse, isEdit: boolean) {
    getFormOption()
    ruleFormRef.value?.resetFields()
    state.dialogVisible = true
    state.isEdit = isEdit
    form.value = {
        username: scope?.username || '',
        deptId: scope?.deptId || '',
        roleIdList: scope.roleList ? scope.roleList.map(v => v.id) : [],
        mobile: scope?.mobile || '',
        id: scope?.id,
        email: scope?.email || '',
        password: scope?.password || '',
    }
}

async function submit() {

    if (!ruleFormRef.value) return
    const valid = await ruleFormRef.value.validate()
    if (valid) {
        const api = state.isEdit ? apiUpdateUser : apiCreateUser
        const params = form.value
        if (state.isEdit) {
            params.password = undefined
        }
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