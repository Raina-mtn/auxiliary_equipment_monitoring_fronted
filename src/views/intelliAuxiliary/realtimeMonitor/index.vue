<template>
  <div class="monitors">
    <div class="monitors__cameras cameras">
      <div class="cameras__window">
        <HkNoPlugin :camera-list="state.treeList" ref="cameraIfameRef" :iWndowType="state.iWndowType" />
      </div>
      <Pagination :pageIndex="1" :pageSize="1" :total="state.treeList.length"
        :handleSizePageChange="handleSizePageChange" />
    </div>
    <div class="monitors__tabs tabs">
      <SideBar />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
import HkNoPlugin from '@/components/HkCamera/NoPlugin/index.vue'
import Pagination from './components/Pagination.vue'

import SideBar from './components/SideBar.vue'

import { apiGetEquipmentTree } from '@/api/interface/intelliAuxiliary/equipment'
import { treeToList } from '@/utils/treeHelper'
import type { Camera } from '@/api/interface/types';
import { monitorStore } from '@/store/modules/monitor';

const useMonitorStore = monitorStore()

const state = reactive({
  treeList: [] as Camera[],
  iWndowType: 1,
})


getEquipmentTree()
function getEquipmentTree() {
  apiGetEquipmentTree({ categoryList: ['CAMERA'] }).then(res => { // 查所有相机的设备列表
    state.treeList = treeToList(res.data, { pid: 'parentId' }).filter((v: any) => v.type === 'CAMERA').map((v: any) => {
      const registerInfo = v.registerInfo || {}
      return {
        id: v.id,
        equipmentName: v.label,
        equipmentCode: v.equipmentCode,
        ip: registerInfo.ipAddress,
        port: registerInfo.port,
        username: registerInfo.account,
        password: registerInfo.secretKey,
        channel: registerInfo.channelNumber
      }
    })
  })
  console.log(state.treeList);

}

// 视频分页和窗格数改变
function handleSizePageChange(obj: { pageIndex: number, pageSize: number }) {
  useMonitorStore.postMessage({
    connectType: 'changePage',
    params: {
      pageIndex: obj.pageIndex,
      pageSize: obj.pageSize
    }
  })
}




</script>
<style lang="scss" scoped>
.monitors {
  height: 100%;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto 522px;
  grid-column-gap: 16px;
  grid-template-rows: calc(100% - 10px);

  &__cameras,
  &__tabs {
    width: 100%;
    height: 100%;
    background-color: #0b2363;
  }

  .cameras {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;

    &__window {
      width: 100%;
      background-color: #000;
      flex: 1;
    }

    &__pagination {
      width: 100%;
      padding: (16px) (16px);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 80px;

      .size {
        $size: (
          48px
        );
      display: flex;

      &__item {
        width: $size;
        height: $size;
        margin-left: (20px);
        border: 1px dotted #fff;
        background-color: #1b3d9f;

        &--disabled {
          background-color: #61595988 !important;
        }
      }

      &__item4 {
        background: repeating-linear-gradient(90deg,
            #aec8ee 0,
            #1765e3 1px,
            transparent 1px,
            transparent calc($size / 2)),
          repeating-linear-gradient(#aec8ee 0,
            #1765e3 1px,
            transparent 1px,
            transparent calc($size / 2)),
          #1b3d9f;
      }

      &__item9 {
        background: repeating-linear-gradient(90deg,
            #aec8ee 0,
            #1765e3 1px,
            transparent 1px,
            transparent calc($size / 3)),
          repeating-linear-gradient(#aec8ee 0,
            #1765e3 1px,
            transparent 1px,
            transparent calc($size / 3)),
          #1b3d9f;
      }

      &__item16 {
        background: repeating-linear-gradient(90deg,
            #aec8ee 0,
            #1765e3 1px,
            transparent 1px,
            transparent calc($size / 4)),
          repeating-linear-gradient(#aec8ee 0,
            #1765e3 1px,
            transparent 1px,
            transparent calc($size / 4)),
          #1b3d9f;
      }
    }
  }
}
}
</style>
