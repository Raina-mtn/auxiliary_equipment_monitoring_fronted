<!--
 * @Date: 2023-08-01 15:20:53
 * @LastEditors: zhusisheng zhusisheng@shenhaoinfo.com
 * @LastEditTime: 2023-08-02 10:02:50
 * @FilePath: \robot_outdoor_e_vue3\src\views\allMonitor\pagination.vue
-->
<script setup>
import { reactive, watch } from "vue";
import { debounce } from "lodash-es";
const props = defineProps({
  g_iWndIndex: {
    type: Number,
    default: 0,
    required: true,
  },
  pageIndex: {
    type: Number,
    default: 0,
    required: true,
  },
  pageSize: {
    type: Number,
    default: 0,
    required: true,
  },
  total: {
    type: Number,
    default: 0,
    required: true,
  },
  handleSizePageChange: {
    type: Function,
    default: function ({ pageIndex, pageSize }) { },
    required: true,
  },
});
const pages = reactive({ pageIndex: 1, pageSize: 1 });
watch(
  () => [props.pageIndex, props.pageSize],
  async (val) => {
    pages.pageIndex = val[0];
    pages.pageSize = val[1];
  },
  { immediate: true, deep: true }
);

watch(
  () => pages,
  async (val) => {
    changeSizePage(val);
  },
  {
    deep: true,
  }
);

const changeSizePage = debounce(({ pageIndex, pageSize }) => {
  props.handleSizePageChange({ pageIndex, pageSize });
}, 500);
</script>

<template>
  <div class="cameras__pagination">
    <div class="size">
      <div :class="['size__item1', 'size__item', { 'active': pages.pageSize === 1 }]" @click="() => {
        pages.pageIndex =
          (pages.pageIndex - 1) * pages.pageSize + props.g_iWndIndex + 1;
        pages.pageSize = 1;
      }
        " />
      <div :class="['size__item4', 'size__item', { 'active': pages.pageSize === 4 }]" @click="() => {
        pages.pageSize = 4;
      }
        " />
      <div :class="['size__item9', 'size__item', { 'active': pages.pageSize === 9 }]" @click="() => {
        pages.pageSize = 9;
      }
        " />
      <div :class="['size__item16', 'size__item', { 'active': pages.pageSize === 16 }]" @click="() => {
        pages.pageSize = 16;
      }
        " />
    </div>
    <el-pagination layout="total, prev, pager, next" :total="total" v-model:page-size="pages.pageSize"
      v-model:current-page="pages.pageIndex" />
  </div>
</template>

<style lang="scss">
.size {
  $size: 48px;
  display: flex;

  &__item {
    width: $size;
    height: $size;
    margin-left: 20px;
    border: 1px dotted #1b3d9f;
    background-color: #1b3d9f;
    cursor: pointer;

    &--disabled {
      background-color: #61595988 !important;
    }

    &.active {
      background: rgba(10, 240, 253, 0.5);
      border: 1px solid #0AF0FD;
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

    &.active {
      background: repeating-linear-gradient(90deg,
          #aec8ee 0,
          #0AF0FD 1px,
          transparent 1px,
          transparent calc($size / 2)),
        repeating-linear-gradient(#aec8ee 0,
          #0AF0FD 1px,
          transparent 1px,
          transparent calc($size / 2)),
        rgba(10, 240, 253, 0.5);
    }
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

    &.active {
      background: repeating-linear-gradient(90deg,
          #aec8ee 0,
          #0AF0FD 1px,
          transparent 1px,
          transparent calc($size / 3)),
        repeating-linear-gradient(#aec8ee 0,
          #0AF0FD 1px,
          transparent 1px,
          transparent calc($size / 3)),
        rgba(10, 240, 253, 0.5);
    }
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

    &.active {
      background: repeating-linear-gradient(90deg,
          #aec8ee 0,
          #0AF0FD 1px,
          transparent 1px,
          transparent calc($size / 4)),
        repeating-linear-gradient(#aec8ee 0,
          #0AF0FD 1px,
          transparent 1px,
          transparent calc($size / 4)),
        rgba(10, 240, 253, 0.5);
    }
  }
}
</style>
