<template>
  <el-dialog v-model="state.dialogVisible" title="审核" width="40%" @close="close">
    <div class="main-content">
      <div class="main-top">
        <el-descriptions column="2">
          <template #title>
            <h4><i class="tri-arrow" />告警信息</h4>
          </template>
          <el-descriptions-item label="烟雾预警:">
            {{ state.data.areaName }}
          </el-descriptions-item>
          <el-descriptions-item label="预警等级:">
            {{ state.data.warnLevelId }}
          </el-descriptions-item>
          <el-descriptions-item label="区域名称:">{{ state.data.areaName }}</el-descriptions-item>
          <el-descriptions-item label="点位名称:">{{ state.data.pointName }}</el-descriptions-item>
          <el-descriptions-item label="审核状态:">
            <span :style="{ color: state.data.checkStatus === '1' ? '#69EF00' : '#FF0000' }">
              {{ state.data.checkStatus === '1' ? '已审核' : '待审核' }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="告警时间:">{{ state.data.warnTime }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="main-bottom">
        <el-descriptions>
          <template #title>
            <h4><i class="tri-arrow" />审核信息</h4>
          </template>
        </el-descriptions>
        <el-form label-width="90px" ref="ruleFormRef" :model="form" status-icon>
          <el-row>
            <el-col :span="12" :gutter="20">
              <el-form-item label="告警等级" prop="checkWarnLevelId">
                <el-select v-model="form.checkWarnLevelId" class="w-full" placeholder="请选择" clearable="true">
                  <el-option v-for="item in warnLevel" :key="item.value" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" :gutter="20">
              <el-form-item label="审核人" prop="userId">
                <el-select v-model="form.userId" class="w-full" placeholder="请输入" filterable="true" clearable="true">
                  <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="审核意见" prop="checkOpinion">
            <el-input v-model="form.checkOpinion" style="height: 100px;" maxlength="500" rows="6" key="checkOpinion"
              type="textarea" placeholder="请输入" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #footer>
      <el-button @click="close">关闭</el-button>
      <el-button type="primary" @click="save">
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { apiGetUserList } from '@/api/interface';
import { apiGetListWarnLevel } from '@/api/interface/dataAnalyse/dataAnalyse';
import { apiCheckTask } from '@/api/interface/taskCenter';
import { ElMessage, FormInstance } from 'element-plus';
import { nextTick } from 'vue';
import { onMounted, reactive, ref } from 'vue'

const emit = defineEmits(['getList'])
const isEdit = ref(false)
const ruleFormRef = ref<FormInstance>()
const userOptions = ref();
const warnLevel = ref();
interface Data {
  id: string | number,
  areaName: string,
  warnLevelId: string | number,
  pointName: string,
  checkStatus: string | number,
  warnTime: string
}
const form = ref({
  checkWarnLevelId: '',
  userId: '',
  checkOpinion: ''
})

const data: Data = {
  id: '',
  areaName: '',
  warnLevelId: '',
  pointName: '',
  checkStatus: '',
  warnTime: ''
}
const state = reactive({
  dialogVisible: false,
  userList: [],
  data
})
//告警等级
const getWarnLevel = async () => {
  const res = await apiGetListWarnLevel();
  warnLevel.value = res.data;
}
//审核人调用接口获取
const getRoleList = async () => {
  const data = {
    page: {
      pageIndex: 1,
      pageSize: 10
    }
  };
  const res = await apiGetUserList(data);
  state.userList = res.data.list;
  userOptions.value = state.userList.map((item: any) => ({
    label: item.username,
    value: item.id
  }))
}

onMounted(() => {
  getRoleList();
  getWarnLevel();
})

const open = (props: any) => {
  state.dialogVisible = true
  state.data = props
  nextTick(() => {
    ruleFormRef.value?.resetFields()
  })


}
const close = () => {
  state.dialogVisible = false
}
const save = () => {
  isEdit.value = false
  const data = { ...form.value, id: state.data.id }
  apiCheckTask(data).then(() => {
    ElMessage.success('保存成功');
    close();
    emit('getList')
  })
}
defineExpose({
  open
})
</script>

<style>
.main-content {

  h4 {
    font-size: 16px;
    color: #fff;
    padding-left: 16px;
    position: relative;

    i {
      width: 9px;
      height: 9px;
      background: #3CC9F5;
      clip-path: polygon(0 0%, 100% 0, 0 100%);
      position: absolute;
      top: 0;
      left: 0;
    }

  }

  .main-top {
    .el-descriptions__body {
      background: none;

      .el-descriptions__table {
        margin-left: 10px;

        .el-descriptions__label {
          color: rgba(255, 255, 255, 0.7);
        }
      }

    }


  }

  .main-bottom {
    .el-descriptions__body {
      background: none;

      .el-descriptions__label {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}
</style>