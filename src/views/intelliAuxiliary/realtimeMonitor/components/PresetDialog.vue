<template>
    <el-dialog v-model="state.dialogVisible" :title="`${state.isEdit ? '编辑' : '添加'}预置位`" width="300px"
        custom-class="preset-dialog">
        <el-form label-width="100px" :model="form" :rules="rules" ref="ruleFormRef">
            <el-form-item label="预置位名称" prop="presetName" required>
                <el-input v-model="form.presetName" />
            </el-form-item>
            <el-form-item label="预置位Id" prop="presetIndex" required>
                <el-input v-model="form.presetIndex" :disabled="state.isEdit" />
            </el-form-item>
            <el-form-item label="预置位描述" prop="comment">
                <el-input v-model="form.comment" type="text" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="state.dialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="submit">
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
        
<script setup lang='ts'>
import { reactive, ref, unref } from 'vue';
import type { FormInstance } from 'element-plus'
import { apiCreatePreset, apiUpdatePreset } from '@/api/interface/intelliAuxiliary/equipment'
import { ElMessage } from 'element-plus'
import { monitorStore } from '@/store/modules/monitor';
import type { Preset } from '@/api/interface/types';

const useMonitorStore = monitorStore()

const emits = defineEmits(['refresh'])
const ruleFormRef = ref<FormInstance>()

const rules = reactive({
    presetIndex: [
        { required: true, message: '预置点位序号', trigger: 'blur' },
    ],
    presetName: [
        { required: true, message: '预置点位名称', trigger: 'blur' },
    ]
})


const state = reactive({
    dialogVisible: false,
    isEdit: false,
})

const form = ref<Preset>({
    presetIndex: 0,
    presetName: '',
    comment: ''
})


function open(scope: Preset, isEdit: boolean) {
    ruleFormRef.value?.resetFields()
    state.dialogVisible = true
    state.isEdit = isEdit
    form.value = {
        presetIndex: scope?.presetIndex,
        presetName: scope?.presetName || '',
        comment: scope?.comment || '',
        id: scope?.id
    }
}

async function submit() {
    if (!ruleFormRef.value) return
    const valid = await ruleFormRef.value.validate()
    if (valid) {
        const api = state.isEdit ? apiUpdatePreset : apiCreatePreset
        const camera = useMonitorStore.playingCamera
        const params = {
            ...unref(form),
            channelNumber: camera.channel,
            equipmentId: camera.id,
            equipmentCode: camera.equipmentCode

        }
        api(params).then(() => {
            ElMessage.success(state.isEdit ? '编辑成功' : '创建成功')
            state.dialogVisible = false
            useMonitorStore.postMessage({
                connectType: 'setPreset',
                params: {
                    iPresetID: form.value.presetIndex,
                }
            })
            emits('refresh')
        })
    }
}

defineExpose({
    open
})
</script>
        
<style></style>