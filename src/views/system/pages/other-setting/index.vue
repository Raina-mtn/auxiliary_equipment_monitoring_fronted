<template>
    <div class="time text-light-50 p-16px">
        <left-panel title="其他设置">
            <el-icon>
                <Document />
            </el-icon>
            <span class="ml-6px">文件存储设置 </span>
        </left-panel>
        <div class="flex-1 p-4 bg-deepBlue ml-4 text-green">
            <Title title="文件存储设置" class="mt-4 mb-2" />
            <el-form ref="ruleFormRef" :model="inform" label-width="500" class="demo-ruleForm" status-icon size="large">
                <el-form-item label="文件储存时长：" prop="resourceExpiration">
                    <el-input-number v-model="inform.resourceExpiration" :controls="false" :min="1" :max="1000"
                        class="w-60 mr-2">
                    </el-input-number>天
                </el-form-item>
                <el-form-item label="数据备份周期: " prop="databaseBackupCircle" style="margin-top: 36px">
                    <el-input-number v-model="inform.databaseBackupCircle" :controls="false" :min="1" :max="30"
                        class="w-60 mr-2">
                    </el-input-number>天
                </el-form-item>
                <el-form-item label=" " style="margin-top: 36px">
                    <el-button type="primary" @click="save">保存</el-button>
                    <el-button>关闭</el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>
  
<script setup lang="ts">
import LeftPanel from '../../components/LeftPanel.vue'
import Title from "@/views/system/components/Title.vue";
import { ElMessage } from "element-plus";
import { reactive, } from 'vue';
import { apiGetConfig, apiSetConfig } from '@/api/interface/system/config'


const inform = reactive({
    databaseBackupCircle: 7,
    resourceExpiration: 7,
});

getConfig()
function getConfig() {
    apiGetConfig().then(res => {
        Object.assign(inform, res.data)
    })
}

function save() {
    const params = {
        databaseBackupCircle: inform.databaseBackupCircle,
        resourceExpiration: inform.databaseBackupCircle,
        databaseBackupPath: '/home/robot/backup',
        databaseBackupTime: '1970-01-01 00:00:00'
    }
    apiSetConfig(params).then(res => {
        ElMessage.success('设置成功')
    })
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
  