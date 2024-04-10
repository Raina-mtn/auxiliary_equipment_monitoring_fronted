import { getAssetsImge } from '@/utils'
import { ColumnProps } from "@/components/ProTable/interface";
import { list } from '@/api/interface/system/point'

type HeaderPropsItem = {
    name: string
    image: string
    key: 'totalAccess' | 'onlineDevice' | 'offlineDevice' | 'deviceOnlineRate'
}
export const headerConfig: HeaderPropsItem[] = [
    { name: '总接入数(路)', image: getAssetsImge('stream_card1.png'), key: 'totalAccess' },
    { name: '在线设备数', image: getAssetsImge('stream_card2.png'), key: 'onlineDevice' },
    { name: '离线设备数', image: getAssetsImge('stream_card1.png'), key: 'offlineDevice' },
    { name: '设备在线率', image: getAssetsImge('stream_card1.png'), key: 'deviceOnlineRate' }
]

export const columns: ColumnProps[] = [
    {
        prop: "title",
        label: "设备名称",
        search: { el: "input", key: 'equipmentName' }
    },
    {
        prop: "code",
        label: "设备编号 ",
        search: { el: "input", key: 'equipmentCode' }
    },
    {
        prop: "lineName",
        label: "安装点位",
        enum: list,
        search: { el: "select", key: 'lineId' },
        fieldNames: { label: "name", value: "id" }
    },
    {
        prop: "channels",
        label: "接入路数",
    },
    { prop: "status", label: "设备状态", search: { el: "select", key: 'equipmentStatus' }, },
    { prop: "modelName", label: "设备型号" },
    {
        prop: "categoryName",
        label: "设备类型",
    }, {
        prop: "relationEquipment",
        label: "关联设备"
    }
];