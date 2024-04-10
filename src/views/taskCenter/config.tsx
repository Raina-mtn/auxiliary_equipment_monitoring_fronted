import { apiGetListWarnLevel } from "@/api/interface/dataAnalyse/dataAnalyse";
import { apiGetWarnType } from "@/api/interface/taskCenter";
import { ColumnProps } from "@/components/ProTable/interface";



export const columns: ColumnProps[] = [
  { type: "selection", fixed: "left", width: 30 },
  { type: "index", label: "序号", width: 55 },
  {
    prop: 'areaName',
    label: '区域名称',
  },
  {
    prop: 'pointName',
    label: '点位名称',
  },
  {
    prop: "primaryEquipmentName",
    label: "设备名称",

  },
  {
    prop: "primaryEquipmentId",
    label: "设备编号",
  },
  {
    prop: 'equipmentName',
    label: '传感器名称',
    search: {
      el: "input",
      key: 'equipmentName',
      order: 1,
      props: {
        maxlength: "50"
      }
    },
  },
  {
    prop: 'equipmentCode',
    label: '传感器编号',
    search: {
      el: "input",
      order: 0,
      key: 'equipmentCode',
      props: {
        maxlength: "50"
      }
    }
  },
  {
    prop: 'warnTargetName',
    label: '告警类型',
    search: { el: "select", key: 'warnTargetName' },
    enum: async () => {
      const res = await apiGetWarnType()
      res.data.list = res.data
      return new Promise((resolve) => {
        resolve({ data: res.data })
      })
    },
    fieldNames: {
      label: 'name',
      value: 'name'
    },
  },
  {
    prop: 'warnLevelId',
    label: '告警等级',
    search: { el: "select", key: 'warnLevelId' },
    enum: async () => {
      const res = await apiGetListWarnLevel()
      res.data.list = res.data
      return new Promise((resolve) => {
        resolve({ data: res.data })
      })
    },
    fieldNames: {
      label: 'name',
      value: 'id'
    },
    render: ({ row }) => {
      let color, text;
      switch (row.warnLevelId) {
        case 1:
          color = '#ffcd40';
          text = '提示';
          break;
        case 2:
          color = '#7e57c2';
          text = '一般';
          break;
        case 3:
          color = '#FF0000';
          text = '严重';
          break;
        case 4:
          color = '#FF0000';
          text = '故障';
          break;
        case 5:
          color = '#FF0000';
          text = '告警';
          break;
        default:
          text = '--';
          break;
      }
      return (
        <div style={{ color }}>{text}</div>
      );
    }
  },
  {
    prop: 'warnTime',
    label: '告警时间',
    search: {
      el: 'date-picker',
      order: 4,
      props: {
        type: 'datetimerange',
        'value-format': 'YYYY-MM-DD HH:mm:ss'
      },
    }

  },

  // {
  //   prop: "equipmentStatus",
  //   label: "传感器状态",
  //   search: { el: "select", order: 2 },
  //   enum: [
  //     { label: '正常', value: "0" },
  //     { label: '故障', value: "1" }
  //   ],
  //   render: ({ row }) => {
  //     return (
  //       <div style={{ color: row.equipmentStatus === "1" ? '#FF0000' :  '#69EF00'}}>
  //         {row.equipmentStatus === "1" ?  '故障': '正常'}
  //       </div>
  //     )
  //   }
  // },
  {
    prop: 'distantReading',
    label: '遥测值',
    render: ({ row }) => {
      const data = `${row.distantReading}${row.distantReadingUnit}`
      return (
        <>
          {row.distantReading ? <div>{data}</div> : <div>--</div>}
        </>
      )
    }
  },
  {
    prop: 'limitRange',
    label: '越限范围',
    render: ({ row }) => {
      let isShow
      if (row.lowerThreshold && row.upperThreshold) {
        isShow = true
      } else {
        isShow = false
      }
      const limit = `${row.lowerThreshold}${row.lowerUnit}-${row.upperThreshold}${row.upperUnit}`;
      return (<>
        {isShow ? <div>{limit}</div> : <div>--</div>}
      </>
      )
    }
  },
  {
    prop: 'telemetryValueOffset',
    label: '偏移量',
  },
  {
    prop: 'checkStatus',
    label: '确认状态',
    enum: [
      { label: '已审核', value: 1 },
      { label: '待审核', value: 0 },
    ],
    render: ({ row }) => {
      return (
        <div style={{ color: row.checkStatus ? '#69EF00' : '#FF0000' }}>
          {row.checkStatus ? '已审核' : '待审核'}
        </div>
      )
    }
  },
  {
    prop: 'linkageIncidentCode',
    label: '联动事件',
  },
  {
    prop: "operation",
    label: "操作",
    fixed: "right",
    width: 276,

  },
]

