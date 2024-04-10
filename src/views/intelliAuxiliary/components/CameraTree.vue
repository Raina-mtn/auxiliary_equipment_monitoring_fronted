<template>
    <BasicTree :title="'设备列表'" class="w-full" :treeData="treeData" :filter-node-method="filterNode"
        @on-node-click="onNodeClick">

    </BasicTree>
</template>
    
<script setup lang='ts'>
import BasicTree from '@/components/Tree/BasicTree.vue'
import { apiGetEquipmentTree } from '@/api/interface/intelliAuxiliary/equipment'
import { ref } from 'vue';
import { monitorStore } from '@/store/modules/monitor';

const useMonitorStore = monitorStore()

interface TreeNode {
    [key: string]: any
}

const treeData = ref([])
const emits = defineEmits(['loadTree', 'onNodeClick'])

getEquipmentTree()
function getEquipmentTree() {
    apiGetEquipmentTree({ categoryList: ['CAMERA'] }).then(res => {
        treeData.value = res.data
        emits('loadTree', res.data)
    })
}

const filterNode = (value: string, data: TreeNode) => {
    if (!value) return true
    return data.label.includes(value)
}

// 树节点点击
function onNodeClick(node: any) {

    const { registerInfo } = node
    if (registerInfo && registerInfo.ipAddress && registerInfo.port) {
        emits('onNodeClick')
        const camera = {
            ip: registerInfo.ipAddress,
            port: registerInfo.port,
            channel: registerInfo.channelNumber,
            username: registerInfo.account,
            password: registerInfo.secretKey,
            id: node.id,
            equipmentName: node.label,
            equipmentCode: node.equipmentCode
        }
        useMonitorStore.playCamera(camera)
    }

}
</script>
    
<style></style>