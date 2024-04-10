<template>
    <div class="streamManage p-4">
        <header class="flex justify-between mb-4">
            <div class="header-card" v-for="(item, index) in headerConfig"
                :style="{ 'background-image': `url(${item.image})` }" :key="index">
                <b>{{ statisData[item.key] || 0 }}</b>
                <p>{{ item.name }}</p>
            </div>
        </header>
        <ProTable ref="proTable" :columns="columns" max-height="680" :request-api="getTableList" :searchCol="searchCol">
        </ProTable>
    </div>
</template>
    
<script setup lang='ts' name="SteamManage">
import { ref } from 'vue';
import { headerConfig, columns } from './config'
import ProTable from "@/components/ProTable/index.vue";
import { apiGetStreamList, apiGetStreamStatis } from '@/api/interface/intelliAuxiliary/stream'

type StatisProps = {
    totalAccess: number
    onlineDevice: number
    offlineDevice: number
    deviceOnlineRate: string
}

const statisData = ref(<StatisProps>{})
getStreamStat()

const getTableList = (params: any) => {
    let newParams = JSON.parse(JSON.stringify(params));

    const params2 = {
        ...newParams,
        'page.pageIndex': newParams.page.pageIndex,
        'page.pageSize': newParams.page.pageSize,
    }
    console.log(params2);

    delete params2.page

    return apiGetStreamList(params2);
};

function getStreamStat() {
    apiGetStreamStatis().then(res => {
        statisData.value = res.data
    })
}
const searchCol = {
    xs: 1,
    sm: 2,
    md: 6,
    lg: 6,
    xl: 6
}
</script>
    
<style lang="scss" scoped>
.header-card {
    width: calc(25% - 10px);
    margin-right: 10px;
    height: 150px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #fff;
    padding-top: 50px;
    box-sizing: border-box;
    padding-left: 40px;

    b {
        font-size: 24px;
    }

    p {
        color: rgba(255, 255, 255, 0.7);
    }
}
</style>