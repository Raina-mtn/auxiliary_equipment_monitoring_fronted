<template>
    <div class="mask" v-if = "props.show">
        <div class="mask_box">
            <div class="close"><span @click="close">X</span></div>
            <div class="title"><img src="@/assets/images/gan.png" alt=""><span>烟感预警</span></div>
            <div class="content">
                <div>
                    <img src="" alt="" style="width: 160px; height: 120px;">
                </div>
                <div class="desc">
                    <p>
                        区域：开关室北门
                    </p>
                    <p>
                        区域：开关室北门
                    </p>
                    <p>
                        区域：开关室北门
                    </p>
                    <p>
                        区域：开关室北门
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
const props = defineProps(["show"])
const emits = defineEmits(['close'])
function close() {
    emits('close')
}
</script>
<style>
.mask {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background: rgba(0, 0, 0, 0.5);

    &_box {
        width: 460px;
        height: 236px;
        background: #0B2363;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;

        .close {
            font-size: 13px;
            color: #FFFFFF;
            text-align: right;
            cursor: pointer;
        }

        .title {
            display: flex;
            align-items: center;
            font-size: 16px;
            color: #FFFFFF;
            line-height: 19px;
            margin-bottom: 25px;

            span {
                margin-left: 10px;
            }

        }

        .content {
            display: flex;

            .desc {
                font-size: 14px;
                color: #FFFFFF;
                margin-left: 16px;

                p {
                    margin-bottom: 13px;
                }
            }
        }
    }

}
</style>