
import { ColumnProps } from "@/components/ProTable/interface";

export const columns: ColumnProps[] = [
  { type: "selection", fixed: "left", width: 30 },
  { type: "index", label: "序号", width: 80 },
  {
    prop: "linkageEventCode",
    label: "联动事件",
    search: { el: 'input', key: 'eventCode' }
  },
  {
    prop: "linkageScenarios",
    label: "联动场景",
  },
  {
    prop: "scenarioEquipments",
    label: "设备",
  },
  {
    prop: "linkageNode",
    label: "联动节点",
  },
  {
    prop: "areaName",
    label: "区域",
  },
  {
    prop: "lineName",
    label: "点位",
  },
  {
    prop: "linkageEquipmentCode",
    label: "联动设备编号",
    search: { el: 'input', }
  },
  {
    prop: "linkageEquipmentName",
    label: "联动设备名称",
    search: { el: 'input' }
  },
  {
    prop: "controlStatus",
    label: "控制状态",
  },
  {
    prop: "linkageTime",
    label: "联动时间",
    search: {
      el: 'date-picker',
      order: 5,
      props: {
        type: 'datetimerange',
        'value-format': 'YYYY-MM-DD HH:mm:ss'
      },
    }
  },
  {
    prop: "linkageResult",
    label: "联动结果",
    search: { el: 'select', key: 'result', order: 4, },
    enum: [
      { label: '成功', value: 'SUCCESS' },
      { label: '失败', value: 'FAILED' },
      { label: '操作中', value: 'IN_OPERATION' }
    ],
    render: ({ row }) => {
      return (
        <div style={{ color: row.connectState ? '#69EF00' : '#FF0000' }}>{row.linkageResult}</div>
      )
    }
  },
  {
    prop: "comment",
    label: "备注",
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
];
