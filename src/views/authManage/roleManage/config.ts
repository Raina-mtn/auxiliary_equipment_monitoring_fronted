
import { ColumnProps } from "@/components/ProTable/interface";
export const columns: ColumnProps[] = [
  { type: "index", label: "序号", width: 80 },
  {
    prop: "roleName",
    label: "角色名称",
    search: { el: "input", key: 'roleNameLike' }
  },
  {
    prop: "roleDesc",
    label: "角色描述"
  },
  {
    prop: "createTime",
    label: "创建时间",
    search: {
      el: "date-picker",
      props: {
        type: 'daterange'
      }
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
]; 