<template>
    <el-dialog v-model="state.dialogVisible" :title="`视频监控`" width="50%" :close-on-click-modal="false">

        <div>
            区域:<span class="mr-4">{{ state.msg.areaName }}</span>点位:<span class="mr-4">{{ state.msg.lineName
            }}</span>设备名称:<span class="mr-4">{{
    state.msg.equipmentName }}</span>
        </div>
        <div class="camera-container">
            <HkNoPlugin :camera-list="state.cameraList" ref="cameraIfameRef" :iWndowType="1"
                :presetIndex="state.presetIndex" v-if="state.dialogVisible" />
            <div class="tool-bar">
                <el-icon @click="capture" size="large">
                    <Camera />
                </el-icon>
                <el-icon @click="fullScreen" size="large">
                    <FullScreen />
                </el-icon>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="closeDialog">关闭</el-button>
                <el-button type="primary" @click="gotoPage">
                    实时视频
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
        
<script setup lang='ts'>
import { reactive } from 'vue';
import HkNoPlugin from '@/components/HkCamera/NoPlugin/indexWarn.vue'
import { router } from "@/router";
import { wsStore } from '@/store/index'
import type { Camera } from '@/api/interface/types';
const useWsStore = wsStore()
import { monitorStore } from '@/store/modules/monitor';

const useMonitorStore = monitorStore()
const state = reactive({
    dialogVisible: false,
    cameraList: [] as Camera[],
    msg: {
        equipmentName: '',
        lineName: '',
        areaName: ''
    },
    presetIndex: 1
})
// {"data":{"secretKey":"shenhao123","equipmentCode":"HIK-01","channelNumber":1,"ipAddress":"","lineName":"rongyu-2","areaName":"新城变","port":80,"equipmentName":"海康相机01","presetIndex":1,"account":"admin"},"logInfo":"null","detail":"1003","status":{"msg":"成功","code":1}}
useWsStore.$subscribe((_, wsState) => {
    state.dialogVisible = wsState.cameraDialogVisible
    const { cameraInfo } = wsState
    state.cameraList = [
        {
            ip: cameraInfo.ipAddress || '172.16.190.155',
            port: cameraInfo.port || '80',
            username: cameraInfo.account,
            password: cameraInfo.secretKey,
            channel: cameraInfo.channelNumber,
        }
    ]
    state.msg = { ...wsState.cameraInfo }
    state.presetIndex = cameraInfo.presetIndex
})


function gotoPage() {
    closeDialog()
    router.push('/home/intelliAuxiliary/realtimeMonitor')
}

function closeDialog() {
    useWsStore.closeCameraDialog()
}

// 抓图
function capture() {
    useMonitorStore.postMessage({
        connectType: 'capture',
        params: {
            camera: state.cameraList[0]
        }
    })
}
// 全屏
function fullScreen() {
    useMonitorStore.postMessage({
        connectType: 'fullScreen',
    })
}




</script>
        
<style scoped lang="scss">
.camera-container {
    height: 540px;
    position: relative;
}

.tool-bar {
    height: 54px;
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    position: absolute;
    bottom: 0;

    .el-icon {
        cursor: pointer;
    }
}
</style>