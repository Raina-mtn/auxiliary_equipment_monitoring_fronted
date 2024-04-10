<template>
  <header class="home-title">{{ props.title }}<span>{{ props.subTitle }}</span></header>
</template>

<script lang="ts" setup>

const props = defineProps(['title', 'subTitle'])
</script>
<style lang="scss" scoped>
.home-title {
  height: 38px;
  line-height: 38px;
  background: url("@/assets/images/home_header_bg.png") no-repeat;
  padding-left: 60px;
  color: #fff;

  span {
    margin-left: 10px;
    color: #999;
  }
}
</style>
