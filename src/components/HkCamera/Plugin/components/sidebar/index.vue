<!--
 * @Date: 2023-08-02 10:30:09
 * @LastEditors: zhusisheng zhusisheng@shenhaoinfo.com
 * @LastEditTime: 2023-08-21 16:47:05
 * @FilePath: \robot_outdoor_e_vue3\src\components\HcCamera\components\sidebar\index.vue
-->
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import Preset from "./preset/index";
import { getCameraTreeByInstalPosition } from "@/api/interface";
const activeName = ref("cameraList");
const treeData = ref([]);
const props = defineProps({
  hcCameraController: {
    type: Object,
    default: {},
    required: true,
  },
});

const handleNodeClick = (e)=> {
     const { robotcode } = e
     props.hcCameraController.reactiveData.searchParams['robotcode'] = robotcode
     props.hcCameraController.handleSizePageChange({ pageIndex: 1, pageSize: 1 })
}

onMounted(async () => {
  let {
    data: { cameraTreeInstalPositions },
  } = await getCameraTreeByInstalPosition();
  treeData.value = cameraTreeInstalPositions;
  console.log("getCameraTreeByInstalPosition>>>", treeData.value);
});
</script>

<template>
  <el-tabs v-model="activeName" type="card" class="sideBar">
    <el-tab-pane label="视频列表" name="cameraList" class="cameraList">
      <el-tree
        :data="treeData"
        :props="{
          children: 'robotinfos',
          label: 'robotname',
        }"
        @node-click="handleNodeClick"
      ></el-tree>
    </el-tab-pane>
    <el-tab-pane label="监控操作" name="operate" class="operate">
      <div class="operate__item">
        <div class="header">
          <p>操作按钮</p>
        </div>
        <div class="body">
          <div class="cell">
            <span class="label">录像位置</span>
            <el-input
              class="input"
              type="text"
              readonly
              size="small"
              :value="hcCameraController.reactiveData.pluginCfg.recordPath"
            />
            <el-button
              class="btn"
              @click="
                hcCameraController
                  .openPluginDir()
                  .then(
                    (path: any) =>
                      (hcCameraController.reactiveData.pluginCfg.recordPath =
                        path)
                  )
              "
              >浏览</el-button
            >
            <el-button
              class="btn"
              @click="
                hcCameraController.setPluginCfg({
                  recordPath:
                    hcCameraController.reactiveData.pluginCfg.recordPath,
                })
              "
              >设置</el-button
            >
          </div>
          <div class="cell">
            <span class="label">抓图位置</span>
            <el-input
              class="input"
              type="text"
              readonly
              size="small"
              :value="hcCameraController.reactiveData.pluginCfg.capturePath"
            />
            <el-button
              class="btn"
              @click="
                hcCameraController.openPluginDir().then((path: String) => {
                  hcCameraController.reactiveData.pluginCfg.capturePath = path;
                })
              "
              >浏览</el-button
            >
            <el-button
              class="btn"
              @click="
                hcCameraController.setPluginCfg({
                  capturePath:
                    hcCameraController.reactiveData.pluginCfg.capturePath,
                })
              "
              >设置</el-button
            >
          </div>
          <div class="cell" style="justify-content: space-between">
            <el-button
              class="btn"
              v-loading="
                hcCameraController.reactiveData?.choosedCamrea?.reactiveData
                  ?.playStatus == 'processing'
              "
              :disabled="hcCameraController.reactiveData?.choosedCamrea == null"
              @click="
                hcCameraController.reactiveData?.choosedCamrea?.startOrEndPlay()
              "
              >{{
                hcCameraController.reactiveData.choosedCamrea?.reactiveData
                  ?.playStatus == "playing"
                  ? "关闭"
                  : "开启"
              }}当前预览</el-button
            >
            <el-button
              class="btn"
              v-loading="
                hcCameraController.reactiveData.playAllTaggle == 'closing'
              "
              @click="hcCameraController.stopOrStartAllPlay()"
              >{{
                hcCameraController.reactiveData.playAllTaggle == "played"
                  ? "关闭"
                  : "开启"
              }}所有预览</el-button
            >
            <el-button
              class="btn"
              v-loading="
                hcCameraController.reactiveData?.choosedCamrea?.reactiveData
                  ?.recordStatus == 'processing'
              "
              :disabled="hcCameraController.reactiveData?.choosedCamrea == null"
              @click="
                hcCameraController.reactiveData?.choosedCamrea?.startOrEndRecord()
              "
              >{{
                hcCameraController.reactiveData.choosedCamrea?.reactiveData
                  ?.recordStatus == "recording"
                  ? "关闭"
                  : "开启"
              }}录像
            </el-button>
            <el-button
              class="btn"
              :disabled="hcCameraController.reactiveData?.choosedCamrea == null"
              @click="
                hcCameraController.reactiveData?.choosedCamrea?.capturePicture()
              "
              >抓图</el-button
            >
          </div>
        </div>
      </div>
      <div class="operate__item ptz">
        <div class="header">
          <p>云台控制</p>
        </div>
        <div class="body">
          <div class="left">
            <div
              class="btn-top btn-item"
              v-longclick
              @longPressStart="
                () =>
                  hcCameraController.reactiveData?.choosedCamrea?.PTZControl({
                    iPTZIndex: 1,
                  })
              "
              @longPressEnd="
                () =>
                  hcCameraController.reactiveData?.choosedCamrea?.PTZControl({
                    iPTZIndex: 1,
                    bStop: true,
                  })
              "
            ></div>
            <div
              class="btn-right btn-item"
              v-longclick
              @longPressStart="
                () =>
                  hcCameraController.reactiveData?.choosedCamrea?.PTZControl({
                    iPTZIndex: 4,
                  })
              "
              @longPressEnd="
                () =>
                  hcCameraController.reactiveData?.choosedCamrea?.PTZControl({
                    iPTZIndex: 4,
                    bStop: true,
                  })
              "
            ></div>
            <div
              class="btn-bottom btn-item"
              v-longclick
              @longPressStart="
                () =>
                  hcCameraController.reactiveData?.choosedCamrea?.PTZControl({
                    iPTZIndex: 2,
                  })
              "
              @longPressEnd="
                () =>
                  hcCameraController.reactiveData?.choosedCamrea?.PTZControl({
                    iPTZIndex: 2,
                    bStop: true,
                  })
              "
            ></div>
            <div
              class="btn-left btn-item"
              v-longclick
              @longPressStart="
                () =>
                  hcCameraController.reactiveData?.choosedCamrea?.PTZControl({
                    iPTZIndex: 3,
                  })
              "
              @longPressEnd="
                () =>
                  hcCameraController.reactiveData?.choosedCamrea?.PTZControl({
                    iPTZIndex: 3,
                    bStop: true,
                  })
              "
            ></div>
            <div class="btn-center btn-item"></div>
          </div>
          <div class="right">
            <div class="cell cell-right cell-ptz">
              <span class="label">云台速度</span>
              <el-input-number
                class="input"
                controls-position="right"
                :model-value="
                  hcCameraController.reactiveData?.choosedCamrea?.reactiveData
                    .iPTZSpeed
                "
                @change="(iPTZSpeed:any) => hcCameraController.reactiveData.choosedCamrea.reactiveData.iPTZSpeed = iPTZSpeed"
                :min="1"
                :max="7"
              />
            </div>
            <div class="cell cell-right zoomFocus">
              <div
                class="zoomFocus-left"
                v-longclick
                @longPressStart="
                  () =>
                    hcCameraController.reactiveData?.choosedCamrea?.PTZControl({
                      iPTZIndex: 10,
                    })
                "
                @longPressEnd="
                  () =>
                    hcCameraController.reactiveData?.choosedCamrea?.PTZControl({
                      iPTZIndex: 10,
                      bStop: true,
                    })
                "
              >
                +
              </div>
              <span class="label">倍数</span>
              <div
                class="zoomFocus-right"
                v-longclick
                @longPressStart="
                  () =>
                    hcCameraController.reactiveData?.choosedCamrea?.PTZControl({
                      iPTZIndex: 11,
                    })
                "
                @longPressEnd="
                  () =>
                    hcCameraController.reactiveData?.choosedCamrea?.PTZControl({
                      iPTZIndex: 11,
                      bStop: true,
                    })
                "
              >
                -
              </div>
            </div>
            <div class="cell cell-right zoomFocus">
              <div
                class="zoomFocus-left"
                v-longclick
                @longPressStart="
                  () =>
                    hcCameraController.reactiveData?.choosedCamrea?.PTZControl({
                      iPTZIndex: 13,
                    })
                "
                @longPressEnd="
                  () =>
                    hcCameraController.reactiveData?.choosedCamrea?.PTZControl({
                      iPTZIndex: 13,
                      bStop: true,
                    })
                "
              >
                +
              </div>
              <span class="label">变焦</span>
              <div
                class="zoomFocus-right"
                v-longclick
                @longPressStart="
                  () =>
                    hcCameraController.reactiveData?.choosedCamrea?.PTZControl({
                      iPTZIndex: 12,
                    })
                "
                @longPressEnd="
                  () =>
                    hcCameraController.reactiveData?.choosedCamrea?.PTZControl({
                      iPTZIndex: 12,
                      bStop: true,
                    })
                "
              >
                -
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="operate__item">
        <div class="header">
          <p>守望位设置</p>
        </div>
        <div class="body">
          <div class="cell">
            <span class="label">回归守望位</span>
            <el-input-number
              class="input"
              style="width: 100%"
              controls-position="right"
              :model-value="
                hcCameraController.reactiveData?.choosedCamrea?.reactiveData
                  .iPTZSpeed
              "
              @change="(iPTZSpeed:any) => hcCameraController.reactiveData.choosedCamrea.reactiveData.iPTZSpeed = iPTZSpeed"
              :min="1"
              :max="7"
            />
            <span class="label">分钟</span>
          </div>
          <div class="cell">
            <el-button
              style="width: 50%"
              class="btn"
              @click="
                hcCameraController
                  .openPluginDir()
                  .then(
                    (path: any) =>
                      (hcCameraController.reactiveData.pluginCfg.recordPath =
                        path)
                  )
              "
              >设置</el-button
            >
            <el-button
              class="btn"
              style="width: 50%"
              @click="
                hcCameraController.setPluginCfg({
                  recordPath:
                    hcCameraController.reactiveData.pluginCfg.recordPath,
                })
              "
              >关闭</el-button
            >
          </div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="预置位控制" name="preset">
      <Preset :hcCameraController="hcCameraController" />
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" scoped>
.cameraList {
  padding: 10px;
  overflow-y: auto;
  &__item {
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    line-height: 34px;
  }
}

.operate {
  padding: 32px 16px;
  &__item {
    margin-bottom: 16px;
    .header {
      height: 42px;
      background-color: #1b3d9f;
      font-size: 16px;
      font-weight: 400;
      color: #ffffff;
      line-height: 42px;
      padding-left: 16px;
    }
    .body {
      width: 100%;
      border: 1px solid #1b3d9f;
      padding: 16px;
      .cell {
        display: flex;
        height: 32px;
        margin-bottom: 16px;
        justify-content: space-between;
        .label {
          white-space: nowrap;
          display: inline-block;
          font-size: 14px;
          font-weight: 400;
          color: #ffffff;
          line-height: 32px;
          padding-right: 20px;
        }

        .input {
          margin-right: 8px;
        }
        .btn {
          margin-right: 8px;
          margin-left: 0px;
        }
      }
    }
  }
  .ptz {
    .body {
      display: flex;
      height: 214px;
      .left {
        margin-top: 20px;
        margin-bottom: 20px;
        width: 130px;
        height: 130px;
        background: #1b3d9f;
        box-shadow: inset 0px 0px 20px 1px rgba(10, 240, 253, 0.8),
          0px 0px 5px 0px rgba(6, 21, 18, 0.2);
        border-radius: 65px;
        opacity: 1;
        display: grid;
        grid-template-columns: 30px 70px 30px;
        grid-template-rows: 30px 70px 30px;
        grid-template-areas:
          ". btn_top ."
          "btn_left btn_center btn_right"
          ". btn_bottom .";

        .btn-item {
          position: relative;
          &::after {
            content: "";
            position: absolute;
            top: 6px;
            right: 5px;
            width: 0;
            height: 0;

            z-index: 99;
            border-top: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 10px solid transparent;
            border-left: 10px solid transparent;
            transform-origin: 25% center;
            transition: ease-in-out 1s;
          }
        }
        .btn-top {
          grid-area: btn_top;
          height: 100%;
          width: 100%;
          &::after {
            border-bottom: 10px solid #0af0fd;
            top: 0px;
            right: 25px;
          }
        }
        .btn-right {
          grid-area: btn_right;
          height: 100%;
          width: 100%;
          &::after {
            border-left: 10px solid #0af0fd;
            top: 25px;
            right: 0px;
          }
        }
        .btn-bottom {
          grid-area: btn_bottom;
          height: 100%;
          width: 100%;
          &::after {
            border-top: 10px solid #0af0fd;
            bottom: 0px;
            right: 25px;
          }
        }
        .btn-left {
          grid-area: btn_left;
          height: 100%;
          width: 100%;
          &::after {
            border-right: 10px solid #0af0fd;
            top: 25px;
            left: 0px;
          }
        }
        .btn-center {
          grid-area: btn_center;
          height: 100%;
          width: 100%;
          box-shadow: inset 0px 0px 15px 1px #0af0fd,
            0px 0px 5px 0px rgba(6, 21, 18, 0.2);
          border-radius: 35px;
        }
      }
      .right {
        flex: 1;
        margin-left: 43px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .cell-right {
          position: relative;

          .input {
            flex: 1;
            width: unset;
          }
        }
        .cell-ptz {
          .label {
            position: absolute;
            z-index: 9;
            left: 1px;
            background-color: #0b2363;
            height: 28px;
            top: 2px;
            line-height: 28px;
            width: 80px;
            text-align: center;
            padding-right: 0;
            border-right: 1px solid;
          }
        }
        .zoomFocus {
          position: relative;
          display: flex;
          border: 1px solid #095cbd;
          border-radius: 4px;
          overflow: hidden;
          margin-right: 6px;
          .zoomFocus-left,
          .zoomFocus-right {
            height: 100%;
            width: 30px;
            background-color: #095cbd;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
          }
          .label {
            position: absolute;
            z-index: 9;
            left: 40px;
            height: 28px;
            top: 2px;
            line-height: 28px;
            width: 200px;
            text-align: center;
          }
        }
      }
    }
  }
}
// .sideBar {
//   .el-tabs__header {
//     margin-bottom: 0;
//     border-bottom: none;
//     height: 42px;
//     .el-tabs__item {
//       width: 138px;
//       height: 42px;
//       background: #1b3d9f;
//       border-radius: 4px 4px 0px 0px;
//       opacity: 1;
//       border: 1px solid #1765e3;
//       font-size: 18px;
//       font-family: Microsoft YaHei-Regular, Microsoft YaHei;
//       font-weight: 400;
//       color: #ffffff;
//       line-height: 21px;
//       margin-right: 5px;
//     }
//     .el-tabs__item.is-active {
//       background-color: #1765e3;
//       border-bottom: none;
//     }
//     .el-tabs__nav {
//       border: none;
//     }
//   }
//   .el-tabs__content {
//     padding: 0px;
//     font-weight: 600;
//     background-color: #0b2363;
//     height: 848px;
//     .el-tab-pane {
//       height: 100%;
//     }
//   }

// }
</style>
