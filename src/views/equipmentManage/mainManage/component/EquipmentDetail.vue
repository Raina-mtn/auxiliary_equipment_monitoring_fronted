<template>
    <div class="equipment-detail" v-show="visible">
        <header class="equipment-detail__header flex">
            <el-button :icon="DArrowLeft" type="text" class="text-white" @click="visible=false">返回</el-button>
            <div>
                <el-button :icon="EditPen" type="primary"> 编辑</el-button>
                <el-button :icon="Delete" type="primary">删除</el-button>
            </div>
        </header>
        <section class="equipment-detail__main">
            <div class="main-left min-h-500px pb-60px">
                <h3>设备信息</h3>
                <div class="main-content">
                    <el-descriptions :column="2">
                        <template #title>
                            <h4><i class="tri-arrow" />基本信息</h4>
                        </template>
                        <el-descriptions-item width="50%" label="设备编号:">{{ deviceInfo.code || '--' }}</el-descriptions-item>
                        <el-descriptions-item width="50%" label="设备名称:">{{ deviceInfo.title || '--' }}</el-descriptions-item>
                        <el-descriptions-item label="设备类型:" width="50%">
                            {{ deviceInfo.grade === 1 ? '主设备' : (deviceInfo.grade === 2 ? '传感器' : '') }}
                        </el-descriptions-item>
                        <el-descriptions-item label="设备状态:" :style="{ color: deviceInfo.connectState ? '#69EF00' : '#FF0000' }">
                            {{ deviceInfo.connectState ? '在线' : '离线' }}
                        </el-descriptions-item>
                    </el-descriptions>
                    <el-descriptions :column="2" class="my-4">
                        <template #title>
                            <h4><i class="tri-arrow" />点位信息</h4>
                        </template>
                        <el-descriptions-item label="点位名称:" width="50%">{{ deviceInfo.area[1] }}</el-descriptions-item>
                        <el-descriptions-item label="区域名称:" width="50%">{{ deviceInfo.area[0] }}</el-descriptions-item>
                    </el-descriptions>
                    <el-descriptions :column="2">
                        <template  #title>
                            <h4><i class="tri-arrow" />其他信息</h4>
                        </template>
                        <el-descriptions-item label="更新时间:" width="50%">{{ deviceInfo.updateTime }}</el-descriptions-item>
                        <el-descriptions-item label="更新人:" width="50%">{{ deviceInfo.updateBy }}</el-descriptions-item>
                        <el-descriptions-item label="创建时间:" width="50%">{{ deviceInfo.createTime }}</el-descriptions-item>
                        <el-descriptions-item label="创建人:" width="50%">{{ deviceInfo.createBy }}</el-descriptions-item>
                        <el-descriptions-item label="备注:" width="50%">{{ deviceInfo.memo || '--' }}</el-descriptions-item>
                        
                    </el-descriptions>
                    <el-descriptions :column="1">
                        <el-descriptions-item label="设备图片:" class-name="imgs">
                            <template v-if="deviceInfo.imageList && deviceInfo.imageList.length > 0">
                                <el-image
                                    v-for="(item) in deviceInfo.imageList"
                                    :src="baseImgUrl + item"
                                    :key="item" 
                                    :fit="'fill'"
                                    style="margin-right: 12px; width: 140px; height: 80px; margin-bottom: -60px;"
                                />
                            </template>
                            <span v-else>--</span>
                        </el-descriptions-item>
                    </el-descriptions>
                </div>
            </div>
            <div class="main-right">
                <h3>传感器</h3>
                <div class="main-content">
                    <ProTable
                        ref="proTable"
                        title="用户列表"
                        :columns="sensorDetailcolumns"
                        :data="tableData"
                        :searchToolButton="false"
                        :searchCol="searchCol"
                        :pagination="false"
                    >
                    </ProTable>
                </div>
            </div>
        </section>
    </div>
</template>
    
<script setup lang='ts' name="EquipmentDetail">
import { DArrowLeft, Delete, EditPen, } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { ref, watch, onMounted } from "vue";
import {sensorDetailcolumns} from '../config'

interface Idevices {
    code: string | number,
    title: string,
    grade: number,
    connectState: boolean,
    area: (string)[],
    updateTime: string,
    updateBy: string | number,
    createBy: string | number,
    createTime: string,
    memo: string | null,
    imageList?: string[]
}
const tableData = ref([])
const proTable = ref()
const baseImgUrl = import.meta.env.VITE_APP_BASE_API
// 保存传感器数据，用于筛选
const saveTableList = ref([])
const deviceInfo = ref<Idevices>({
    code: '',
    title: '',
    grade: 1,
    connectState: false,
    area: ['--', '--'],
    updateTime: '',
    updateBy: '',
    createBy: '',
    createTime: '',
    memo: ''
})
const searchCol = { // 一行显示几个form-item
  xs:2,
  sm:2,
  md:2,
  lg:2,
  xl:2
}
const visible = ref(false) // 详情页显示隐藏

onMounted(() => {
    watch(() => proTable.value.searchParam, (val) => {
        console.log('打印数据---val', val)
    }, { deep: true })
})


function open (row: any) {
  visible.value = true
  tableData.value = row?.affiliatedList
  deviceInfo.value = { ...row }
  saveTableList.value = row?.affiliatedList
}

defineExpose({
  open,
  visible
})


</script>
    
<style lang="scss" scoped>
.equipment-detail{
    position: absolute;
    height: 100%;
    top: 130px;
    left: 1rem;
    right: 1rem;
    background: #0B2363;
    z-index: 9999;
    overflow: auto;
    &__header{
        display: flex;
        height: 66px;
        background: linear-gradient(90deg, #1B3D9F 0%, #0B2363 100%);
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
    }
    &__main{
        display: flex;
        padding: 20px;
        padding-bottom: 60px;
        &>div{
            flex: 1;
            width: 50%;
            margin: 0 10px;
            background: #193580;
        }
        h3{
            height: 42px;
            background: #1765E3;
            line-height: 42px;
            text-indent: 10px;
            color: #fff;
        }
        .main-content{
            background:  #193580;
            padding: 20px;
            :deep .el-descriptions__body{
                background: none;
                .el-descriptions__label{
                    color: rgba(255,255,255,0.7);
                }
            }
            h4{
                font-size: 16px;
                color: #fff;
                padding-left: 16px;
                position: relative;
                i{
                    width: 9px;
                    height: 9px;
                    background: #3CC9F5;
                    clip-path: polygon(0 0%, 100% 0, 0 100%);
                    position: absolute;
                    top: 0;
                    left: 0;
                }
            }
        }
    }

    
}
</style>

<style>
    .imgs {
        /* flex: 1; */
        /* display: flex; */
        display: inline-block;
        /* margin-top: 60px; */
    }
</style>
