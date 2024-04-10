<template>
    <div class="dialog w-1/5 h-1/2" v-if="props.onlineShow">
      <div class="title w-full flex justify-between">
          <div class="text w-2/3 ml-2">电缆测过#1012</div>
          <el-icon :size="24" :color="'#ffffff'" style="height:2.5rem;line-height: 2.5rem;cursor: pointer;" @click="closed()">
              <Close />
          </el-icon>
      </div>
      <div class="mian">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="油色谱" name="first">
                <div class="title w-full flex h-1/8 mb-2"> 
                    <div class="w-1/2 text-center ">参数</div>
                    <div  class="w-1/2 text-center ">数值</div>
                </div>
                <div class="parameter w-full flex h-1/8 mb-2"> 
                    <div class="w-1/2 text-center ">氢气</div>
                    <div  class="w-1/2 text-center ">34%</div>
                </div>
                <div class="parameter w-full flex h-1/8 mb-2"> 
                    <div class="w-1/2 text-center ">一氧化碳</div>
                    <div  class="w-1/2 text-center ">34%</div>
                </div>
                <div class="parameter w-full flex h-1/8 mb-2"> 
                    <div class="w-1/2 text-center ">二氧化碳</div>
                    <div  class="w-1/2 text-center ">34%</div>
                </div>
                <div class="parameter w-full flex h-1/8 mb-2"> 
                    <div class="w-1/2 text-center ">乙烯</div>
                    <div  class="w-1/2 text-center ">34%</div>
                </div>
                <div class="parameter w-full flex h-1/8 mb-2"> 
                    <div class="w-1/2 text-center ">乙烷</div>
                    <div  class="w-1/2 text-center ">34%</div>
                </div>
                <div class="parameter w-full flex h-1/8 mb-2"> 
                    <div class="w-1/2 text-center ">甲烷</div>
                    <div  class="w-1/2 text-center ">34%</div>
                </div>
                <div class="parameter w-full flex h-1/8 mb-2"> 
                    <div class="w-1/2 text-center ">乙炔</div>
                    <div  class="w-1/2 text-center ">34%</div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="铁芯接地电流" name="second">Config</el-tab-pane>
            <el-tab-pane label="SF6" name="third">Role</el-tab-pane>
            <el-tab-pane label="局放" name="fourth">Task</el-tab-pane>
        </el-tabs>
      </div>
      <div class="img">
        <img src="../../../../assets/images/btn_active.png" alt="">
      </div>
    </div>
</template>
<script lang='ts' setup>
  import { Close } from '@element-plus/icons-vue'
  import { reactive, ref } from 'vue'
  import type { TabsPaneContext } from 'element-plus'

  const props = defineProps(["onlineShow","id"]);
  let emit=defineEmits(["update:onlineShow"]) 
  const closed = () => {
      emit("update:onlineShow",false)
  }
const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

  </script>
  
  <style scoped lang='scss'>
  .dialog {
      z-index: 9999999999999999999999999999999;
      top:50%;
      left: 50%;
      transform: translate(-50%,-50%);
      position: absolute;
      background-color: #0B2363;
      .title{
          height: 2.5rem;
          background-color: #1765E3;
          color: #fff;
          line-height: 2.5rem;
          .text {
              font-size: 16px;
              font-family: Microsoft YaHei-Regular, Microsoft YaHei;
              font-weight: 400;
              color: #FFFFFF;
          }
      }
      .parameter {
        height: 2.5rem;
          background-color: #043F91;
          color: #fff;
          line-height: 2.5rem;
      }
      .mian{
          width: 90%;
          height: calc(100% - 4.5rem);
          margin: 1rem auto 0 auto;
      }
      .img {
        position: absolute;
        top: 0;
        left: -392px;
        width: 392px;
        height: 252px;
        background: #0B2363;
        border-radius: 0px 0px 0px 0px;
        opacity: 1;
      }
  }
  .demo-tabs {
    background-color: transparent;
  }
  .demo-tabs > .el-tabs__content {
    width: auto !important;
    height: 37px !important;
  text-align: center;
  color: #6b778c;
}
::v-deep .el-tabs__item {
    width: auto !important;
    padding: 0 10px !important;
    font-size: 18px !important;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400 !important;
}

::v-deep .el-tabs__nav-wrap::after {
    background-color: transparent;
}
  </style>