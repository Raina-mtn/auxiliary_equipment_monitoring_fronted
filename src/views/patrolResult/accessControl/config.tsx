import {  ColumnProps} from "@/components/ProTable/interface";
export const equipmentTypeList = [
    { label: '门禁管理', code: 'WATER_IMMERSION' },
    { label: '开门记录', code: 'AIR_BLOWER' },
    { label: '权限管理', code: 'WATER_PUMP' },
]

export const lockcolumns1:ColumnProps[] = [
    { type: "selection", fixed: "left", width: 80 },
    { type: "index", label: "序号", width: 80 },
    {
      prop: "area",
      label: "区域",
      render: ({row}) => {
        return (
          <div>{ row.area ? row.area[0] : '--' }</div>
        )
      }
    },
    {
      prop: "deployAreaId",
      label: "点位名称",
      search: { el: "input" },
      render: ({row}) => {
        return (
          <div>{ row.area ? row.area[1] : '--' }</div>
        )
      }
    },
    {
      prop: "code",
      label: "设备编号",
      search: { el: "input" } 
    },
    {
      prop: "title",
      label: "设备名称",
      search: { el: "input", key: 'titleLike' } 
    },
    { prop: "desc", label: "设备型号" },
    { 
      prop: "categoryName", 
      label: "设备类型" ,
      // render: ({row}) => {
      //   return (
      //     <div>{ row.grade === 1 ? '主设备' : (row.grade === 2 ? '传感器' : '') }</div>
      //   )
      // }
    },
    { 
      prop: "connectState", 
      label: "设备状态",
      search: { el: "select" },
      enum: [
        { label: '在线', value: true },
        { label: '离线', value: false }
      ],
      render: ({row}) => {
        return (
          <div style={{ color: row.connectState ? '#69EF00' : '#FF0000' }}>{ row.connectState ? '在线' : '离线' }</div>
        )
      }
    },
    {
      prop: "status",
      label: "是否挂牌",
    },
    {
      prop: "memo",
      label: "备注",
    },
    {
      prop: "imageList",
      label: "图片",
      render: ({row}) => {
        // const previewList = row.imageList && row.imageList.map((item: string) => { return import.meta.env.VITE_APP_BASE_API + item })
        return (
          <div class='flex'>{row.imageList && row.imageList.map((item: string, index: number) => {
            return <el-image 
              src={ import.meta.env.VITE_APP_BASE_API + item }
              // preview-src-list={previewList}
              style={{ width: '80px', height: '45px', marginLeft: index === 0 ? '0px' : '6px' }}
            >
            </el-image>
          })}</div>
        )
      }
    },
    { prop: "operation", label: "操作", fixed: "right", width: 330 }
];
export const lockcolumns2:ColumnProps[] = [
  { type: "index", label: "序号", width: 80 },
  {
    prop: "areaName",
    label: "区域",
  },
  {
    prop: "lineName",
    label: "点位",
    search: { el: "input",key:'lineNameLike' },
  },
  {
    prop: "equipmentCode",
    label: "门禁设备编号",
  },
  {
    prop: "userName",
    label: "人员",
    search: { el: "input",key:'userNameLike' } 
  },
  { prop: "cardNumber", label: "卡号", search: { el: "input",key: 'cardNumberLike' }  },
  {
    prop: "operateTime",
    label: "开门时间",
    search: {
      el: 'date-picker',
      props: {
        type: 'datetimerange',
        'value-format': 'YYYY-MM-DD HH:mm:ss'
      },
    },
  },
  { 
    prop: "status", 
    label: "开门状态",
    search: { el: "select",    order: 4,  },
    enum: [
      { label: '成功', value: 'SUCCESS' },
      { label: '失败', value: 'FAILED' }
    ],
  },
  {
    prop: "type",
    label: "门禁类型",
  },
  {
    prop: "comment",
    label: "备注",
  },
  {
    prop: "image",
    label: "图片",
    render: ({row}) => {
      return (
        <div class='flex'>{row.image && row.image.map((item: string, index: number) => {
          return <el-image 
            src={ import.meta.env.VITE_APP_BASE_API + item }
            style={{ width: '80px', height: '45px', marginLeft: index === 0 ? '0px' : '6px' }}
          >
          </el-image>
        })}</div>
      )
    }
  },
];