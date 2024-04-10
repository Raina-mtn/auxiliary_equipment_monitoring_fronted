<template>
    <div class="ptz flex items-center justify-around">
        <div class="ptz-btn__rouned btn-realease" title="拉近" v-longclick @longPressStart="() =>
            handleControlPtz({
                iPTZIndex: 12,
            })
            " @longPressEnd="() =>
        handleControlPtz({
            iPTZIndex: 12,
            bStop: true,
        })
        ">
            <el-icon>
                <Minus />
            </el-icon>
        </div>
        <div class="ptz-bg">
            <div class="ptz-btn ptz-btn__left" v-longclick @longPressStart="() =>
                handleControlPtz({
                    iPTZIndex: 3,
                })
                " @longPressEnd="() =>
        handleControlPtz({
            iPTZIndex: 3,
            bStop: true,
        })
        "></div>
            <div class="ptz-btn ptz-btn__top" v-longclick @longPressStart="() =>
                handleControlPtz({
                    iPTZIndex: 1,
                })
                " @longPressEnd="() =>
        handleControlPtz({
            iPTZIndex: 1,
            bStop: true,
        })
        "></div>
            <div class="ptz-btn ptz-btn__right" v-longclick @longPressStart="() =>
                handleControlPtz({
                    iPTZIndex: 4,
                })
                " @longPressEnd="() =>
        handleControlPtz({
            iPTZIndex: 4,
            bStop: true,
        })
        "></div>
            <div class="ptz-btn ptz-btn__bottom" v-longclick @longPressStart="() =>
                handleControlPtz({
                    iPTZIndex: 2,
                })
                " @longPressEnd="() =>
        handleControlPtz({
            iPTZIndex: 2,
            bStop: true,
        })
        "></div>
            <div class=" ptz-btn__center">
                <i class="iconfont icon-refresh"></i>
            </div>
        </div>
        <div class="ptz-btn__rouned btn-add" title="拉近" v-longclick @longPressStart="() =>
            handleControlPtz({
                iPTZIndex: 12,
            })
            " @longPressEnd="() =>
        handleControlPtz({
            iPTZIndex: 12,
            bStop: true,
        })
        ">
            <el-icon>
                <Plus />
            </el-icon>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
import { Minus, Plus } from '@element-plus/icons-vue';
import { monitorStore } from '@/store/modules/monitor';

const useMonitorStore = monitorStore()

function handleControlPtz(params: any) {
    console.log(params);

    useMonitorStore.postMessage({
        connectType: 'PTZControl',
        params
    })
}


</script>
    
<style lang="scss" scoped>
.ptz {
    transform: scale(0.4);
    height: 150px;
}

.ptz-bg {
    width: 344px;
    height: 344px;
    background: url('@/assets/images/ptz_bg.png');
    background-size: 100% 100%;
    display: grid;
    grid-template-columns: 85px 174px 85px;
    grid-template-rows: 85px 174px 85px;
    grid-template-areas: '. ptz-btn__top .' 'ptz-btn__left ptz-btn__center ptz-btn__right' '. ptz-btn__bottom .';

    .ptz-btn {
        width: 100%;
        height: 100%;
        position: relative;
        cursor: pointer;

        &::after {
            position: absolute;
            content: '';
            top: 50%;
            left: 50%;
            transform: translate(-50%, -80%);
            width: 50px;
            height: 50px;
            background: #0AF0FD;
            clip-path: polygon(50% 40%, 100% 100%, 0 100%);

        }

        &__left {
            grid-area: ptz-btn__left;
            transform: rotate(-90deg);
        }

        &__right {
            grid-area: ptz-btn__right;
            transform: rotate(90deg);
        }

        &__top {
            grid-area: ptz-btn__top;
        }

        &__bottom {
            grid-area: ptz-btn__bottom;
            transform: rotate(180deg);
        }

        &__center {
            grid-area: ptz-btn__center;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #0AF0FD;
            cursor: pointer;

            .iconfont {
                font-size: 60px;
            }
        }
    }
}

.ptz-btn__rouned {
    width: 96px;
    height: 96px;
    background: #1B3D9F;
    box-shadow: inset 0px 0px 23px 2px #0AF0FD, 0px 0px 8px 0px rgba(6, 21, 18, 0.2);
    border-radius: 50%;
    border: 2px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .el-icon {
        width: 60px;
        height: 60px;
        color: #0AF0FD;

        :deep svg {
            transform: scale(3);
        }
    }
}
</style>