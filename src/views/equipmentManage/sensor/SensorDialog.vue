<template>
    <el-dialog v-model="state.dialogVisible" :title="`${state.isEdit ? '编辑' : '添加'}传感器`" width="40%" @close="close"
        destroy-on-close>
        <el-form label-width="100px" :rules="rules" ref="ruleFormRef" :model="form" status-icon label-suffix=":"
            v-if="state.dialogVisible">
            <el-row>
                <el-col :span="12" :gutter="20">
                    <el-form-item label="区域" prop="areaId">
                        <el-select v-model="form.areaId" class="w-full" placeholder="请选择" :disabled="form.masterId !== ''">
                            <el-option v-for="item in chooseList.areaList" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :gutter="20">
                    <el-form-item label="点位" prop="deployAreaId">
                        <el-select v-model="form.deployAreaId" class="w-full" placeholder="请选择"
                            :disabled="form.masterId !== ''">
                            <el-option v-for="item in chooseList.pointList" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :gutter="20">
                    <el-form-item label="所属设备" prop="masterId">
                        <el-select v-model="form.masterId" class="w-full" placeholder="请选择" @change="handleMasterChange"
                            clearable>
                            <el-option v-for="item in chooseList.allDevices" :key="item.id" :label="item.title"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :gutter="20">
                    <el-form-item label="传感器编号" prop="code">
                        <el-input v-model="form.code" maxlength="50" show-word-limit />
                    </el-form-item>
                </el-col>
                <el-col :span="12" :gutter="20">
                    <el-form-item label="传感器名称" prop="title">
                        <el-input v-model="form.title" maxlength="50" show-word-limit />
                    </el-form-item>
                </el-col>
                <el-col :span="12" :gutter="20">
                    <el-form-item label="传感器类型" prop="categoryId">
                        <el-select v-model="form.categoryId" class="w-full" placeholder="请选择">
                            <el-option v-for="item in chooseList.deviceTypeList" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :gutter="20">
                    <el-form-item label="采集周期类型" prop="acquisitionType">
                        <el-select v-model="form.acquisitionType" class="w-full">
                            <el-option :value="'INTERVAL'" :label="'间隔'">间隔</el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :gutter="20">
                    <el-form-item label="采集周期(s)" prop="acquisitionCycle" :required="form.acquisitionType === 'INTERVAL'">
                        <el-input-number v-model="form.acquisitionCycle" :min="1" :max="86400">
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :gutter="20">
                    <el-form-item label="传感器型号" prop="desc">
                        <el-input v-model="form.desc" maxlength="50" show-word-limit />
                    </el-form-item>
                </el-col>
                <template v-if="categoryCode === 'NVR' || categoryCode === 'CAMERA'">
                    <el-col :span="12" :gutter="20">
                        <el-form-item label="IP地址" prop="registerInfo.ipAddress">
                            <el-input v-model="form.registerInfo.ipAddress" maxlength="15" show-word-limit />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :gutter="20">
                        <el-form-item label="端口号" prop="registerInfo.port">
                            <el-input v-model="form.registerInfo.port" maxlength="5" show-word-limit />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :gutter="20">
                        <el-form-item label="用户名" prop="registerInfo.account">
                            <el-input v-model="form.registerInfo.account" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :gutter="20">
                        <el-form-item label="密码" prop="registerInfo.secretKey">
                            <el-input v-model="form.registerInfo.secretKey" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :gutter="20">
                        <el-form-item label="设备端口" prop="registerInfo.addtionalJson.privatePort">
                            <el-input v-model="form.registerInfo.addtionalJson.privatePort" maxlength="5" show-word-limit />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :gutter="20">
                        <el-form-item label="RTSP端口" prop="registerInfo.addtionalJson.rtspPort">
                            <el-input v-model="form.registerInfo.addtionalJson.rtspPort" maxlength="5" show-word-limit />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :gutter="20">
                        <el-form-item label="通道" prop="registerInfo.channel">
                            <el-input v-model="form.registerInfo.channel" maxlength="5" show-word-limit />
                        </el-form-item>
                    </el-col>
                </template>
                <el-col :span="12" :gutter="20">
                </el-col>
            </el-row>
            <el-row>
            </el-row>
            <el-form-item label="备注" prop="memo">
                <el-input v-model="form.memo" type="textarea" maxlength="500" show-word-limit />
            </el-form-item>
            <el-form-item label="图片" prop="name">
                <el-upload v-model:file-list="fileList" :action="'#'" accept="image/*" list-type="picture" :limit="3"
                    :auto-upload="false" :on-preview="handlePreview" :on-remove="handleRemove" :on-change="handleChange"
                    :on-exceed="handleExceed">
                    <el-button type="primary" :icon="Upload">点击上传</el-button>
                    <template #tip>
                        <div class="el-upload__tip">
                            最多上传3张图片
                        </div>
                    </template>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close">关闭</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)">
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
        
<script setup lang='ts' name="MainEquipDialog">
import { Upload } from "@element-plus/icons-vue";
import type { UploadProps, UploadUserFile, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { deviceAdd, deviceUpdate, categoryList, deviceList } from '@/api/interface/device'
import { upload } from '@/api/interface/file'
import { list } from '@/api/interface/system/area'
import { list as pointListApi } from '@/api/interface/system/point'
import { reactive, ref, onMounted, watch, computed, nextTick } from 'vue';
import { unref } from "vue";
import { cloneDeep, isObject } from "lodash-es";

const emit = defineEmits(['getList'])


interface DeviceData {
    areaList: ({ name: string, id: string | number })[]
    pointList: ({ name: string, id: string | number })[]
    deviceTypeList: ({ name: string, id: string | number, code: string })[]
    allDevices: ({ title: string, id: string | number })[]
}
const state = reactive({
    dialogVisible: false,
    isEdit: false
})

const fileList = ref<UploadUserFile[]>([])
const categoryCode = ref('')
const chooseList = reactive<DeviceData>({
    // 区域列表
    areaList: [],
    // 点位列表
    pointList: [],
    // 设备类型列表
    deviceTypeList: [],
    allDevices: []
})
const ruleFormRef = ref<FormInstance>()
const form = ref({
    title: '',
    areaId: '',
    deployAreaId: '',
    masterId: '',
    categoryId: '',
    code: '',
    registerInfo: {
        addtionalJson: {
            privatePort: '',
            rtspPort: ''
        },
        ipAddress: '',
        port: '',
        secretKey: '',
        account: '',
        protocol: 'rtsp',
        channel: ''
    },
    acquisitionCycle: 60
})
const rules = computed(() => ({
    title: [
        { required: true, message: '请输入设备名称', trigger: 'blur' },
        { min: 1, max: 50, message: '长度在1-50字符之间', trigger: 'blur' },
    ],
    code: [
        { required: true, message: '请输入设备编码', trigger: 'blur', },
        { min: 1, max: 50, message: '长度在1-50字符之间', trigger: 'blur' }
    ],
    deployAreaId: [
        {
            required: true,
            message: '请选择点位',
            trigger: 'blur',
        },
    ],
    categoryId: [
        {
            required: true,
            message: '请选择传感器类型',
            trigger: 'blur',
        },
    ],
    areaId: [
        {
            required: true,
            message: '请选择区域',
            trigger: 'blur',
        },
    ],
    //@ts-ignore
    'registerInfo.addtionalJson.privatePort': [
        { required: true, message: '请输入设备端口', trigger: 'blur', },
    ],
    'registerInfo.addtionalJson.rtspPort': [
        { required: true, message: '请输入rtsp端口', trigger: 'blur', },
    ],
    'registerInfo.ipAddress': [
        { required: true, message: '请输入IP地址', trigger: 'blur', },
    ],
    'registerInfo.port': [
        { required: true, message: '请输入端口', trigger: 'blur', },
    ],
    'registerInfo.secretKey': [
        { required: true, message: '请输入密码', trigger: 'blur', },
    ],
    'registerInfo.account': [
        { required: true, message: '请输入用户名', trigger: 'blur', },
    ],
    'registerInfo.channel': [
        { required: true, message: '请输入通道', trigger: 'blur', },
    ],
    acquisitionCycle: [
        { required: form.value?.acquisitionType === 'INTERVAL', message: '请输入采集周期', trigger: 'blur', },
    ]
}))

watch(() => form.value.areaId, (val, oldVal) => {
    if (!state.isEdit && oldVal) {
        form.value.deployAreaId = ''
    }
    getPointList(val)
})

watch(() => form.value.categoryId, (val) => {
    if (val) {
        const data = chooseList.deviceTypeList.find(item => {
            return item.id === val
        })
        if (data) {
            categoryCode.value = data.code

        }
    }
})

function handleMasterChange(val: any) {
    if (val) {
        const obj = chooseList.allDevices.find(item => item.id === val)
        console.log(obj);
        if (obj) {
            form.value.areaId = obj.areaIdList[0]
            form.value.deployAreaId = obj?.deployAreaId
        }
    }
}

onMounted(async () => {
    getAreaList()
    getTypeList()
    getAllDeviceList()
})

const handleChange = (file: any) => {
    if (file && file.status === 'ready') {
        if (file.size / 1024 / 1024 > 100) {
            ElMessage.error('图片大小不能超过100M!')
            return false
        }
        let fd = new FormData()
        fd.append('imgFile', file.raw)
        upload(fd).then(res => {
            //   form.value.fileList?.push(res.data)
            file.keys = res.data
        })
    }
}

function handlePreview() {

}

const handleExceed: UploadProps['onExceed'] = () => {
    ElMessage.warning(
        `最多可上传3个文件`
    )
}

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
    console.log(file, uploadFiles)
}

// 获取区域列表
function getAreaList() {
    list({ level: 1, pageIndex: 1, pageSize: 100000 }).then(res => {
        chooseList.areaList = res.data.list
    })
}

// 获取点位列表
function getPointList(id: number | string) {
    pointListApi({ level: 2, rootAreaId: id, pageIndex: 1, pageSize: 100000 }).then(res => {
        chooseList.pointList = res.data.list
    })
}

// 获取类型列表
function getTypeList() {
    categoryList({ grade: 2, pageIndex: 1, pageSize: 100000 }).then(res => {
        chooseList.deviceTypeList = res.data
    })
}

// 获取所有主设备列表
function getAllDeviceList() {
    deviceList({ grade: 1, page: { pageIndex: 1, pageSize: 100000 } }).then(res => {
        chooseList.allDevices = res.data.list.map((item: any) => {
            return {
                id: item.id,
                title: `${item.title}[${item.code}]`,
                areaIdList: item.areaIdList,
                deployAreaId: item.deployAreaId
            }
        })
    })
}

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            const params = { ...form.value, grade: 2 }
            if (fileList.value.length > 0) {
                params.imageList = fileList.value.map((item: any) => {
                    return item.keys
                })
            }
            if (state.isEdit) {
                deviceUpdate(params).then(res => {
                    if (res.status.code === 1) {
                        ElMessage({
                            message: '编辑成功！',
                            type: 'success'
                        })
                        emit('getList')
                        close()
                    }
                })
            } else {
                deviceAdd(params).then(res => {
                    if (res.status.code === 1) {
                        ElMessage({
                            message: '新增成功！',
                            type: 'success'
                        })
                        emit('getList')
                        close()
                    }
                })
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}


function close() {
    categoryCode.value = ''
    ruleFormRef.value?.resetFields()
    form.value = {
        title: '',
        areaId: '',
        deployAreaId: '',
        masterId: '',
        categoryId: '',
        code: '',
        acquisitionCycle: 60,
        registerInfo: {
            addtionalJson: {
                privatePort: '',
                rtspPort: ''
            },
            ipAddress: '',
            port: '',
            secretKey: '',
            account: '',
            protocol: 'rtsp',
            channel: ''
        },
    }
    fileList.value = []
    state.dialogVisible = false
}
function open(isEdit: boolean, props: any) {
    state.dialogVisible = true
    state.isEdit = isEdit
    nextTick(() => {
        ruleFormRef.value?.clearValidate()
    })
    if (isEdit) {
        form.value = deepMerge(unref(form), props)
        form.value.masterId = props.masterMap.MONITOR.id
        form.value.id = props.id
        console.log(form.value);

        if (props.imageList && props.imageList.length > 0) {
            fileList.value = props.imageList.map((item: string) => {
                return { name: '', url: import.meta.env.VITE_APP_BASE_API + item, keys: item }
            })
        }
        form.value.areaId = props.areaIdList[0]
        if (!props.registerInfo) {
            form.value.registerInfo = {
                addtionalJson: {
                    privatePort: '',
                    rtspPort: ''
                },
                ipAddress: '',
                port: '',
                secretKey: '',
                account: '',
                protocol: 'rtsp',
                channel: ''
            }
        } else {
            form.value.registerInfo.addtionalJson = {
                privatePort: form.value.registerInfo?.privatePort || '',
                rtspPort: form.value.registerInfo.rtspPort || ''
            }
        }
    }

}

// 把target的值赋给src
function deepMerge<T = any>(src: any = {}, target: any = {}): T {
    let key: string
    for (key in src) {
        src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key])
    }
    return src
}

defineExpose({
    open
})
</script>
        
<style>
.el-upload-list {
    display: flex;
}

.el-upload-list__item {
    margin-right: 12px;
}
</style>