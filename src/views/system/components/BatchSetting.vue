<template>
  <el-dialog
    v-model="dialogVisible"
    title="批量设置"
    width="50%"
    :before-close="handleClose"
    @close="close()"
  >
  <MainPanel></MainPanel>
  </el-dialog>
</template>
        
<script setup lang='ts'>
import MainPanel from "./main.vue";
import { ref, computed ,watch} from "vue";
import {alarmStore} from '@/store'

const useAlarmStore = alarmStore();

// const dialogVisible = ref(false);
let dialogVisible = computed(()=>{
  return useAlarmStore.dialogVisible
})

function close(){
  useAlarmStore.setDialogVisible(false)
}

</script>
        
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>