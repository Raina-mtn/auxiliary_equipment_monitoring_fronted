<template>
    <div class="flex-1 p-4 bg-deepBlue ml-4 relative">
        <ProTable ref="proTable" title="主设备管理" :columns="lockcolumns1" :requestApi="getTableList" max-height="600"
            :searchCol="searchCol">
            <template #searchHeader>
                <el-button style="float: right;" type="primary" class="mr-4" @click="open()">新建任务</el-button>
            </template>
            <!-- 表格操作 -->
            <template #operation="scope">
                <el-button type="primary" link @click="open(true, scope.row)">编辑 </el-button>
                <el-button type="primary" link @click="del(scope.row.id)"> 删除 </el-button>
                <el-button type="primary" link @click="jump()"> 执行结果 </el-button>
            </template>
        </ProTable>
    </div>
    <MainEquipDialog ref="MainEquipDialogRef" @getList="getList" />
</template>
<script  setup lang='ts'>
import ProTable from "@/components/ProTable/index.vue";
import MainEquipDialog from "./component/MainEquipDialog.vue";
import { apiGetLockist, lockDel } from "@/api/interface/patrolResult/lockControl";
import { lockcolumns1 } from '../../config'
import { ElMessage } from 'element-plus'
import { ref, defineEmits } from "vue";
const proTable = ref()
const searchCol = {
    xs: 1,
    sm: 2,
    md: 6,
    lg: 6,
    xl: 6
}
const MainEquipDialogRef = ref<InstanceType<typeof MainEquipDialog> | null>(null)
const getTableList = (params: any) => {
    let newParams = JSON.parse(JSON.stringify(params));
    if (Array.isArray(newParams?.times) && newParams?.times.length) {
        newParams.planStartTime = newParams.times[0]
        newParams.planEndTime = newParams.times[1]
        delete newParams.times;
    }
    const params2 = {
        ...newParams,
        'page.pageIndex': newParams.page.pageIndex,
        'page.pageSize': newParams.page.pageSize,
    }
    delete params2.page
    return apiGetLockist(params2);
};
const del = async (id: number) => {
       let res =  await lockDel(id)
        ElMessage({
            message: '删除成功！',
            type: 'success'
        })
        proTable.value.search()
}
const emits = defineEmits(['lockRecord'])
const jump = ()=>{
    emits('lockRecord')
}
function open(isEdit = false, row = {}) {
    MainEquipDialogRef.value?.open(isEdit, row)
}
function getList() {
    proTable.value.search()
}
</script>