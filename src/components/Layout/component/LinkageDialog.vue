<template>
    <el-dialog v-model="state.dialogVisible" :title="`设备联动确认`" width="30%" destroy-on-close>
        <div class="link-text">
            <p>{{
                `系统智能联动策略将启动${state.linkageInfo.areaName || '--'}区域${state.linkageInfo.lineName ||
                '--'}点位的${state.linkageInfo.equipmentName || '--'}设备`
            }}</p>
            <p>是否确认联动?</p>
            <p class="counter">倒计时 <span>{{ state.time }}</span> 秒后自动确认联动！</p>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="confirmRecord">
                    确认联动
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
    
<script setup lang='ts'>
import { apiConfirmRecord } from '@/api/interface/linkList'
import { reactive, ref } from 'vue';
import { wsStore } from '@/store/index'
const useWsStore = wsStore()

const state = reactive({
    dialogVisible: useWsStore.linkageDialogVisible,
    linkageInfo: {},
    time: 8
})
const timer = ref()
useWsStore.$subscribe((_, wsState) => {
    state.dialogVisible = wsState.linkageDialogVisible
    if (state.dialogVisible) {
        clearInterval(timer.value)
        startTimer()

    }
    state.linkageInfo = wsState.linkageInfo

})

function startTimer() {
    timer.value = setInterval(() => {
        if (state.time > 0) {
            state.time--
        } else if (state.time === 0) {
            confirmRecord()
            clearInterval(timer.value)
        }
    }, 1000)
}


function confirmRecord() {
    closeDialog()
    apiConfirmRecord([state.linkageInfo.linkageEventCode])
}

function closeDialog() {
    state.dialogVisible = false
    state.time = 8
    useWsStore.closeLinkageDialog()
}

</script>
    
<style lang="scss" scoped>
.link-text {
    p {
        font-size: 20px;
        margin: 20px 0;
        text-align: center
    }

    .counter {
        line-height: 48px;

        span {
            display: inline-block;
            width: 48px;
            height: 48px;
            background: url('@/assets/images/circle.png') no-repeat;
            background-size: 100% 100%;

        }

    }
}
</style>