<!-- 静态页面 -->
<template>
  <div v-show="dialogShow" class="check-dialog w-1/4">
    <h1 class="check-dialog__header flex items-center justify-between">
      <div>
        <i class="title-rect" />
        <i class="iconfont icon-jiantou" />审核
      </div>
      <i class="iconfont icon-guanbi" @click="dialogShow = false" />
    </h1>
    <section class="px-6">
      <p class="check-dialog__title">
        告警信息
      </p>
      <div class="warn-item">
        <p class="title">
          <label><span>{{ state.data.categoryName }}</span>
            <span class="title-status title-status__danger">{{ state.data.warnLevelName }}</span></label>
        </p>
        <el-descriptions :column="2">
          <el-descriptions-item v-for="(item, index) in alarmConfig" v-bind="item" :key="index">
            <span class="ellipsis-text">{{ state.data[item.key] || '' }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </section>
    <section class="warn-list mt-4 px-6">
      <p class="check-dialog__title">
        审核信息
      </p>
      <el-form label-width="80px" ref="formRef" :model="form">
        <el-form-item label="告警等级" prop="checkWarnLevelId">
          <el-select v-model="form.checkWarnLevelId" class="w-full">
            <el-option v-for="item in warnLevel" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="checkOpinion">
          <el-input v-model="form.checkOpinion" type="textarea" rows="2" key="checkOpinion" />
        </el-form-item>
        <el-form-item label="审核人" prop="userId">
          <el-select v-model="form.userId" class="w-full">
            <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="text-right w-full">
            <el-button @click="dialogShow = false" class="btn-cancel">取消</el-button>
            <el-button class="btn-submit" @click="save">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>
<script setup lang="ts">
import { alarmConfig } from '../config/index'
import { reactive, ref } from "vue";
import { apiGetUserList } from '@/api/interface';
import { apiCheckTask } from '@/api/interface/taskCenter';
import { ElMessage } from 'element-plus';
import { apiGetListWarnLevel } from '@/api/interface/dataAnalyse/dataAnalyse';
interface checkForm {
  checkWarnLevelId?: string
  checkOpinion?: string
  userId?: string
}
interface Data {
  id: string | number,
  areaName: string,
  warnLevelId: string | number,
  pointName: string,
  checkStatus: string | number,
  warnTime: string,
  warnLevelName: string,
  categoryName?: string
}
const emit = defineEmits(['polling'])
const formRef = ref();
const dialogShow = ref(false)
const warnLevel = ref()
const form = reactive<checkForm>({})
const userOptions = ref()
const data: Data = {
  id: '',
  areaName: '',
  warnLevelId: '',
  pointName: '',
  checkStatus: '',
  warnTime: '',
  warnLevelName: ''
}
const state = reactive({
  useList: [],
  data
})
//告警等级
const getWarnLevel = async () => {
  const res = await apiGetListWarnLevel();
  warnLevel.value = res.data;
}
const open = (value: any) => {
  getUserList()
  getWarnLevel()
  dialogShow.value = true;
  state.data = value
}

//审核人调用接口获取
const getUserList = async () => {
  const data = {
    page: {
      pageIndex: 1,
      pageSize: 100
    }
  };
  const res = await apiGetUserList(data);
  state.useList = res.data.list;
  userOptions.value = state.useList.map((item: any) => ({
    label: item.username,
    value: item.id
  }))
}
const save = () => {
  const data = { ...form, id: state.data.id }
  apiCheckTask(data).then(() => {
    ElMessage.success('保存成功');
    dialogShow.value = false;
    emit('polling', { id: state.data.id })
  })
}
defineExpose({
  open
})
</script>
<style lang="scss" scoped>
.ellipsis-text {
  position: relative;
  bottom: -8.5px;
  display: inline-block;
  width: 135px;
  height: 25px;
  line-height: 22px;
  white-space: nowrap;
  /* 防止文本换行 */
  overflow: hidden;
  /* 隐藏溢出内容 */
  text-overflow: ellipsis;
  /* 添加省略号 */
}

$white-light-color: #e2edff;

.white-light-text {
  color: $white-light-color;
}

.check-dialog {
  z-index: 200;
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translateX(100%);
  background: linear-gradient(180deg,
      rgba(60, 110, 175, 0.86) 0%,
      rgba(13, 47, 88, 0.95) 100%);
  width: 510px;

  &__header {

    color: #fff;
    height: 32px;
    line-height: 32px;
    position: relative;
    font-size: 22px;

    &::after {
      position: absolute;
      content: "";
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg,
          rgba(117, 247, 253, 0.57) 0%,
          rgba(41, 148, 252, 0) 100%);
    }

    .title-rect {
      display: inline-block;
      width: 2px;
      height: 16px;
      background: linear-gradient(90deg, #11b9fd 0%, #0783fa 100%);
    }

    .icon-jiantou {
      color: #ffdead;
      margin: 0 1rem;
    }

    .icon-guanbi {
      background-image: -webkit-linear-gradient(bottom, #ebf2fc, #48a0fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      cursor: pointer;
      margin-right: 1rem;
    }
  }

  &__title {
    color: #fff;
    padding-left: 12px;
    position: relative;
    margin: 6px 0;

    &:after {
      position: absolute;
      content: '';
      width: 2px;
      height: 14px;
      background: #55FAFF;
      left: 0;
      top: 5px;
    }
  }

  .warn-item {
    margin-bottom: 0.2rem;
    padding: 0.8rem 1rem;
    background: #173A66;

    :deep(.el-descriptions__body) {
      background: none;

      .el-descriptions__cell {
        padding-bottom: 0 !important;
      }
    }

    p {
      &.title {
        color: #fff;
        justify-content: space-between;
        display: flex;

        .title-status {
          border-radius: 4px 4px 4px 4px;
          opacity: 1;
          margin-left: 5px;
          font-size: 0.8rem;
          padding: 2px 4px;

          &__danger {
            background: #280F0C;
            border: 1px solid #FF5C43;
            color: #FF5C43;
          }
        }
      }
    }
  }

  .btn-cancel {
    background: linear-gradient(180deg, rgba(19, 47, 95, 0.7) 0%, rgba(80, 140, 245, 0.7) 100%);
    border: 1px solid #148FF5;
  }

  .btn-submit {
    background: linear-gradient(180deg, rgba(54, 127, 251, 0.7) 0%, #508CF5 100%);

    border: 1px solid #148FF5;
  }

  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
