<template>
    <div class="title">
        <span class="title__span">设备列表</span>
    </div>
    <div class="history-container flex">
        <div class="left-panel">
            <CameraTree @loadTree="loadCameraList" />
        </div>
        <div class="right-panel flex-1 h-full flex flex-col">
            <div class="text-white items-center pt-6 mx-6">
                <el-date-picker v-model="dateTime" type="datetimerange" :format="`YYYY-MM-DD HH:mm:ss`" placement="left"
                    popper-class="popper-class" style="width: 400px;" />
                <el-button type="primary" class="ml-4" @click="searchRecord">搜索录像</el-button>
            </div>
            <div class="p-6 flex-1">
                <div class="camera_ifame">
                    <HkNoPlugin ref="cameraIfameRef" :iWndowType="1" :camera-list="state.treeList" />
                </div>
            </div>
            <div class="speed-control-bar">
                <el-tooltip effect="dark" content="播放/暂停" placement="bottom">
                    <span class="iconfont icon-bofang mx-6" @click="togglePlay"></span>
                </el-tooltip>
                <el-tooltip effect="dark" content="慢放" placement="bottom">
                    <div style="transform: rotate(180deg); display: inline-block; height: 16px; line-height: 16px;">
                        <span class="iconfont icon-kuaijin mx-6 " @click="playSlow"></span>
                    </div>
                </el-tooltip>
                <el-tooltip effect="dark" content="快放" placement="bottom">
                    <span class="iconfont icon-kuaijin mx-6" @click="playFast"></span>
                </el-tooltip>
                <p class="float-right w-40">当前播放速度为{{ speedShowObj[String(state.speed)] }}X</p>
            </div>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
import { ref, reactive } from 'vue';
import CameraTree from '../components/CameraTree.vue'
import HkNoPlugin from '@/components/HkCamera/NoPlugin/index.vue'
import { treeToList } from '@/utils/treeHelper'
import type { Camera } from '@/api/interface/types';
import dayjs from 'dayjs';
import { monitorStore } from '@/store/modules/monitor';

const useMonitorStore = monitorStore()

const dateTime = ref<[string, string]>([
    dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
    dayjs().format('YYYY-MM-DD HH:mm:ss')
])
const state = reactive({
    treeList: [] as Camera[],
    speed: 1,
    playing: true // 播放中
})
// 获得可播放的视频监控列表
function loadCameraList(res: any) {
    state.treeList = treeToList(res, { pid: 'parentId' }).filter(v => v.type === 'CAMERA').map(v => {
        const registerInfo = v.registerInfo || {}
        return {
            id: v.id,
            ip: registerInfo.ipAddress,
            port: registerInfo.port,
            username: registerInfo.account,
            password: registerInfo.secretKey,
            channel: registerInfo.channelNumber
        }
    })
}

// 搜索录像
function searchRecord() {
    const [startTime, endTime] = dateTime.value
    useMonitorStore.playBack({ startTime, endTime })


}
// 暂停，
function togglePlay() {
    state.playing = !state.playing
    useMonitorStore.postMessage({
        connectType: 'togglePlay',
        params: {
            playing: state.playing
        }
    })
}
// 展示在页面上的速度键值对
const speedShowObj = {
    '1': 1,
    '2': 2,
    '3': 4,
    '4': 8,
    '0': '1/2',
    '-1': '1/4',
    '-2': '1/8'
}
function playSlow() {
    if (state.speed > -2) {
        state.speed--
        useMonitorStore.postMessage({
            connectType: 'playFast',
        })
    }



}

function playFast() {
    if (state.speed < 4) {
        state.speed++
        useMonitorStore.postMessage({
            connectType: 'playSlow',
        })
    }
}

</script>
    
<style lang="scss" scoped>
.history-container {
    height: calc(100% - 50px);
}

.title {
    height: 42px;
    color: #fff;

    &__span {
        width: 102px;
        display: inline-block;
        background: #1765E3;
        text-align: center;
        line-height: 42px;

    }
}

.left-panel {
    width: 650px;
    margin-right: 10px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #0B2363;
}

.right-panel {
    height: 100%;

    background: #0B2363;

    .camera_ifame {
        height: 100%;
    }

    .speed-control-bar {
        height: 70px;
        background: rgba(54, 158, 248, 0.3);
        line-height: 70px;
        color: #fff;
        padding: 0 20px;
        text-align: center;

        span {
            cursor: pointer;
        }

        p {
            font-size: 14px;
        }
    }
}
</style>
<style lang="scss">
.popper-class {
    inset: 195px auto auto 0 !important;

    .el-popper__arrow {
        left: 100% !important;
        transform: rotate(90deg) translateY(4px);
        right: -14px;
    }

}
</style>