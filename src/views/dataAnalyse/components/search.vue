<template>
  <div class="search-panel w-full flex justify-between h-18 px-8 py-5">
    <div class="flex w-1/5">
      <div class="h-12 leading-loose mr-2">区域</div>
      <el-select class="w-4/5" v-model="searchForm.areaId" clearable placeholder="请选择">
        <el-option v-for="item in state.zoneOption" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>
    <div class="flex w-1/4">
      <div class="h-12 leading-loose w-1/5">告警时间</div>

      <el-select v-model="state.timeType" class="w-1/5 mr-0" placeholder="Select">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker class="w-3/5" v-model="searchForm.time"
        :type="state.timeType === 'week' ? 'daterange' : 'monthrange'" unlink-panels
        :value-format="state.timeType === 'week' ? 'YYYY-MM-DD' : 'YYYY-MM'" size="default" />
    </div>
    <div class="flex w-1/5">
      <div class="h-12 leading-loose mr-2">告警类型</div>
      <el-select class="w-4/5" v-model="searchForm.categoryCode" clearable placeholder="请选择">
        <el-option v-for="item in state.categoryOption" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
    </div>
    <div class="flex w-1/5">
      <div class="h-12 leading-loose mr-2">告警等级</div>
      <el-select class="w-4/5" v-model="searchForm.levelId" clearable placeholder="请选择">
        <el-option v-for="item in state.levelOption" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>
    <div class="flex w-1/9 justify-end">
      <el-button type="primary" :icon="Search" @click="search()">搜索</el-button>
      <el-button type="primary" plain :icon="RefreshLeft" @click="reset()">重置</el-button>
    </div>
  </div>
</template>
    
<script setup lang="ts">
import { onMounted, watch } from "vue";
import { Search, RefreshLeft } from "@element-plus/icons-vue";
import {
  apiGetListWarnLevel,
  apiGetZoneList
} from "@/api/interface/dataAnalyse/dataAnalyse";
import { categoryList } from "@/api/interface/device";
import { reactive } from "vue";
import dayjs from "dayjs";

const emits = defineEmits(['search'])

type OptionItem = {
  name: string
  id: string
}
const state = reactive({
  zoneOption: [] as OptionItem[],
  levelOption: [] as OptionItem[],
  categoryOption: [] as OptionItem[],
  timeType: 'week'
})
const startTime = dayjs().subtract(7, 'day').format('YYYY-MM-DD'), endTime = dayjs().format('YYYY-MM-DD')
const searchForm = reactive({
  areaId: null,
  levelId: null,
  time: [startTime, endTime] as string[],
  categoryCode: null,
})
const options = [
  {
    value: "week",
    label: "日"
  },
  {
    value: "month",
    label: "月"
  }
];

watch(() => state.timeType, (val) => {
  if (val === "week") {
    const end = dayjs().format('YYYY-MM-DD');
    const start = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
    searchForm.time = [start, end];
  } else {
    const end = dayjs().format('YYYY-MM');
    const start = dayjs().subtract(6, 'month').format('YYYY-MM');
    searchForm.time = [start, end];
  }
});
// 搜索
function search() {
  const params = {
    startTime: searchForm.time[0],
    endTime: searchForm.time[1],
    areaId: searchForm.areaId,
    levelId: searchForm.levelId,
    categoryCode: searchForm.categoryCode
  }
  emits('search', params)


}
// 重置
function reset() {
  searchForm.areaId = null
  searchForm.levelId = null
  searchForm.categoryCode = null
  state.timeType = 'week'

  const params = {
    startTime: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    endTime: dayjs().format('YYYY-MM-DD'),
  }
  searchForm.time = [params.startTime, params.endTime];
  emits('search', params)

}
// 告警等级
function getListWarnLevel() {
  apiGetListWarnLevel().then(res => {
    state.levelOption = res.data;
  });
}

// 获取设备类型列表
function getTypeList() {
  categoryList({ grade: 2, pageIndex: 1, pageSize: 100000 }).then(res => {
    state.categoryOption = res.data;
  });
}

// 获取区域列表
function getZoneList() {
  apiGetZoneList().then(res => {
    state.zoneOption = res.data.list;
  });
}
onMounted(() => {
  getListWarnLevel();
  getTypeList();
  getZoneList();
  search()
});
</script>
    
    
<style scoped lang="scss">
.search-panel {
  background: #0b2363;
  border-radius: 0px 0px 0px 0px;
  opacity: 1;
  color: white;

  .leading-loose {
    font-size: 16px;
  }
}

::v-deep .el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
  width: 80% !important;
}
</style>
    