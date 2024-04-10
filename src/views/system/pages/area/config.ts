
import { ColumnProps } from "@/components/ProTable/interface";
export const columns: ColumnProps[] = [
  { type: "selection", fixed: "left", width: 80 },
  { type: "index", label: "序号", width: 80 },
  {
    prop: "name",
    label: "区域名称",
    search: { el: "input", key: 'nameLike' }
  },
  {
    prop: "code",
    label: "区域编号",
    search: { el: "input", key: 'codeLike' }
  },
  {
    prop: "memo",
    label: "备注",
  },
  {
    prop: "createTime",
    label: "创建时间",
  },
  {
    prop: "createBy",
    label: "创建人",
  },
  { prop: "operation", label: "操作", fixed: "right", width: 360 }
];