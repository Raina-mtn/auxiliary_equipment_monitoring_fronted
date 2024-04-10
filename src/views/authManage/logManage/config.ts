
import { ColumnProps } from "@/components/ProTable/interface";
export const columns: ColumnProps[] = [
  { type: "index", label: "序号", width: 80 },
  {
    prop: "event",
    label: "日志内容",
  },
  {
    prop: "userId",
    label: "操作人ID",
  },
  {
    prop: "accessUser",
    label: "操作人名称",
    search: { el: "input", key: 'accessUserLike' }
  },
  {
    prop: "accessIp",
    label: "IP",
  },
  {
    prop: "event",
    label: "事件类型",
  },
  {
    prop: "module",
    label: "模块",
  },
  {
    prop: "accessTime",
    label: "创建时间",
    search: {
      el: 'date-picker',
      props: {
        type: 'datetimerange',
        'value-format': 'YYYY-MM-DD HH:mm:ss'
      },
      order: 1
    }
  },
]; 