<template>
    <div class="preset-container">
        <div class="flex text-white items-center justify-between p-4">
            <div class="flex items-center flex-nowrap">
                <label for="" class="mr-2">预置位名称</label>
                <el-input size="mini" :suffix-icon="Search" class="flex-1" v-model="presetName"></el-input>
            </div>
            <el-button :icon="CirclePlus" type="primary" @click="createPreset">添加</el-button>
        </div>
        <div class="preset-list">
            <h3 class="flex items-center">
                <el-icon class="mr-2" :size="20">
                    <CameraFilled />
                </el-icon>相机名称：{{ camera?.equipmentName }}
            </h3>
            <el-divider style="border-color: #369EF8;" :border-style="'dashed'"></el-divider>
            <ul v-if="presetList.length > 0">
                <li class="flex justify-between items-center" v-for="(item, index) in presetList" :key="index">
                    <span>{{ item.presetName }}</span>
                    <span>
                        <el-icon :size="20" color="#0AF0FD" class="cursor-pointer" @click="gotoPreset(item)">
                            <Position />
                        </el-icon>
                        <el-icon :size="20" color="#0AF0FD" class="mx-4 cursor-pointer" @click="editPreset(item)">
                            <Tools />
                        </el-icon>
                        <el-icon :size="20" color="#F00" class="cursor-pointer" @click="delPreset(item)">
                            <Close />
                        </el-icon>

                    </span>
                </li>
            </ul>
            <NoData v-else />
        </div>
        <PresetDialog ref="presetDialogRef" @refresh="getPresetList" />
    </div>
</template>
    
<script setup lang='ts'>
import { Search, Position, Tools, Close, CameraFilled, CirclePlus } from '@element-plus/icons-vue'
import { apiGetPresetList, apiDelPreset } from '@/api/interface/intelliAuxiliary/equipment'
import { ref, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus'
import PresetDialog from './PresetDialog.vue';
import { monitorStore } from '@/store/modules/monitor';
import NoData from '@/components/NoData.vue'
import type { Camera, Preset } from '@/api/interface/types';
const useMonitorStore = monitorStore()


const presetName = ref('')
const presetList = ref<Preset[]>([])
const presetDialogRef = ref()
const camera = ref<Camera>()

useMonitorStore.$subscribe((_, state) => {
    camera.value = state.playingCamera || {}
})


watch(presetName, () => {
    getPresetList(presetName.value)
})

getPresetList()
// 预置位列表
function getPresetList(presetName?: string) {
    camera.value = useMonitorStore.playingCamera || {}

    apiGetPresetList({
        presetName,
        channelNumber: camera.value.channel,
        equipmentId: camera.value.id,
        equipmentCode: camera?.value.equipmentCode
    }).then(res => {
        presetList.value = res.data
    })
}
// 创建预置位
function createPreset() {
    presetDialogRef.value.open()
}
// 预置位跳转
function gotoPreset(item: Preset) {
    useMonitorStore.postMessage({
        connectType: 'goPreset',
        params: {
            iPresetID: item.presetIndex,
        }
    })

}
// 预置位编辑
function editPreset(item: Preset) {
    presetDialogRef.value.open(item, true)
}
// 预置位删除
function delPreset(item: Preset) {
    ElMessageBox.confirm('确认删除该预置位？', '提示').then(() => {
        apiDelPreset(item.id).then(() => {
            ElMessage.success('删除成功')
            getPresetList()
        })
    })
}

</script>
    
<style lang="scss" scoped>
.preset-container {
    height: calc(100% - 20px);
    display: flex;
    flex-direction: column;
}

.preset-list {
    margin: 1rem;
    background: linear-gradient(180deg, #0B2363 0%, rgba(27, 61, 159, 0.7) 100%);
    color: #fff;
    padding: 10px;
    border: 1px solid #1765E3;
    flex: 1;

    li {
        position: relative;
        padding-left: 14px;

        &::after {
            position: absolute;
            content: '';
            width: 8px;
            height: 8px;
            background: #1765E3;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            border-radius: 50%;
        }
    }
}
</style>