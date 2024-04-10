<template>
  <el-dialog v-model="state.dialogVisible" :title="`${state.isEdit ? '编辑' : '添加'}`" top="30px" width="1200"
    @close="close">
    <Title title="联动场景" />
    <div class="start-title">
      <div class="mb-4"> 在时间段
        <el-time-select v-model="triggerStartTime" format="HH:mm:ss" :max-time="triggerEndTime" class="mr-2" start="01:00"
          :clearable="false" step="00:15" end="23:45" />~<el-time-select v-model="triggerEndTime" format="HH:mm:ss"
          :min-time="triggerStartTime" class="ml-2" start="01:00" step="00:15" end="23:45" />
      </div>
      <div class="mb-4" v-for="linkageItem, linkIndex in linkage" :key="linkIndex">
        当 <el-select v-model="linkageItem.a" class="m-2" @change="linkChange(linkageItem.a, linkIndex)">
          <el-option v-for="item in linkageOptions[linkIndex].a" :key="item.id" :label="item.name"
            :value="`${item.id}`" />
        </el-select>
        区域 <el-select v-model="linkageItem.b" class="m-2" @change="pointChange(linkageItem.b, linkIndex)">
          <el-option v-for="item in linkageOptions[linkIndex].b" :key="item.id" :label="item.name"
            :value="`${item.id}`" />
        </el-select>
        点位 <el-select v-model="linkageItem.c" class="m-2" @change="deviceChange(linkageItem.c, linkIndex)">
          <el-option v-for="item in linkageOptions[linkIndex].c" :key="item.id" :label="`${item.title}(${item.code})`"
            :value="`${item.id}`" />
        </el-select>
        <template v-if="judgeCode(linkageItem.c, linkageOptions[linkIndex].c) === 'ENTRANCE_GUARD'">
          <sapn class="inline-block w-15 text-right">状态为</sapn> <el-select v-model="linkageItem.d" class="m-2">
            <el-option v-for="item in linkageOptions[linkIndex].d" :key="item.id" :label="item.warnIncidentName"
              :value="`${item.id}`" />
          </el-select>时
        </template>
        <template v-else>
          <sapn class="inline-block w-15 text-right">告警等级为</sapn> <el-select v-model="linkageItem.d" class="m-2">
            <el-option v-for="item in linkageOptions[linkIndex].d" :key="item.id" :label="item.warnIncidentName"
              :value="`${item.id}`" />
          </el-select>时
        </template>
        <el-button type="danger" :icon="CirclePlus" circle v-if="linkIndex === 0" @click="addLinkage" />
        <el-button type="danger" :icon="Delete" circle v-else="linkIndex === 0" @click="delLinkage(linkIndex)" />

      </div>
    </div>
    <Title title="联动节点" />
    <div class="start-title">
      <div class="mb-4" v-for="lockItem, lockIndex in interlock" :key="lockIndex">
        <el-select v-model="lockItem.d" class="m-2">
          <el-option v-for="item in  lockageOptions[lockIndex].d" :key="item.value" :label="item.label"
            :value="item.value" />
        </el-select>
        <el-select v-model="lockItem.a" class="m-2" @change="lockChange(lockItem.a, lockIndex)">
          <el-option v-for="item in lockageOptions[lockIndex].a" :key="item.id" :label="item.name"
            :value="`${item.id}`" />
        </el-select>
        区域 <el-select v-model="lockItem.b" class="m-2" @change="lockPointChange(lockItem.b, lockIndex)">
          <el-option v-for="item in lockageOptions[lockIndex].b" :key="item.b" :label="item.name" :value="`${item.id}`" />
        </el-select>
        点位的 <el-select v-model="lockItem.c" class="m-2" @change="lockCameraChange(lockItem.c, lockIndex)">
          <el-option v-for="item in lockageOptions[lockIndex].c" :key="item.id" :label="`${item.title}(${item.code})`"
            :value="`${item.id}`" />
        </el-select>
        <template v-if="judgeCode(lockItem.c, lockageOptions[lockIndex].c) === 'CAMERA'">
          的
          <el-select v-model="lockItem.e" class="m-2">
            <el-option v-for="item in lockageOptions[lockIndex].e" :key="item.id" :label="`${item.presetName} `"
              :value="item.id" />
          </el-select> 预置位
        </template>
        <el-select v-model="lockItem.f" class="m-2">
          <el-option v-for="(item, index) in lockageOptions[lockIndex].f" :key="index" :label="`${item.label}`"
            :value="item.value" />
        </el-select>人工确认
        <el-button type="danger" :icon="CirclePlus" circle v-if="lockIndex === 0" @click="addLockage" />
        <el-button type="danger" :icon="Delete" circle v-else="linkIndex === 0" @click="delLockage(lockIndex)" />
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="validateForm">
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
      
<script setup lang='ts'>
import { reactive, ref, watch } from 'vue'
import Title from './Title.vue'
import { apiGetArea } from '@/api/interface/patrolResult/lockControl'
import { areaPoint } from '@/api/interface/system/area'
import { deviceList } from '@/api/interface/device'
import { listWarnIncident, linkAdd, linkPut, linkDetail } from '@/api/interface/system/linkage'
import { apiGetPresetList } from '@/api/interface/intelliAuxiliary/equipment'
import { ElMessage } from "element-plus";
import type { Camera } from '@/api/interface/types';
import { recheckPass } from '@/components/RecheckPass/index'
import {
  Delete,
  CirclePlus
} from '@element-plus/icons-vue'
import { isBoolean, cloneDeep } from 'lodash-es'
const state = reactive({
  dialogVisible: false,
  isEdit: false,
  linkId: 0
})
const triggerStartTime = ref('') //触发开始时间
const triggerEndTime = ref('') //触发结束时间
const emits = defineEmits(['success'])

// 联动场景数据
let linkage = ref([
  {
    a: '',
    b: '',
    c: '',
    d: ''
  }
])
let linkageOptions = ref([
  {
    a: [],
    b: [],
    c: [],
    d: []
  },
])

// 联动节点数据
let interlock = ref([
  {
    a: '',
    b: '',
    c: '',
    d: '',
    e: '', // 相机的预置位
    f: '' // 需要人工确认
  }
])
let lockageOptions = ref([
  {
    a: [],
    b: [],
    c: [],
    d: [
      {
        label: '开启',
        value: 'OPEN'
      },
      {
        label: '关闭',
        value: 'CLOSED'
      },
    ],
    e: [], // 预置位
    f: [
      {
        label: '需要',
        value: true
      },
      {
        label: '不需要',
        value: false
      },
    ] // 人工确认
  },
])

watch(() =>
  state.linkId,
  (val) => {
    // console.log(val);
    // console.log(state.isEdit);
    // debugger
    if (state.isEdit) {
      onGetDetailData(val)
    }
  }
)

const getLinkages = async () => {
  await init()
}

getLinkages()

async function open(isEdit: boolean, id: number) {

  state.dialogVisible = true
  state.isEdit = isEdit
  state.linkId = id
  // console.log( state.linkId);
  // debugger

}

// 初始化数据
async function init() {
  const res = await apiGetArea()
  //初始化数据
  linkageOptions.value[0].a = res.data.list
  lockageOptions.value[0].a = res.data.list
}

function judgeCode(id: string, options: any[]) {
  if (id && options) {
    const obj = options.find(v => v.id === Number(id))
    return obj?.categoryCode || ''
  }
  return ''
}

// 获取详情数据
async function onGetDetailData(id: number) {
  const res = await linkDetail(id)
  if (res.data) {
    triggerStartTime.value = res.data.triggerStartTime
    triggerEndTime.value = res.data.triggerEndTime
    res.data.linkageScenarioVOs.forEach(async (item: any, index: number) => {
      if (!linkage.value[index]) linkage.value[index] = { a: '', b: '', c: '', d: '' }
      if (!linkageOptions.value[index]) {
        linkageOptions.value[index] = { a: linkageOptions.value[0].a, b: [], c: [], d: [] }
      }

      linkage.value[index].a = String(item.areaId)
      await linkChange(item.areaId, index)
      linkage.value[index].b = String(item.lineId)
      await pointChange(item.lineId, index)
      linkage.value[index].c = String(item.equipmentId)
      await deviceChange(item.equipmentId, index)
      linkage.value[index].d = String(item.warnIncidentId)
    })
    res.data.linkageNodeVOs.forEach(async (item: any, index: number) => {
      if (!interlock.value[index]) {
        interlock.value[index] = { a: '', b: '', c: '', d: '', e: '', f: null }
      }
      if (!lockageOptions.value[index]) {
        lockageOptions.value[index] = { a: lockageOptions.value[0].a, b: [], c: [], d: lockageOptions.value[0].d, e: [], f: lockageOptions.value[0].f }
      }
      interlock.value[index].a = String(item.areaId)
      await lockChange(item.areaId, index)
      interlock.value[index].b = String(item.lineId)
      await lockPointChange(item.lineId, index)
      interlock.value[index].c = String(item.equipmentId)
      await lockCameraChange(item.equipmentId, index)
      interlock.value[index].d = String(item.linkageInstruction)
      interlock.value[index].e = item.linkagePresetId
      interlock.value[index].f = item.isPopup
    })

  }
}
// 获取点位
async function getPoint(id: number | string) {
  const params = {
    rootAreaId: id
  }
  const res = await areaPoint(params)
  return res.data.list
}
// 获取设备
async function getDevice(id: number | string) {
  const rootParams = {
    deployAreaIdList: [
      id
    ],
    page: {
      pageIndex: 1,
      pageSize: 999
    }
  }
  const res = await deviceList(rootParams)
  return res.data.list

}
//获取告警等级
async function getGrade(id: number | string) {
  const warnParams = {
    equipmentId: id
  }
  const res = await listWarnIncident(warnParams)
  return res.data
}

async function validateForm() {
  if (!triggerStartTime.value || !triggerEndTime.value) return ElMessage.error('请选择时间段')
  for (let i = 0; i < linkage.value.length; i++) {
    if (!linkage.value[i].a) return ElMessage.error(`请选择联动场景第${i + 1}条场景`)
    if (!linkage.value[i].b) return ElMessage.error(`请选择联动场景第${i + 1}条区域`)
    if (!linkage.value[i].c) return ElMessage.error(`请选择联动场景第${i + 1}条点位`)
    if (!linkage.value[i].d) {
      let msg = '告警等级'
      if (judgeCode(linkage.value[i].c, linkageOptions.value[i].c) === 'ENTRANCE_GUARD') {
        msg = '状态'
      }
      return ElMessage.error(`请选择联动场景第${i + 1}条${msg}`)
    }
  }
  for (let i = 0; i < interlock.value.length; i++) {
    if (!interlock.value[i].d) return ElMessage.error(`请选择联动场景第${i + 1}条开启关闭状态`)
    if (!interlock.value[i].a) return ElMessage.error(`请选择联动场景第${i + 1}条区域`)
    if (!interlock.value[i].b) return ElMessage.error(`请选择联动场景第${i + 1}条点位`)
    if (!interlock.value[i].c) return ElMessage.error(`请选择联动场景第${i + 1}条设备`)
    if (judgeCode(interlock.value[i].c, lockageOptions.value[i]['c']) === 'CAMERA') {
      if (!interlock.value[i].e) {
        return ElMessage.error(`请选择联动场景第${i + 1}条设备预置位`)
      }
    }
    console.log(!isBoolean(interlock.value[i].f));

    if (!isBoolean(interlock.value[i].f)) return ElMessage.error(`请选择联动场景第${i + 1}条是否需要人工确认`)
  }
  await recheckPass()
  save()
}



//保存
async function save() {
  let linkageScenarioList = linkage.value.map((item, index) => {
    return {
      warnIncidentId: item.d,
      equipmentId: getCurrentById(item['c'], linkageOptions.value[index]['c'])?.id,
      equipmentCode: getCurrentById(item['c'], linkageOptions.value[index]['c'])?.code
    }
  })
  let linkageNodeList = interlock.value.map((item, index) => {
    return {
      linkageInstruction: item.d,
      equipmentId: getCurrentById(item['c'], lockageOptions.value[index]['c'])?.id,
      equipmentCode: getCurrentById(item['c'], lockageOptions.value[index]['c'])?.code,
      isPopup: item.f,
      linkagePresetId: getCurrentById(item['c'], lockageOptions.value[index]['c'])?.categoryCode === 'CAMERA' ? item.e : undefined
    }
  })
  const params = {
    linkageScenarioList,
    linkageNodeList,
    triggerStartTime: triggerStartTime.value,
    triggerEndTime: triggerEndTime.value
  }
  state.isEdit ? await linkPut(state.linkId, params) : await linkAdd(params)
  const info = state.isEdit ? '修改成功' : '添加成功'
  ElMessage.success(info)
  state.dialogVisible = false
  emits('success')
}
//查找设备根据id
function getCurrentById(id: number | undefined, options: any[]) {
  let current = options.find((item: { id: number | undefined }) => {
    return item?.id == id
  })
  return current
}
//区域点击
async function linkChange(val: any, index: any) {
  if (!linkageOptions.value[index]) {
    linkageOptions.value[index] = { a: linkageOptions.value[0].a, b: [], c: [], d: [] }
  }
  linkage.value[index].b = ''
  linkage.value[index].c = ''
  linkage.value[index].d = ''

  linkageOptions.value[index].b = await getPoint(val)
  pointChange(linkage.value[index].b, index)
}
//点位点击
async function pointChange(val: any, index: any) {
  linkage.value[index].c = ''
  linkage.value[index].d = ''
  linkageOptions.value[index].c = await getDevice(val)
  deviceChange(linkage.value[index].c, index)
}

//设备点击
async function deviceChange(val: any, index: any) {
  linkage.value[index].d = ''
  linkageOptions.value[index].d = await getGrade(val)
}
//联动节点区域点击
async function lockChange(val: any, index: any) {
  if (!lockageOptions.value[index]) {
    lockageOptions.value[index] = { a: lockageOptions.value[0].a, b: [], c: [], d: lockageOptions.value[0].d, e: [], f: lockageOptions.value[0].f }
  }
  interlock.value[index].c = ''
  interlock.value[index].e = ''
  lockageOptions.value[index].b = await getPoint(val)
}
// 联动节点点位点击
async function lockPointChange(val: any, index: any) {
  interlock.value[index].e = ''
  interlock.value[index].c = ''
  lockageOptions.value[index].c = await getDevice(val)
}
// 获取相机类型的预置位点
async function lockCameraChange(val: any, index: number) {
  const camera = lockageOptions.value[index].c.find(v => Number(v.id) === Number(val)) as unknown as Camera
  const res = await apiGetPresetList({
    equipmentId: camera.id,
  })
  lockageOptions.value[index].e = res.data

}

//添加联动场景数据
function addLinkage() {
  let options = ref({
    a: [],
    b: [],
    c: [],
    d: []
  })
  let deeplinkageOptions = cloneDeep(linkageOptions.value[0].a)
  options.value.a = deeplinkageOptions
  linkageOptions.value.push(options.value)
  let obj = ref({
    a: '',
    b: '',
    c: '',
    d: ''
  })
  linkage.value.push(obj.value)
}
//删除联动场景数据
function delLinkage(index: number) {
  linkageOptions.value.splice(index, 1)
  linkage.value.splice(index, 1)
}
//删除联动节点数据
function delLockage(index: number) {
  lockageOptions.value.splice(index, 1)
  interlock.value.splice(index, 1)
}
//联动节点
function addLockage() {
  let options = ref({
    a: [],
    b: [],
    c: [],
    d: [
      {
        label: '开启',
        value: 'OPEN'
      },
      {
        label: '关闭',
        value: 'CLOSED'
      },
    ],
    e: [],
    f: [
      {
        label: '需要',
        value: true
      },
      {
        label: '不需要',
        value: false
      },
    ]
  })
  let deeplinkageOptions = cloneDeep(lockageOptions.value[0].a)
  options.value.a = deeplinkageOptions
  lockageOptions.value.push(options.value)
  let obj = ref({
    a: '',
    b: '',
    c: '',
    d: '',
    e: '',
    f: null
  })
  interlock.value.push(obj.value)
}

function close() {
  linkage.value = [
    {
      a: '',
      b: '',
      c: '',
      d: ''
    }
  ]
  interlock.value = [
    {
      a: '',
      b: '',
      c: '',
      d: '',
      e: '',
      f: null
    }
  ]
  triggerStartTime.value = ''
  triggerEndTime.value = ''
  state.dialogVisible = false
  state.isEdit = false
  state.linkId = 0
}
defineExpose({
  open
})
</script>
      
<style lang="scss" scoped>
.start-title {
  margin-top: 22px;
  font-size: 14px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 40px;

  .el-select {
    width: 150px !important;
    height: 32px !important;

    .el-input {
      height: 32px !important;
    }
  }
}
</style>
