
import { ColumnProps } from "@/components/ProTable/interface";
import { categoryList } from '@/api/interface/device'

export const columns: ColumnProps[] = [
  { type: "selection", fixed: "left", width: 80 },
  { type: "index", label: "序号", width: 80 },
  {
    prop: "area",
    label: "区域",
    render: ({ row }) => {
      return (
        <div>{row.area ? row.area[0] : '--'}</div>
      )
    }
  },
  {
    prop: "deployAreaId",
    label: "点位名称",
    search: { el: "input" },
    render: ({ row }) => {
      return (
        <div>{row.area ? row.area[1] : '--'}</div>
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
    label: "设备类型",
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
    render: ({ row }) => {
      return (
        <div style={{ color: row.connectState ? '#69EF00' : '#FF0000' }}>{row.connectState ? '在线' : '离线'}</div>
      )
    }
  },
  {
    prop: "signCount",
    label: "是否挂牌",
    render: ({ row }) => {
      return (
        <div style={{ color: row.signCount > 0 ? '#FF0000' : '' }}>{row.signCount > 0 ? '是' : '否'}</div>
      )
    }
  },
  {
    prop: "memo",
    label: "备注",
  },
  {
    prop: "imageList",
    label: "图片",
    render: ({ row }) => {
      // const previewList = row.imageList && row.imageList.map((item: string) => { return import.meta.env.VITE_APP_BASE_API + item })
      return (
        <div class='flex'>{row.imageList && row.imageList.map((item: string, index: number) => {
          return <el-image
            src={import.meta.env.VITE_APP_BASE_API + item}
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

export const sensorDetailcolumns: ColumnProps[] = [
  {
    prop: "area",
    label: "区域",
    render: ({ row }) => {
      return (
        <div>{row.area ? row.area[0] : '--'}</div>
      )
    }
  },
  {
    prop: "deployAreaId",
    label: "点位名称",
    render: ({ row }) => {
      return (
        <div>{row.area ? row.area[1] : '--'}</div>
      )
    }
  },
  {
    prop: "code",
    label: "传感器编号"
  },
  {
    prop: "title",
    label: "传感器名称"
  },
  {
    prop: "connectState",
    label: "设备状态",
    render: ({ row }) => {
      return (
        <div style={{ color: row.connectState ? '#69EF00' : '#FF0000' }}>{row.connectState ? '在线' : '离线'}</div>
      )
    }
  },
  {
    prop: "categoryName",
    label: "传感器类型",
    search: { el: "select" },
    enum: async () => {
      const res = await categoryList({ grade: 2, pageIndex: 1, pageSize: 100000 })
      return new Promise((resolve) => {
        resolve({ data: res.data })
      })
    },
    fieldNames: {
      label: 'name',
      value: 'id'
    }
  }
];