import { getAssetsImge } from "@/utils"

export const equipmentTypeList = [
    { label: '油色谱', code: 'OIL_CHROMATOGRAPHY' },
    { label: '铁芯接地电流', code: 'CORE_GROUND_CURRENT' },
    { label: 'SF6', code: 'SF6' },
    { label: '局放', code: 'PARTIAL_DISCHARGE' },
]

export interface DataItem {
    status: 0 | 1
    num: string
    unit: string
    name: string
    equipmentId: string
    equipmentName: string
    icon: string
}
// 油色谱展示项
export const oilShowItems: Record<string, any> = {
    'C2H2': {
        unit: 'ppm', icon: getAssetsImge('gas/C2H2.png'), name: '乙炔'
    },
    'C2H4': {
        unit: 'ppm', icon: getAssetsImge('gas/C2H4.png'), name: '乙烯'
    },
    'C2H6': {
        unit: 'ppm', icon: getAssetsImge('gas/C2H6.png'), name: '乙烷'
    },
    'CH4': {
        unit: 'ppm', icon: getAssetsImge('gas/CH4.png'), name: '甲烷'
    },
    'CO': {
        unit: 'ppm', icon: getAssetsImge('gas/CO.png'), name: '一氧化碳'
    },
    'CO2': {
        unit: 'ppm', icon: getAssetsImge('gas/CO2.png'), name: '二氧化碳'
    },
    'CnH2n': {
        unit: 'ppm', icon: getAssetsImge('gas/CnH2n.png'), name: '总烃'
    },
    'H2': {
        unit: 'ppm', icon: getAssetsImge('gas/H2.png'), name: '氢气'
    },
    'H2O': {
        unit: 'ppm', icon: getAssetsImge('gas/H2O.png'), name: '微水'
    }
}
// 铁芯接地电流展示型
export const coreShowItems: Record<string, any> = {
    'iron-current': {
        unit: 'mA', icon: getAssetsImge('electricity/power.png'), name: '铁芯接地电流'
    }
}
// SF6展示型
export const SF6ShowItems: Record<string, any> = {
    'sf6-concentration': {
        unit: 'mA', icon: getAssetsImge('electricity/sf6.png'), name: '六氟化硫'
    }
}
// 局放展示型
export const parShowItems: Record<string, any> = {
    'discharge-value1': {
        unit: 'ppm', icon: getAssetsImge('electricity/jufang.png'), name: '局放'
    }
}
