<template>
    <el-dialog v-model="state.dialogVisible" :title="`角色授权`" width="30%">
        <el-scrollbar max-height="400px">
            <el-tree :data="authTreeData" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false"
                ref="treeRef" :default-checked-keys="state.permissionIdList">
                <template #default="{ node, data }">
                    <span class="custom-tree-node">
                        <span class="custom-node__type">菜单</span><span>{{ data.label }}</span>
                    </span>
                </template>
            </el-tree>
        </el-scrollbar>
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
import { apiAssignRole, apiGetALLMenu } from "@/api/interface";
import { ElMessage } from 'element-plus'

const emits = defineEmits(['refresh'])
const authTreeData = ref([])
const treeRef = ref()

const state = reactive({
    dialogVisible: false,
    id: '',
    permissionIdList: []
})

// 菜单权限树
getMenuTree()

function getMenuTree() {
    apiGetALLMenu().then(res => {
        authTreeData.value = res.data

    })
}

// 弹窗打开
function open(formData: object) {
    state.dialogVisible = true
    state.id = formData?.id || ''
    if (formData.permissionList) {
        state.permissionIdList = formData.permissionList.map(v => v.id)
    } else {
        state.permissionIdList = []
        treeRef.value && treeRef.value.setCheckedKeys([])
    }

}
// 提交
function submit() {
    const checkedPath = treeRef.value.getCheckedKeys()
    const params = {
        id: state.id,
        permissionIdList: checkedPath
    }
    apiAssignRole(params).then(() => {
        ElMessage.success('授权成功')
        state.dialogVisible = false
        emits('refresh')
    })
}
defineExpose({
    open
})
</script>
        
<style>
.custom-node__type {
    padding: 2px 4px;
    background: #369EF8;
    border-radius: 3px 3px 3px 3px;
    margin-right: 4px
}
</style>