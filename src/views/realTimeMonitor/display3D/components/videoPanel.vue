<template>
  <div class="dialog w-1/5 h-1/4" v-if="props.videoShow">
    <div class="title w-full flex justify-between">
        <div class="text w-2/3 ml-2">电缆测过#1012</div>
        <el-icon :size="24" :color="'#ffffff'" style="height:2.5rem;line-height: 2.5rem;cursor: pointer;" @click="closed()">
            <Close />
        </el-icon>
    </div>
    <div class="mian">
        <Video :src="src" :second="3" :play-width="5" :zoom="'fill'" />
    </div>
  </div>
</template>
<script lang='ts' setup>
import Video from "@/components/Video.vue";

import { Close } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
const props = defineProps(["videoShow"]);
let emit=defineEmits(["update:videoShow"]) 
let src = ref("http://vjs.zencdn.net/v/oceans.mp4")
const closed = () => {
    emit("update:videoShow",false)
}
</script>

<style scoped lang='scss'>
.dialog {
    z-index: 9999999999999999999999999999999;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
    position: absolute;
    background-color: #0B2363;
    .title{
        height: 2.5rem;
        background-color: #1765E3;
        color: #fff;
        line-height: 2.5rem;
        .text {
            font-size: 16px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #FFFFFF;
        }
    }
    .mian{
        width: 90%;
        height: calc(100% - 4.5rem);
        margin: 1rem auto 0 auto;
        background-color: #fff;
    }
}
</style>