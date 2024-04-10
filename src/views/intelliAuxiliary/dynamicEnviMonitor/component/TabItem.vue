<template>
    <div class="p-4 tab-content">
        <slot :search="getEquipmentList">
            <SearchForm @search="getEquipmentList" />
        </slot>
        <div class="flex tab-content__list">
            <div class="w-2/3 mr-4 flex flex-col">
                <header class="flex justify-between text-white tab-item__header">
                    <div class="flex justify-between p-4 w-2/5">
                        <span>监测状态<b>{{ statisData.monitorState.totalCount || 0 }}</b></span>
                        <span>正常<b class="text-normal">{{ statisData.monitorState.normalCount || 0 }}</b></span>
                        <span>告警<b class="text-warning">{{ statisData.monitorState.abnormalCount || 0 }}</b></span>
                    </div>
                    <div class="flex justify-between p-4 w-2/5 mx-4">
                        <span>设备状态<b>{{ statisData.connectState.totalCount || 0 }}</b></span>
                        <span>正常<b class="text-warning">{{ statisData.connectState.normalCount || 0 }}</b></span>
                        <span>异常<b class="text-danger">{{ statisData.connectState.abnormalCount || 0 }}</b></span>
                    </div>
                    <div class="text-center w-1/5  p-4">
                        <span>挂牌<b class="text-warning">{{ statisData.nameplateCount || 0 }}</b></span>
                    </div>
                </header>
                <div class="tab-item__content p-4 flex-1 flex flex-col">
                    <div class="text-right mb-4 mr-4" v-if="!props.isOneTouch">
                        <el-button type="primary" :icon="View" @click=switchAll(true)>{{ props.switchOpenAllText ||
                            '一键开启' }}</el-button>
                        <el-button type="primary" :icon="Hide" @click=switchAll(false)>{{
                            props.switchCloseAllText ||
                            '一键关闭' }} </el-button>
                    </div>
                    <el-scrollbar class="flex-1">
                        <div class="flex flex-wrap">
                            <CardItem class="mr-4 mb-4" v-for="(item) in equipmentList" :key="item.equipmentId"
                                v-bind="item" :showItems="props.activeItem.showItems" :icon="props.activeItem.icon"
                                @close="isOpen(item, false)" @open="isOpen(item, true)" />

                        </div>
                    </el-scrollbar>
                </div>
            </div>
            <VideoMonitor class="w-1/3" :categoryCode="props.categoryCode">
            </VideoMonitor>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
import CardItem from './CardItem.vue';
import SearchForm from './SearchForm.vue'
import VideoMonitor from './VideoMonitor.vue'
import { reactive, ref, onMounted, watch } from 'vue';
import { View, Hide } from "@element-plus/icons-vue";
import { apiSwitchEquipmentAll, apiGetEquipmentList, apiGetStateStatistics, apiGetStatus } from '@/api/interface/intelliAuxiliary/dynamicEnvi'
import { ElMessage } from 'element-plus';
import { recheckPass } from '@/components/RecheckPass/index'

//switchOpenAllText 一键开启文案, switchCloseAllText: 一键关闭文案
const props = defineProps(['categoryCode', 'activeItem', 'searchParams', 'isOneTouch', 'switchOpenAllText', 'switchCloseAllText'])
interface StatisRes {
    totalCount: number
    normalCount: number
    abnormalCount: number
}

const statisData = reactive({
    monitorState: <StatisRes>{},
    connectState: <StatisRes>{},
    nameplateCount: 0
})
const equipmentList = ref([])

onMounted(() => {
    search()
})

watch(() => [props.categoryCode, props.searchParams], () => {
    search()
})

function search() {
    getEquipmentList(props.searchParams)
    getTopStatis()
}


// 设备列表
function getEquipmentList(searchParams?: object) {
    const params = {
        page: {
            pageIndex: 1,
            pageSize: 100
        },
        categoryCode: props.categoryCode,
        ...searchParams
    }
    apiGetEquipmentList(params).then(res => {
        equipmentList.value = res.data.list
        console.log(res.data);

    })
}


// 获取头部统计数据
function getTopStatis() {
    // 请求3种类型数据
    apiGetStateStatistics({ categoryCode: props.categoryCode, aggregateField: 'monitor_state' }).then(res => {
        statisData.monitorState = { ...res.data }
    })
    apiGetStateStatistics({ categoryCode: props.categoryCode, aggregateField: 'connect_state' }).then(res => {
        statisData.connectState = { ...res.data }
    })
    apiGetStatus({ categoryCode: props.categoryCode }).then(res => {
        statisData.nameplateCount = res.data.nameplateCount
    })
}
// 一键开启，一键关闭
async function switchAll(status: boolean) {
    await recheckPass()
    const params = {
        categoryCode: props.categoryCode,
        openFlag: status ? 'OPEN' : 'CLOSE'
    }
    apiSwitchEquipmentAll(params).then(() => {
        ElMessage.success(status ? '开启成功' : `关闭成功`)
        getEquipmentList()
    })
}
//是否开门
function isOpen(current: { equipmentId: any; }, flag: boolean) {
    equipmentList.value.forEach((item: any) => {
        if (item.equipmentId == current.equipmentId) {
            item.switchState = flag
        }
    })

}

defineExpose({ search })
</script>
    
<style>
.tab-content {
    height: calc(100% - 62px);

    &__list {
        height: calc(100% - 40px);
    }

}

.tab-item {

    &__header {
        div {
            background: rgba(23, 101, 227, 0.8);

            span {
                color: rgba(255, 255, 255, 0.8);

                b {
                    margin: 0 4px;
                    font-size: 20px;
                }
            }
        }
    }

    &__content {
        background: #193580;
        height: calc(100% - 60px);
    }
}
</style>