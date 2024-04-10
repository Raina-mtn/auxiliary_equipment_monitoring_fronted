<template>
  <div class="system p-16px">
    <div class="system-list">
      <div v-for="(item, index) in systemList" :key="index" class="system-list__item">
        <div class="item-header">
          {{ item.title }}
        </div>
        <div class="item-childrens flex">
          <div v-for="(its, idx) in item.children" :key="idx + index"
            class="item-childrens__setting flex flex-col items-center" @click="toPage(its.path)">
            <div class="setting-img">
              <img :src="getAssetsImge(its.imgUrl)" alt="">
            </div>
            <div class="setting-name">
              {{ its.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getAssetsImge } from '../../utils/index'

const router = useRouter()

const systemList = [
  {
    title: '基础设置',
    children: [
      {
        imgUrl: 'system/site.png',
        name: '站点管理',
        path: 'site'
      },
      {
        imgUrl: 'system/area.png',
        name: '区域管理',
        path: 'area'
      },
      {
        imgUrl: 'system/point.png',
        name: '点位管理',
        path: 'point'
      },
      {
        imgUrl: 'system/time.png',
        name: '对时管理',
        path: 'time'
      },
      {
        imgUrl: 'system/alarm.png',
        name: '告警设置',
        path: 'alarm-setting'
      },
      {
        imgUrl: 'system/alarm.png',
        name: '其他设置',
        path: 'other-setting'
      }
    ]
  },
  {
    title: '告警设置',
    children: [
      {
        imgUrl: 'system/alarm.png',
        name: '告警管理',
        path: 'alarm'
      }
    ]
  },
  {
    title: '联动设置',
    children: [
      {
        imgUrl: 'system/linkage.png',
        name: '联动管理',
        path: 'linkage'
      }
    ]
  },
  {
    title: '数据导出',
    children: [
      {
        imgUrl: 'system/linkage.png',
        name: '数据导出',
        path: 'export'
      }
    ]
  }
]

function toPage(path: string) {
  router.push(path)
}

</script>
<style scoped lang="scss">
.system {
  width: 100%;
  height: 100%;
  margin-top: 12px;

  &-list {
    &__item {
      margin-bottom: 24px;
      color: #FFFFFF;

      .item-header {
        width: 100%;
        height: 35px;
        background: url('../../assets/images/system/system_bg.png') no-repeat;
        background-size: 100% 35px;
        line-height: 35px;
        padding-left: 48px;
        font-size: 18px;
      }

      .item-childrens {
        padding: 30px;
        background: #0B2363;
        border-radius: 0px 0px 0px 0px;

        &__setting {
          margin-right: 100px;
          cursor: pointer;

          .setting-img {
            width: 56px;
            height: 56px;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .setting-name {
            font-size: 14px;
            margin-top: 8px;
          }
        }
      }
    }
  }
}
</style>

