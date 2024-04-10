<template>
   <div class="card-item p-4">
      <header class="flex justify-between">
         <label class="text-normal"><span :class="['iconfont', 'mr-2', props.icon]"></span>{{ props.monitorState === 0 ?
            '正常' :
            '告警' }}</label>
         <el-switch :value="state.switchState" @input="switchEquipment"></el-switch>
      </header>
      <div class="card-item__content">
         <p><span class="iconfont icon-dingwei"></span>{{ props.deployAreaName }}</p>
         <p><span class="iconfont icon-bianhao"></span>{{ props.equipmentCode }}</p>
         <div v-if="props.showItems && props.showItems.length" class="mt-2 pt-2 divider">
            <p v-for="item in props.showItems">
               <span :class="['iconfont', item.icon]"></span>
               <label> {{ item.name }}: </label>
               <label> {{ props.thingData ? props.thingData[item.key] : '--' }}{{ item.unit }}</label>
            </p>
         </div>
         <div class="card-status mt-4">
            <span :class="{ active: !props.equipmentState }">异常</span>
            <span :class="{ active: props.nameplateState }">挂牌</span>
         </div>
      </div>
   </div>
</template>
    
<script setup lang='ts'>
import { apiSwitchEquipmentById, openDoor } from '@/api/interface/intelliAuxiliary/dynamicEnvi'
import { watch, inject } from 'vue';
import { reactive } from 'vue';
import { ElMessage } from 'element-plus'
import { recheckPass } from '@/components/RecheckPass/index'
const typeCode = inject('typeCode')
const emits = defineEmits(['close', 'open'])
type ItemProps = {
   equipmentId: number
   equipmentCode: string
   deployAreaName: string
   switchState: boolean
   monitorState: number
   equipmentState: boolean
   nameplateState: number
   thingData: any,
   icon: string,
   showItems: [
      {
         name: string,
         key: string,
         unit: string,
         icon: string
      }
   ]
}
const props = defineProps<ItemProps>()
const state = reactive({
   switchState: false
})

watch(() => props.switchState, () => {
   state.switchState = props.switchState
})

async function switchEquipment(val: boolean) {
   await recheckPass()
   if (typeCode === 'DOOR') {
      openDoor({
         equipmentId: props.equipmentId,
         timeup: 60
      }).then((res) => {
         if (res.status.succeed) {
            ElMessage.success('开门成功')
            emits("open")
            setTimeout(() => {
               emits("close")
            }, 6000);
         }
      })
   } else {
      if (props.nameplateState) {
         ElMessage.error('设备维护中!')
      } else {
         apiSwitchEquipmentById({
            equipmentId: props.equipmentId,
            switchStatus: val
         }).then(() => {
            state.switchState = !state.switchState
         })

      }
   }
}
</script>
    
<style lang="scss" scoped>
.card-item {
   background: #043F91;
   border: 1px solid rgba(255, 255, 255, 0.5);
   color: #fff;
   font-size: 14px;
   width: calc(25% - 1rem);

   &__content {
      .iconfont {
         color: #369EF8;
         margin-right: 8px;
      }

      p {
         margin: 5px 0;
      }

      .divider {
         position: relative;

         &::after {
            position: absolute;
            content: '';
            top: 0;
            left: 0;
            width: 100%;
            border-top: 1px dashed #379FF9;
         }
      }

      .card-status {
         span {
            display: inline-block;
            width: 52px;
            height: 24px;
            font-size: 12px;
            text-align: center;
            line-height: 24px;
            background: rgba(175, 175, 175, 0.5);
            ;
            border-radius: 2px;
            opacity: 1;
            border: 1px solid transparent;
            margin-right: 5px;
         }

         span:first-child.active {
            background: rgba(242, 39, 74, 0.6);
            border-color: #F2274A;
         }

         span:last-child.active {
            background: rgba(177, 97, 242, 0.6);
            border-color: #B161F2;
         }
      }
   }
}
</style>