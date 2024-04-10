import {getAssetsImge} from '@/utils/index'

export const todoConfig = [
    {url: getAssetsImge('icon_warn.png'), key: 'warnCount', name: '今日预警'},
    {url: getAssetsImge('icon_done.png'), key: 'warnCount1', name: '今日预警'},
    {url: getAssetsImge('icon_todo.png'), key: 'warnCount2', name: '今日预警'},
]

export const alarmConfig = [
    {label: "区域", key: "monitorDateTime"},
    {label: "点位", key: "monitorDateTime1"},
    {label: "审核状态", key: "monitorDateTime2"},
    {label: "告警时间", key: "monitorDateTime3"},
]
