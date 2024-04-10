
import {  ColumnProps} from "@/components/ProTable/interface";
import { list } from '@/api/interface/system/area'

export const columns:ColumnProps[] = [
    { type: "selection", fixed: "left", width: 80 },
    { type: "index", label: "序号", width: 80 },
    {
      prop: "name",
      label: "点位名称",
      search: { el: "input", key: 'nameLike' }
    },
    {
      prop: "code",
      label: "点位编号",
      search: { el: "input", key: 'codeLike' } 
    },
    {
      prop: "zone",
      label: "所属区域",
      search: { el: "select", order: 1, key: 'rootAreaId' },
      enum: async () => {
        const res = await list({level: 1, pageIndex: 1, pageSize: 100000})
        return new Promise((resolve) => {
          resolve({ data: res.data })
        })
      },
      fieldNames: {
        label: 'name',
        value: 'id'
      }
    },
    {
      prop: "masterEquipmentList",
      label: "绑定设备名称",
      render: ({row}) => {
        return (
          <span>{row.masterEquipmentList && row.masterEquipmentList.map((item: {title: string}, index: number) => {
            return <span>{item.title}{index === row.masterEquipmentList.length -1 ? '' : ','}</span>
          })}</span>
        )
      }
    },
    {
      prop: "code",
      label: "绑定设备编号",
      render: ({row}) => {
        return (
          <span>{row.masterEquipmentList && row.masterEquipmentList.map((item: {code: string}, index: number) => {
            return <span>{item.code}{index === row.masterEquipmentList.length -1 ? '' : ','}</span>
          })}</span>
        )
      }
    },
    {
      prop: "auxiliaryEquipmentList",
      label: "绑定传感器名称",
      render: ({row}) => {
        return (
          <span>{row.auxiliaryEquipmentList && row.auxiliaryEquipmentList.map((item: {title: string}, index: number) => {
            return <span>{item.title}{index === row.auxiliaryEquipmentList.length -1 ? '' : ','}</span>
          })}</span>
        )
      }
    },
    {
      prop: "auxiliaryEquipmenCode",
      label: "绑定传感器编号",
      render: ({row}) => {
        return (
          <span>{row.auxiliaryEquipmentList && row.auxiliaryEquipmentList.map((item: {code: string}, index: number) => {
            return <span>{item.code}{index === row.auxiliaryEquipmentList.length -1 ? '' : ','}</span>
          })}</span>
        )
      }
    },
    {
      prop: "memo",
      label: "备注",
    },
    {
      prop: "creator",
      label: "创建人",
    },
    {
      prop: "createTime",
      label: "创建时间",
    },
    { prop: "operation", label: "操作", fixed: "right", width: 160 }
  ];