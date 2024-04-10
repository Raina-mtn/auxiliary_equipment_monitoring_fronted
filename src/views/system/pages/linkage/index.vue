<template>
  <div class="linkage text-light-50 p-16px">
    <left-panel title="联动管理" />
    <div class="linkage-content">
      <div class="flex-1 p-4 bg-deepBlue">
        <ProTable
          ref="proTable"
          title="点位列表"
          :columns="columns"
          :requestApi="getTableList"
          :searchCol="searchCol"
          max-height="600"
          @handleCreate="openModal"
        >
          <!-- 表格操作 -->
          <template #operation="scope">
            <el-button type="primary" link :icon="EditPen" @click="openModal(true, scope.row.id)"> 编辑 </el-button>
            <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row.id)"> 删除 </el-button>
          </template>
        </ProTable>
      </div>
    </div>
    <LinkpageDialog ref="linkpageDialog" @success="success" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import LeftPanel from '../../components/LeftPanel.vue'
import ProTable from "@/components/ProTable/index.vue"
import LinkpageDialog from "../../components/LinkpageDialog.vue"
import { Delete, EditPen } from "@element-plus/icons-vue"
import {columns} from './config'
import {  ElMessage } from "element-plus";



import {apiGetRuleList, linkDel} from '@/api/interface/system/linkage'

const linkpageDialog = ref()
const proTable = ref()

function openModal(isEdit: boolean = false, id: number){
  linkpageDialog.value.open(isEdit, id)
}

async function deleteAccount(id){
  const params = [id]  
  await linkDel(params)
  ElMessage.success('删除成功')
  proTable.value.search()
}
const getTableList = (params: any) => {
    let newParams = JSON.parse(JSON.stringify(params));
    const params2 = {
        ...newParams,
        'page.pageIndex': newParams.page.pageIndex,
        'page.pageSize': newParams.page.pageSize,
    }
    console.log(params2);
    delete params2.page
    return apiGetRuleList(params2);
};
function success() {
  proTable.value.search()
}

</script>
<style scoped lang="scss">
  .linkage {
    display: flex;
    width: 100%;
    height: 100%;
    padding-top: 32px;

    &-content {
      flex: 1;
      height: 100%;
      background: #0B2363;
      margin-left: 16px;
    }
  }
</style>
