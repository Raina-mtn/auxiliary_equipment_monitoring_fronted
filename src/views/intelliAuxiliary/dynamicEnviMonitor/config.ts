// 监测状态
export const monitorState = [
    { label: '正常', value: 0 },
    { label: '告警', value: 1 }
]

// 开关状态
export const switchState = [
    { label: '开', value: false },
    { label: '关', value: true }
]

export const equipmentTypeList = [
    { label: '水浸', code: 'WATER_IMMERSION', icon: 'icon-a-shuijin1' },
    {
        label: '水位', code: 'WATER_MONITOR', icon: 'icon-shuiwei1',
        showItems: [
            { name: '水位', key: 'well-water', unit: 'm', icon: 'icon-shuiwei1' },
        ]
    },
    { label: '风机', code: 'AIR_BLOWER', icon: 'icon-a-fengji1' },
    { label: '水泵', code: 'WATER_PUMP', icon: 'icon-shuibeng1' },
    {
        label: '空调', code: 'AIR_CONDITIONING', icon: 'icon-kongtiao1',
        showItems: [
            { name: '温度', key: 'temperature', unit: '℃', icon: 'icon-wendu' },
            { name: '湿度', key: 'humidity', unit: '%', icon: 'icon-daqishidu' },
        ]
    },
    { label: '照明', code: 'LIGHTING', icon: 'icon-zhaoming1' },
    {
        label: 'SF6', code: 'SF6', icon: 'icon-SF6',
        showItems: [
            { name: 'SF6', key: 'sf6-concentration', unit: 'ppm', icon: 'icon-SF6' },
            { name: 'O2', key: 'o2-concentration', unit: '%', icon: 'icon-o2' }
        ]
    },
    {
        label: '微气象', code: 'MICROMETEOROGRAPH', icon: 'icon-weiqixiang',
        showItems: [
            { name: '温度', key: 'temp', unit: '℃', icon: 'icon-wendu' },
            { name: '湿度', key: 'humi', unit: '%', icon: 'icon-daqishidu' },
            { name: '风向', key: 'wind-vel', unit: '°', icon: 'icon-fengxiang' },
            { name: '风速', key: 'wind-dir', unit: 'm/s', icon: 'icon-wind-speed-high' },
            { name: '雨量', key: 'rainfall', unit: 'mm', icon: 'icon-jiangyuliang' }
        ]
    },
    {
        label: '温湿度传感器', code: 'TEMPERATURE_HUMIDITY_SENSOR', icon: 'icon-wenshidu_line',
        showItems: [
            { name: '温度', key: 'indoor-temp', unit: '℃', icon: 'icon-wendu' },
            { name: '湿度', key: 'indoor-humi', unit: '%', icon: 'icon-daqishidu' },
        ]
    }
]