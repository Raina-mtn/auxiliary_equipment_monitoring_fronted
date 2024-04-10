<template>
  <div class="title flex items-center">
    <div class="title-line"></div>
    <div class="title-name">{{ props.title }}</div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  title: {
    type: String
  }
})

</script>
<style scoped lang="scss">
  .title {
    .title-line {
      width: 4px;
      height: 20px;
      background: #0AF0FD;
      border-radius: 8px 8px 8px 8px;
      opacity: 1;
    }

    .title-name {
      font-size: 16px;
      color: #FFFFFF;
      margin-left: 10px;
    }
  }
</style>
