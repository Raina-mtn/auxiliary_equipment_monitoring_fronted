<template>
    <el-tabs v-model="activeName" type="card" class="mt-4">
        <el-tab-pane label="视频监控" name="video">
            <div class="px-4">
                <CameraTree :showCheckRow="false" />
            </div>
        </el-tab-pane>
        <el-tab-pane label="监控操作" name="monitor">
            <PTZ style="transform: scale(0.95); margin-top: 40%;" />
        </el-tab-pane>
        <el-tab-pane label="预置位" name="preset" lazy>
            <Preset v-if="activeName === 'preset'" />
        </el-tab-pane>
    </el-tabs>
</template>
    
<script setup lang='ts'>
import { ref } from 'vue'
import PTZ from '@/components/HkCamera/NoPlugin/PTZ.vue';
import Preset from './Preset.vue'
import CameraTree from '../../components/CameraTree.vue'

const activeName = ref('video')

</script>
    
<style scoped>
:deep .ptz-btn__rouned {
    margin-top: 50%;
}
</style>