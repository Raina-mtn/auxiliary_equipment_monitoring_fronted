<template>
    <div class="flex h-full">
        <div class="w-1/2 ml-4" style="background: #0B2363;">
            <header class="pl-10">
                <span style="color: #FFFFFF;">全部：{{ monitorState.totalCount }}</span>
                <span style="color: #36B236;">正常：{{ monitorState.normalCount }}</span>
                <span style="color: #FF7729;">告警：{{ monitorState.abnormalCount }}</span>
                <span style="color: #2996F1;">挂牌：{{ nameplateCount }}</span>
            </header>

            <el-tabs type="card" class="mt-4 ml-4" v-model="state.showType">
                <el-tab-pane :label="'卡片'" :name="'list'">
                    <el-scrollbar>
                        <ul class=" mt-4 ">
                            <li class=" p-4" style="background-color: #1B3D9F;" v-for="item, index in gram" :key="index">
                                <div class="flex title">
                                    <div>
                                        <div :class="[item.status == 1 ? 'normal' : 'warning']" class="mb-3"><span
                                                class="iconfont icon-zhuangtai mr-1 text-[20px]"
                                                style="color: #16DBE7;"></span>{{
                                                    item.status
                                                    == 1 ?
                                                    '正常' : '告警' }}</div>
                                        <div :class="[item.status == 1 ? 'title-c' : 'warning']" class="mb-3"><span
                                                class="iconfont icon-shuju mr-1" style="color: #16DBE7;"></span>{{
                                                    item.num
                                                }}{{ item.unit }}</div>
                                        <div style="color: #FFFFFF;"><span class="iconfont icon-bianhao mr-1"
                                                style="color: #16DBE7;"></span>
                                            {{ item.equipmentName }}</div>
                                    </div>
                                    <div>
                                        <img :src="item.icon" class="w-14 h-14" alt="">
                                        <div class="mt-4 title-c" style="text-align: center;">{{ item.name }}</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <NoData v-if="gram.length === 0" />
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane :label="'列表'" :name="'table'">
                    <el-table :data="gram" style="width: 100%" class="mt-4">
                        <el-table-column prop="name" label="监测指标" />
                        <el-table-column prop="deployPointName" label="点位名称" />
                        <el-table-column prop="num" label="监测结果" />
                        <el-table-column prop="status" label="状态">
                            <template #default="scope">
                                <span :style="{ color: scope.row.status == 1 ? '#36B236' : '#FF7729' }">
                                    {{ scope.row.status == 1 ? '正常' : '告警' }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="w-1/2 ml-4">
            <el-tabs type="card" v-model="state.rightTabActiveName">
                <el-tab-pane :label="'监测分析'" :name="'CHART'">
                    <div style="background: #0B2363;" class="pt-2">
                        <Search-Form :activeName="props.activeName" @submit="search" @init="getSearchParam"></Search-Form>
                        <!-- <div class="data-panel flex ml-11 mt-4">
                <div class="w-1/3">
                    <div class="panel-num num2">{{ rightState.warnNum }}</div>
                    <div class="panel-title">告警数</div>
                </div>
            </div> -->
                        <!--    告警联动趋势-->
                        <section class="mb-5 mt-4 flex-1 ">
                            <el-tabs type="card" class="mt-4 ml-4" v-model="state.chartType">
                                <el-tab-pane :label="'趋势图'" :name="'line'"></el-tab-pane>
                                <el-tab-pane :label="'柱状图'" :name="'bar'"></el-tab-pane>
                            </el-tabs>
                            <div class="h-400px">
                                <Chart :option="chartOptionComputed" />
                            </div>
                        </section>

                    </div>

                </el-tab-pane>
                <el-tab-pane :label="'PRPD图谱'" :name="'PRPD'" v-if="props.activeName === 'PARTIAL_DISCHARGE'">
                    <el-image :src="getAssetsImge('PRPD.jpg')" class="m-2" />
                </el-tab-pane>
                <el-tab-pane :label="'PRPS图片'" :name="'PRPS'" v-if="props.activeName === 'PARTIAL_DISCHARGE'">
                    <el-image :src="getAssetsImge('PRPS.jpg')" class="m-2" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script  setup lang="ts">
import SearchForm from './search-form.vue'
import Chart from '@/components/Chart/Chart.vue'
import { chartOption } from '../chart.config'
import { apiGetStateStatistics, apiGetEquipmentList, apiGetStatus, apiGetOnlineTrend } from '@/api/interface/intelliAuxiliary/dynamicEnvi'
import { oilShowItems, coreShowItems, SF6ShowItems, parShowItems, DataItem } from '../config'
import NoData from '@/components/NoData.vue'


import { ref, watch } from 'vue'
import { reactive } from 'vue'
import { computed } from 'vue'
import { getAssetsImge } from '@/utils'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
const props = defineProps(["activeName", "activeIds"])
const monitorState = ref({
    totalCount: 0,
    normalCount: 0,
    abnormalCount: 0
})
const state = reactive({
    showType: 'list',
    rightTabActiveName: 'CHART',
    chartType: 'line' as 'line' | 'bar'
})
const nameplateCount = ref()

let gram = ref<DataItem[]>([]) // 中间数据

const rightState = reactive({
    chartOptionData: {},
    searchParams: {} as Record<string, any>
})

const chartOptionComputed = computed(() => {
    if (!Object.keys(rightState.chartOptionData).length) {
        return {}
    }
    // @ts-ignore
    return chartOption(rightState.chartOptionData, state.chartType)
})


watch(
    () => props.activeName,
    () => {
        getTopStatis()
        getEquipmentList()
    },
    { immediate: true }
)
watch(
    () => props.activeIds,
    (val) => {
        const params = {
            primaryEquipmentIds: val
        }
        getEquipmentList(params)

    },
    // { immediate: true }
)
// 获取头部状态
function getTopStatis() {
    apiGetStateStatistics({ categoryCode: props.activeName, aggregateField: 'monitor_state' }).then(res => {
        monitorState.value = { ...res.data }
    })
    apiGetStatus({ categoryCode: props.activeName }).then(res => {
        nameplateCount.value = res.data.nameplateCount
    })

}
getEquipmentList()
// 设备列表
function getEquipmentList(searchParams?: object) {
    const params = {
        categoryCode: props.activeName,
        ...searchParams,
        page: {
            pageIndex: 1,
            pageSize: 10
        }
    }
    apiGetEquipmentList(params).then(res => {
        let current = res.data?.list || []

        if (props.activeName == 'OIL_CHROMATOGRAPHY') {
            gram.value = formatEquipmentData(oilShowItems, current)
        } else if (props.activeName === 'CORE_GROUND_CURRENT') {
            gram.value = formatEquipmentData(coreShowItems, current)
        } else if (props.activeName === 'SF6') {
            gram.value = formatEquipmentData(SF6ShowItems, current)
        } else if (props.activeName === 'PARTIAL_DISCHARGE') {
            gram.value = formatEquipmentData(parShowItems, current)
        }
        search(rightState.searchParams)
    })
}
// 数据处理
function formatEquipmentData(configs: Record<string, any>, list: any) {

    return list.map((current: Record<string, any>) => {
        if (current?.thingData) {
            const enmus = current?.thingData || {}
            const keys = Object.keys(configs)
            return keys.map((key: string) => ({
                status: current.monitorState,
                num: enmus[key],
                unit: configs[key]?.unit,
                name: configs[key]?.name,
                equipmentId: current.equipmentId,
                equipmentName: current.equipmentName,
                icon: configs[key]?.icon,
                deployPointName: current.deployPointName
            }))
        } else {
            return []
        }
    }).flat()
}

function getSearchParam(data: any) {
    rightState.searchParams = cloneDeep(data)
}

// 右边的点击查询
function search(data: any) {
    const equipmentId = gram.value.length ? gram.value[0].equipmentId : ''
    rightState.searchParams = cloneDeep(data)
    if (equipmentId === '') {
        rightState.chartOptionData = {}
        ElMessage.error('请先选择设备')
    } else {
        getChartTrend()

    }
}

// 右边图表
function getChartTrend() {
    const params = {
        equipmentId: gram.value.length ? gram.value[0].equipmentId : '',
        warnTargetCode: rightState.searchParams.warnTargetCode,
        startTime: rightState.searchParams.date[0],
        endTime: rightState.searchParams.date[1]
    }
    apiGetOnlineTrend(params).then(res => {
        if (res.data?.length) {
            const xData = res.data.map((v: any) => v.monitorTime)
            const sData = [{
                name: res.data[0].warnTargetName,
                ydata: res.data.map((v: any) => v.value)
            }]
            rightState.chartOptionData = {
                xData,
                sData
            }

        } else {
            rightState.chartOptionData = {}
        }
    }).catch(() => {
        rightState.chartOptionData = {}
    })
}

</script>
<style lang="scss" scoped>
header {
    line-height: 44px;
    font-size: 16px;
    background: rgba(27, 61, 159, 0.7);
    border-radius: 0px 0px 0px 0px;

    span {
        margin-right: 42px;
    }
}

.title {
    justify-content: space-between;

    &-c {
        color: #FFFFFF;
    }
}

ul {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 20px;

    li {
        width: 100%;
        flex-shrink: 0;
        margin-bottom: 20px;
        cursor: pointer;
    }
}

.warning {
    color: #FF7729;
}

.normal {
    color: #36B236;
}

.data-panel {
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;

    .panel-num {
        font-size: 28px;
        color: #FFFFFF;

        &.num1 {
            color: #0AF0FD;
        }

        &.num2 {
            color: #FF7729;
        }
    }

    .panel-title {
        color: rgba(255, 255, 255, 0.7);
    }

}
</style>