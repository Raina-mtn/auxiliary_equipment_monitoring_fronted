<template>
  <div class="flex ml-4 mr-4 mt-6">
    <div class="flex-1 mr-4">
      <header class="pl-6">列表信息</header>
      <div class="flex-1 p-4 bg-deepBlue relative h-120">
        <ProTable ref="proTable" title="主设备管理" highlight-current-row @current-change="handleCurrentChange"
          :columns="columns" :requestApi="getTableList" max-height="600">
        </ProTable>
      </div>
    </div>
    <div class="flex-1">
      <header class="pl-6">设备授权</header>
      <div class="flex-1 p-4 bg-deepBlue relative h-120">
        <div class="p-4">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="区域名称">
              <el-select v-model="formInline.areaId" placeholder="Select">
                <el-option v-for="item in areaOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="title">
          <span class="title-t">已授权：</span>
          <span class="title-num">{{ auths }}</span>
        </div>
        <ul class="box">
          <li v-for="item in powers" :key="item.id" :class="{ 'active': item.isAuthorize === 1 }"
            @click="handleLock(item.id, item.isAuthorize)">
            <span class="icon"></span>
            <span class="title">{{ item.title }}</span>
          </li>
        </ul>
        <div style="text-align: center">
          <el-button type="primary" size="large" class="mr-4 w-50" @click="submit">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script  setup lang='tsx'>
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { apiGetUser, apiGetArea, apiGetAuthDevice, apiAuthorize } from "@/api/interface/patrolResult/lockControl";
const columns: ColumnProps[] = [
  { type: "index", label: "序号", width: 80 },
  {
    prop: "username",
    label: "姓名",
  },
  {
    prop: "mobile",
    label: "手机号",
  },
  { prop: "roleNames", label: "角色" },
];
const proTable = ref()
interface areaType {
  id: number | string,
  name: string
}
let areaOptions = ref<areaType[]>([])
let powers = ref<any>([])
let auths = ref(0)
const formInline = ref({
  areaId: 1
});
const currentRow = ref()
let userId = ref(null)
let type = "ENTRANCE_GUARD" //门禁
const handleCurrentChange = (val: any) => {
  currentRow.value = val
  userId.value = currentRow.value.id
}
const setCurrent = (row?: any) => {
  proTable.value.element.setCurrentRow(row)
}
const search = async () => {
  let params = {
    userId: userId.value,
    type,
    areaId: formInline.value.areaId
  }
  const res = await apiGetAuthDevice(params)
  const { data } = res
  powers.value = data
  let temp = powers.value.filter((item: { isAuthorize: number; }) => {
    return item.isAuthorize === 1
  }) || []
  auths.value = temp.length
};
const reset = () => {
  formInline.value.areaId = 1
  search()
 };
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  const params2 = {
    ...newParams,
    "page.pageIndex": newParams.page.pageIndex,
    "page.pageSize": newParams.page.pageSize,
  };
  console.log(params2);
  delete params2.page;
  return apiGetUser(params2);
};
apiGetArea().then((res => {
  areaOptions.value = res.data.list
}))
const handleLock = (id: string, isAuthorize: number) => {
  let num = isAuthorize === 1 ? 0 : 1
  powers.value.forEach((item: { id: string; isAuthorize: number; }) => {
    if (item.id === id) {
      item.isAuthorize = num
    }
  })
}
const submit = async () => {
  console.log(powers.value);
  let arr = powers.value.filter((item: { isAuthorize: number; }) => {
    return item.isAuthorize === 1
  }) || []
  let equipmentList = arr.map((item: { code: any; id: any; }) => {
    return {
      equipmentCode: item.code,
      equipmentId: item.id
    }
  })
  let params = {
    type,
    userId: userId.value,
    equipmentList,
  }
  let res = await apiAuthorize(params)
  console.log(res);
  ElMessage.success('授权成功')
  search()
}
setTimeout(() => {
  if (proTable.value && proTable.value.tableData[0]?.id) {
    setCurrent(proTable.value.tableData[0])
    userId.value = proTable.value.tableData[0]?.id
    search()
  }
}, 700)
</script>
<style lang="scss" scoped>
header {
  background: #1765e3;
  border-radius: 0px 0px 0px 0px;
  opacity: 1;
  height: 42px;
  line-height: 42px;
  color: #ffffff;
}

.title {
  display: flex;
  align-items: center;
  margin-bottom: 55px;

  &-t {
    font-size: 36px;
    color: #ffffff;
    line-height: 22px;
  }

  &-num {
    font-size: 48px;
    color: #69ef00;
    line-height: 22px;
  }
}

.box {
  display: flex;
  flex-wrap: wrap;

  li {
    width: 178px;
    height: 74px;
    background: url("@/assets/images/btn_reset.png");
    margin-bottom: 45px;
    margin-right: 64px;
    padding-left: 19px;
    display: flex;
    align-items: center;

    span.icon {
      width: 26px;
      height: 30px;
      background: url("@/assets/images/Slice.png");
      background-size: contain;
      background-repeat: no-repeat;
      vertical-align: middle;
      margin-right: 11px;
    }

    span.title {
      font-size: 18px;
      color: #ffffff;
      line-height: 22px;
      margin: 0;
    }
  }

  li.active {
    background: url("@/assets/images/btn_active.png");
  }

  li:nth-of-type(4n) {
    margin-right: 0;
  }
}

:deep(.el-table) {
  --el-table-current-row-bg-color: #095cbd !important;
}
</style>