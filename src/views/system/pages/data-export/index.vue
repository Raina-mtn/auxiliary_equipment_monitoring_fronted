<template>
    <div class="time text-light-50 p-16px">
        <left-panel title="数据导出">
            <el-icon>
                <Document />
            </el-icon>
            <span class="ml-6px">数据导出 </span>
        </left-panel>
        <div class="flex-1 p-4 bg-deepBlue ml-4 text-green">
            <Title title="历史数据导出" class="mt-4 mb-2" />
            <el-form ref="ruleFormRef" :model="inform" label-width="200" class="w-200" status-icon size="large">
                <el-form-item label="设备" prop="categoryCode" :rules="[{ required: true, message: '请选择设备' }]">
                    <el-tree-select v-model="inform.categoryCode" :data="treeData" :value-key="'id'" />
                </el-form-item>
                <el-form-item label="时间 " prop="date" style="margin-top: 36px"
                    :rules="[{ required: true, message: '请选择开始结束时间' }]">
                    <el-date-picker type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"
                        v-model="inform.date" :value-format="'YYYY-MM-DD'" />
                </el-form-item>
                <el-form-item label=" " style="margin-top: 36px">
                    <el-button type="primary" @click="exportData">导出</el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>
  
<script setup lang="ts">
import LeftPanel from '../../components/LeftPanel.vue'
import Title from "@/views/system/components/Title.vue";
import { ElMessage } from "element-plus";
import { reactive, ref } from 'vue';
import { apiExportEquipment } from '@/api/interface/device'
import dayjs from 'dayjs'
import { downloadByData } from '@/utils/download';
import { apiGetEquipmentTree } from "@/api/interface/intelliAuxiliary/equipment";

const startTime = dayjs().subtract(7, 'day').format('YYYY-MM-DD')
const endTime = dayjs().format('YYYY-MM-DD')
const inform = reactive({
    categoryCode: '',
    date: [startTime, endTime],
});
const treeData = ref([])
const ruleFormRef = ref()

async function exportData() {
    await ruleFormRef.value.validate()
    const params = {
        categoryCode: inform.categoryCode,
        minReportTime: inform.date[0],
        maxReportTime: inform.date[1]
    }
    apiExportEquipment(params).then(res => {
        downloadByData(res, '数据导出.xlsx')
        ElMessage({
            type: 'success',
            message: '导出成功'
        })
    })
}
getEqupimentTree()
function getEqupimentTree() {
    const categoryList = ['TRANSFORMER', 'LIGHTNING_ARRESTED', 'CIRCUIT_BREAKER'] // 写死，查主设备

    apiGetEquipmentTree({ categoryList }).then(res => {
        treeData.value = res.data;

    });
}
</script>
<style scoped lang="scss">
.time {
    display: flex;
    width: 100%;
    height: 100%;
    padding-top: 32px;

    &-content {
        flex: 1;
        height: 100%;
        background: #0B2363;
        margin-left: 16px;

        &__header {
            .header-line {
                width: 4px;
                height: 20px;
                background: #0AF0FD;
                border-radius: 8px 8px 8px 8px;
                opacity: 1;
            }

            .header-name {
                font-size: 16px;
                color: #FFFFFF;
                margin-left: 10px;
            }
        }

        &__types {
            padding-left: 4px;
            margin-top: 20px;

            .types-item {
                margin-bottom: 16px;
                font-size: 14px;
            }
        }
    }
}
</style>
  