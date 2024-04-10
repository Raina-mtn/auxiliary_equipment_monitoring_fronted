<template>
  <el-dialog v-model="state.dialogVisible" :title="`查看平面图`" width="30%">
    <div class="bg-deepBlue">
      <img :src="fileUrl + state.planUrl" alt="" class="w-726px h-467px">
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'

const fileUrl = import.meta.env.VITE_APP_BASE_API

const state = reactive({
  dialogVisible: false,
  planUrl: ''
})

onMounted(() => {
  
})

function open(planUrl: string) {
  state.dialogVisible = true
  state.planUrl = planUrl
}

defineExpose({
  open
})

</script>
<style scoped lang="scss">

</style>
