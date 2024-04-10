import { ColumnProps } from "@/components/ProTable/interface";
export const equipmentTypeList = [
  { label: '锁控任务', code: 'A' },
  { label: '开锁记录', code: 'B' },
  { label: '权限管理', code: 'C' },
]

export const lockcolumns1: ColumnProps[] = [
  { type: "index", label: "序号", width: 80 },
  {
    prop: "taskCode",
    label: "任务编号",
    search: { el: 'input' },
  },
  {
    prop: "name",
    label: "任务名称"
  },
  {
    prop: "taskType",
    label: "任务类型"
  },
  {
    prop: "times",
    label: "计划执行时间",
    search: {
      el: 'date-picker',
      props: {
        type: 'datetimerange',
        'value-format': 'YYYY-MM-DD HH:mm:ss'
      },
    },
    isShow:false
  },
  {
    prop: "scheduledStartTime",
    label: "计划开始时间",
  },
  {
    prop: "equipmentCodes",
    label: "关联设备"
  },
  {
    prop: "comment",
    label: "备注"
  },
  {
    prop: "status",
    label: "状态"
  },
  {
    prop: "createBy",
    label: "创建人",
    search: { el: 'input', order:2  }
  },
  {
    prop: "createTime",
    label: "创建时间"
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
];
export const lockcolumns2: ColumnProps[] = [
  { type: "index", label: "序号", width: 80 },
  {
    prop: "taskCode",
    label: "任务编号",
    search: { el: 'input' },
  },
  {
    prop: "name",
    label: "任务名称",

  },
  {
    prop: "taskType",
    label: "任务类型",
  },
  {
    prop: "unlockTime",
    label: "开锁时间",
  },
  {
    prop: "areaName",
    label: "区域",
  }
  ,
  {
    prop: "lineName",
    label: "点位",
  },
  {
    prop: "equipmentCode",
    label: "设备编号",
    search: { el: 'input' },
  },
  {
    prop: "equipmentName",
    label: "设备名称",
    search: { el: 'input'},
  },
  {
    prop: "times",
    label: "开锁时间",
    search: {
      el: 'date-picker',
      props: {
        type: 'datetimerange',
        'value-format': 'YYYY-MM-DD HH:mm:ss'
      },
    },
    isShow:false
  },
  {
    prop: "executeResult",
    label: "执行结果",
    search: {
      el: 'select',
    },
    enum: [
      { label: '成功', value: 'SUCCESS' },
      { label: '失败', value: 'FAILED' },
    ],
    isShow:false
  },
  {
    prop: "unlockStatus",
    label: "开锁状态",
  },
  {
    prop: "comment",
    label: "备注",
  },
];