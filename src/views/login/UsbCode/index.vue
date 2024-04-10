<!--
 * @Date: 2023-10-19 09:23:27
 * @LastEditors: zhusisheng zhusisheng@shenhaoinfo.com
 * @LastEditTime: 2023-10-24 11:15:01
 * @FilePath: \robot_outdoor_e_vue3\src\components\usbCode\index.vue
-->
<template>
    <div class="usbCode">
        <el-input readonly v-model="state.value" />
        <el-button @click="read"> 读取 </el-button>
        <iframe v-if="state.src" ref="iframe_usbCode" style="width: 0; height: 0"
            src="./static/ipk/chrome/ipk_chrome_extension.html" />
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onBeforeMount, watch } from "vue";

const props = defineProps({
    value: {
        type: String,
        default: "",
        required: false,
    },
});

const emit = defineEmits(["update:value"]);

const state = reactive({
    value: "",
    src: "",
});

watch(
    () => props.value,
    (newVal) => {
        state.value = newVal;
    }
);

const userAgent = () => {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        //判断是否Opera浏览器
        return "Opera";
    }
    if (userAgent.indexOf("Firefox") > -1) {
        //判断是否Firefox浏览器
        state.src = "./static/ipk/firefox/ipk_firefox_extension.html";
        return "FF";
    }
    if (userAgent.indexOf("Chrome") > -1) {
        //判断是否Chrome浏览器
        state.src = "./static/ipk/chrome/ipk_chrome_extension.html";
        return "Chrome";
    }
};


const iframe_usbCode = ref(null);
const read = async () => {
    const res = await iframe_usbCode.value.contentWindow.TestOpenDevice()
    ucide = JSON.parse(res).responseData
    state.value = ucide
    state.value = ucide
    emit('update:value', ucide)
}

onBeforeMount(() => {
    userAgent();
});
</script>
<style lang="scss" scoped>
.usbCode {
    width: 100%;
    display: flex;
}
</style>
