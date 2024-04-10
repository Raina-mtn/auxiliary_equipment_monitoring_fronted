<template>
  <div class="time text-light-50 p-16px">
    <left-panel title="对时管理" />
    <div class="time-content p-24px">
      <div class="time-content__header flex items-center">
        <div class="header-line"></div>
        <div class="header-name">时间清单</div>
      </div>
      <div class="time-content__types">
        <div class="types-item">
          <span class="tracking-4.5px">平台时间：</span>
          <span>20231-04-01 12:21:01</span>
        </div>
        <div class="types-item">
          <span>服务器时间 ：</span>
          <span> 20231-04-01 12:21:01</span>
        </div>
        <div class="types-item">
          <span class="tracking-4.5px">网络时间：</span>
          <span>20231-04-01 12:21:01</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftPanel from '../../components/LeftPanel.vue'

</script>
<style scoped lang="scss">
  .time {
    display: flex;
    width: 100%;
    height: 100%;
    padding-top: 32px;

    &-content {
      flex: 1;
      height: 100%;
      background: #0B2363;
      margin-left: 16px;

      &__header {
        .header-line {
          width: 4px;
          height: 20px;
          background: #0AF0FD;
          border-radius: 8px 8px 8px 8px;
          opacity: 1;
        }

        .header-name {
          font-size: 16px;
          color: #FFFFFF;
          margin-left: 10px;
        }
      }

      &__types {
        padding-left: 4px;
        margin-top: 20px;

        .types-item {
          margin-bottom: 16px;
          font-size: 14px;
        }
      }
    }
  }
</style>
