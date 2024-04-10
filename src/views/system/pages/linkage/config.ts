
import {  ColumnProps} from "@/components/ProTable/interface";
export const columns:ColumnProps[] = [
    { type: "index", label: "序号", width: 80 },
    {
      prop: "linkageScenario",
      label: "联动场景",
      width: 350,
      // <template #default="{ row }">
      //         <div class="special" style="height: 30px;" v-for="(item, index) in row.linkageScenarios" :key="index">
      //           <i class="cycle">{{ index + 1 }}</i>
      //           <span class="content">: {{ item }}</span>
      //         </div>
      //       </template>
      search: { el: "input" }
    },
    {
      prop: "equipment",
      label: "设备",
      search: { el: "input" } 
    },
    {
      prop: "linkageNode",
      label: "联动节点",
      width: 250,
    },
    {
      prop: "area",
      label: "所属区域",
    },
    {
      prop: "line",
      label: "点位",
    },
    {
      prop: "linkageEquipmentCode",
      label: "联动设备编号",
    },
    {
      prop: "linkageEquipmentName",
      label: "联动设备名称",
    },
    {
      prop: "controlStatus",
      label: "控制状态",
    },
    {
      prop: "comment",
      label: "备注",
    },
    {
      prop: "createBy",
      label: "创建人",
    },
    {
      prop: "createTime",
      label: "创建时间",
    },
    { prop: "operation", label: "操作", fixed: "right", width: 160 }
  ];