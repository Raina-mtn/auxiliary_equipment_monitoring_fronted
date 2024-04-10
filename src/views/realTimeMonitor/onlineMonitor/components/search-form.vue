<template>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" :label-position="'right'" label-width="90">
        <el-form-item label="时间">
            <el-date-picker v-model="formInline.date" value-format="YYYY-MM-DD HH" type="datetimerange"
                start-placeholder="请选择开始时间" end-placeholder="请选择结束时间" />
        </el-form-item>
        <el-form-item label="监测指标">
            <el-select v-model="formInline.warnTargetCode" clearable>
                <el-option :label="item.name" :value="item.code" v-for="item, index in options" :key="index" />
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import {
    apiListWarnTarget,
} from "@/api/interface/index";
import { ref, watch } from 'vue'
import dayjs from "dayjs";
const props = defineProps(["activeName"])
const emits = defineEmits(['submit', 'init'])

const startTime = dayjs().subtract(24, 'h').format('YYYY-MM-DD HH') // 过去24小时
const endTime = dayjs().format('YYYY-MM-DD HH')
const formInline = ref({
    date: [startTime, endTime],
    warnTargetCode: undefined as undefined | string
})
type OptionItem = {
    name: string
    code: string
}
let options = ref<OptionItem[]>([])



const onSubmit = () => {
    emits("submit", formInline.value)
}

watch(
    () => props.activeName,
    (val) => {
        apiListWarnTarget({ categoryCode: val }).then(res => {
            options.value = res.data
            formInline.value.warnTargetCode = res.data ? res.data[0]?.code : undefined
            emits("init", formInline.value)
        })
    },
    { immediate: true }
)

function reset() {
    formInline.value = {
        date: [startTime, endTime],
        warnTargetCode: ''
    }
    onSubmit()
}
</script>

<style>
.demo-form-inline .el-input {
    --el-input-width: 220px;
}
</style>