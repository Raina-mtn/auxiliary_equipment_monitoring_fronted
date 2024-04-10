<template>
  <div class="alarm text-light-50 p-16px">
    <left-panel title="告警管理" />
    <div class="alarm-content">
      <Title title="主设备" class="mb-20px" />
      <el-row :gutter="16">
        <el-col v-for="(item) in hostList" :key="item.icon" :span="4">
          <div class="alarm-content__block" @click="toPage(item.prop)">
            <div class="block-icon">
              <i class="iconfont" :class="item.icon"></i>
            </div>
            <span class="block-name">{{ item.name }}</span>
          </div>
        </el-col>
      </el-row>
      <Title title="辅控设备" class="mb-20px mt-8px" />
      <el-row :gutter="16">
        <el-col v-for="(item) in controlList" :key="item.icon" :span="4">
          <div class="alarm-content__block" @click="toPage(item.prop)">
            <div class="block-icon">
              <i class="iconfont" :class="item.icon"></i>
            </div>
            <span class="block-name">{{ item.name }}</span>
          </div>
        </el-col>
        <el-col v-for="(item) in controlList2" :key="item.icon" :span="4">
          <div class="alarm-content__block" @click="toPage(item.prop)">
            <div class="block-icon">
              <img :src="item.src" alt="">
            </div>
            <span class="block-name">{{ item.name }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftPanel from '../../components/LeftPanel.vue'
import Title from '../../components/Title.vue'
import { hostList, controlList } from './config'
import { useRouter } from 'vue-router'
import { getAssetsImge } from '@/utils';

const router = useRouter()
const controlList2 = [
  {
    name: '微气象',
    src: getAssetsImge('weiqixiang.png'),
    prop: 'MICROMETEOROGRAPH'
  },
  {
    name: '温湿度',
    src: getAssetsImge('wenshidu.png'),
    prop: 'TEMPERATURE_HUMIDITY_SENSOR'
  }
]
function toPage(type: string) {
  console.log('type :>> ', type);
  router.push({ path: 'alarm-detail', query: { type: type } })
}


</script>
<style scoped lang="scss">
.alarm {
  display: flex;
  width: 100%;
  height: 100%;
  padding-top: 32px;

  &-content {
    flex: 1;
    height: 100%;
    background: #0B2363;
    margin-left: 16px;
    padding: 24px;

    &__block {
      display: flex;
      align-items: center;
      padding-left: 40px;
      width: 100%;
      height: 96px;
      background: rgba(27, 61, 159, 0.7);
      cursor: pointer;
      margin-bottom: 16px;

      .block-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        background: url('../../../../assets/images/system/alarm_bg.png') no-repeat;
        background-size: 56px 56px;
        margin-right: 20px;

        .iconfont {
          font-size: 22px;
          color: rgba(10, 240, 253, .8);
        }
      }

      .block-name {
        font-size: 14px;
      }
    }
  }
}
</style>
