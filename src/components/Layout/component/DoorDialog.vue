<template>
    <el-dialog v-model="state.dialogVisible" :title="`设备联动确认`" width="30%">

        <div class="link-text">
            <p> 门禁系统在 {{ state.time }} </p>
            <p>收到开门请求，是否允许进入？</p>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleDoor(false)">拒绝</el-button>
                <el-button type="primary" @click="handleDoor(true)">
                    允许
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
    
<script setup lang='ts'>
import { reactive } from 'vue';
import { wsStore } from '@/store/index'
const useWsStore = wsStore()

const state = reactive({
    dialogVisible: false,
    time: '2023-12-12 11:12:12'
})


function handleDoor(open: boolean) {
    console.log(open);

}



function closeDialog() {
    state.dialogVisible = false
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