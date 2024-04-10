<template>
  <div class="left-panel">
    <header>
      {{ title }}
    </header>
    <main>
      <nav>
        <slot>
          <el-icon>
            <Setting />
          </el-icon>
          <span class="ml-6px">{{ title }}</span>
        </slot>
      </nav>
    </main>
  </div>
</template>

<script setup lang="ts">
defineProps(['title'])

</script>
<style scoped lang="scss">
.left-panel {
  width: 260px;
  height: 100%;
  background: #0B2363;
  border-radius: 0px 0px 0px 0px;
  opacity: 1;
  color: #FFFFFF;

  header {
    width: 100%;
    height: 35px;
    background: url('../../../assets/images/tree_title_bg.png') no-repeat;
    background-size: 100% 35px;
    font-size: 18px;
    line-height: 35px;
    padding-left: 48px;
  }

  main {
    padding: 24px;

    nav {
      display: flex;
      align-items: center;
      font-size: 18px;
    }
  }
}
</style>
