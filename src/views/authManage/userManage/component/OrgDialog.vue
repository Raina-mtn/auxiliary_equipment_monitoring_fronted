<template>
    <el-dialog v-model="state.dialogVisible" :title="`${state.isEdit ? '编辑' : '添加'}部门`" width="30%">
        <el-form label-width="120px" ref="ruleFormRef" :model="form" :rules="rules">
            <el-form-item label="部门名称" prop="name" required>
                <el-input v-model="form.name" maxlength="30" />
            </el-form-item>
            <el-form-item label="上级部门" prop="parentId">
                <el-tree-select v-model="form.parentId" :data="state.orgTreeData" :render-after-expand="false"
                    check-on-click-node check-strictly node-key="id" />
            </el-form-item>
            <el-form-item label="负责人" prop="charger">

                <el-select v-model="form.charger" clearable>
                    <el-option v-for="item in state.userList" :key="item.id" :label="item.username" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="memo" maxlength="10">
                <el-input v-model="form.memo" type="textarea" maxlength="250" />
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
import { apiCreateOrg, apiUpdateOrg } from '@/api/interface/auth/org'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Tree } from '@/components/Tree/interface';
import { Org, User } from '@/api/interface/types'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { apiGetUserList } from '@/api/interface/auth/user'

const emits = defineEmits(['refresh'])


const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<Omit<Org.ReqUserParams, 'page'>>>({ // 去掉org 的page属性
    name: [
        { required: true, message: '部门名称必填', trigger: 'blur' },
    ],
})
const state = reactive({
    dialogVisible: false,
    isEdit: false,
    orgTreeData: [] as Tree[],
    userList: [] as Omit<User.ReqUserParams, 'page'>[]
})

const form = ref<Omit<Org.ReqUserParams, 'page'>>({
    name: '',
    parentId: ''
})


function open(orgTreeData: Tree[], isEdit: boolean, formData: Node & { parentId?: number, charger?: string }) {
    ruleFormRef.value?.resetFields()
    state.dialogVisible = true
    state.isEdit = isEdit
    state.orgTreeData = orgTreeData
    form.value = formData ? { ...formData, name: formData?.label, parentId: formData?.parentId === 0 ? 0 : formData.parentId, charger: formData.charger ? Number(formData.charger) : '' } : { name: '', parentId: '' }
    getUserList()
}

function getUserList() {
    const params = {
        page: {
            pageIndex: 1,
            pageSize: 9999
        }
    }
    apiGetUserList(params).then(res => {
        state.userList = res.data.list
    })
}

async function submit() {
    if (!ruleFormRef.value) return
    if (state.isEdit && form.value.id === form.value.parentId) {
        return ElMessage.error('上级部门不能为当前选中的部门')
    }
    const valid = await ruleFormRef.value.validate()
    if (valid) {
        const api = state.isEdit ? apiUpdateOrg : apiCreateOrg
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
        
<style>
.el-select-dropdown__item.selected {
    color: #fff;
}
</style>