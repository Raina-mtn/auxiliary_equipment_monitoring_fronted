<template>
    <div style="height: 100%; width: 100%">
        <iframe id="monitorDialog" style="height: 100%; width: 100%" class="windows" src="./hk_noPlugin/indexWarn.html"
            frameborder="0" @load="onload" />
    </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { reactive, nextTick, watch } from 'vue';
import type { Camera } from '@/api/interface/types';
import { monitorStore } from '@/store/modules/monitor';

const useMonitorStore = monitorStore()

const props = defineProps({
    cameraList: Array as PropType<Camera[]>,
    iWndowType: Number,
    presetIndex: Number // 有该参数时初始化成功后会跳到预置位去
})

const state = reactive({
    iframeWindow: null,
    timer: null,
    playingCamera: {}
})


function onload() {
    nextTick(() => {
        const mapFrame = document.getElementById('monitorDialog')
        state.iframeWindow = mapFrame.contentWindow
        if (state.iframeWindow) {
            useMonitorStore.initFrame(state.iframeWindow, props.cameraList)
            setTimeout(() => {
                useMonitorStore.postMessage(
                    {
                        connectType: 'init',
                        params: {
                            cameraList: props.cameraList || [],
                            presetIndex: props.presetIndex,
                            iWndowType: props.iWndowType
                        }
                    }
                );
                useMonitorStore.reciveMessage()
            }, 500)
        }
    })
}

</script>