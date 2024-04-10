<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="点位">
                <el-tree-select v-model="formInline.deployAreaId" :data="pointList" :value-key="'id'" />
            </el-form-item>
            <el-form-item label="设备编号">
                <el-input v-model="formInline.code" clearable>
                </el-input>
            </el-form-item>
            <el-form-item label="监测状态">
                <el-select v-model="formInline.monitorState" clearable>
                    <el-option v-for="(item, index) in monitorState" :key="index" v-bind="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="开关状态">
                <el-select v-model="formInline.switchState" clearable>
                    <el-option v-for="(item, index) in switchState" :key="index" v-bind="item" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { monitorState, switchState } from '../config'
import { apiGetZoneTree } from '@/api/interface/system/area';

const emits = defineEmits(['search'])
type Area = {
    name: string
    id: string
}
const pointList = ref<Area[]>([])
const formInline = reactive({
    deployAreaId: '',
    code: '',
    switchState: '',
    monitorState: ''
})

const search = () => {
    emits('search', formInline)
}
const reset = () => {
    formInline.deployAreaId = ''
    formInline.code = ''
    formInline.switchState = ''
    formInline.monitorState = ''
    emits('search', formInline)
}
getAreaList()
function getAreaList() {
    apiGetZoneTree().then(res => {
        pointList.value = res?.data || []

    })
}
</script>