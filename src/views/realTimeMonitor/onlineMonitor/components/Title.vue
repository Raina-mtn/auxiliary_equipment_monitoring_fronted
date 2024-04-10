<template>
  <header class="home-title">{{ props.title }}</header>
</template>

<script lang="ts" setup>
const props = defineProps(["title"]);
</script>
<style lang="scss" scoped>
.home-title {
  height: 38px;
  line-height: 38px;
  background: url("@/assets/images/IntelligentInspect_bg_title.png") no-repeat;
  padding-left: 40px;
  color: #fff;
  font-size: 18px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
}
</style>
