import { unref } from 'vue'
import { isObject, isArray } from 'lodash-es'
import { FieldNamesProps } from "@/components/ProTable/interface";

// 深度合并
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
    let key: string
    for (key in target) {
        src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key])
    }
    return src
}

const hexList: string[] = []
for (let i = 0; i <= 15; i++) {
    hexList[i] = i.toString(16)
}

export function buildUUID(): string {
    let uuid = ''
    for (let i = 1; i <= 36; i++) {
        if (i === 9 || i === 14 || i === 19 || i === 24) {
            uuid += '-'
        } else if (i === 15) {
            uuid += 4
        } else if (i === 20) {
            uuid += hexList[(Math.random() * 4) | 8]
        } else {
            uuid += hexList[(Math.random() * 16) | 0]
        }
    }
    return uuid.replace(/-/g, '')
}

let unique = 0

export function buildShortUUID(prefix = ''): string {
    const time = Date.now()
    const random = Math.floor(Math.random() * 1000000000)
    unique++
    return prefix + '_' + random + unique + String(time)
}

export function isProdMode(): boolean {
    return import.meta.env.PROD
}

export function getDynamicProps<T, U>(props: T): Partial<U> {
    const ret: Recordable = {}

    Object.keys(props as object).map((key) => {
        ret[key] = unref((props as Recordable)[key])
    })

    return ret as Partial<U>
}

export function setObjToUrlParams(baseUrl: string, obj: any): string {
    let parameters = ''
    for (const key in obj) {
        parameters += key + '=' + encodeURIComponent(obj[key]) + '&'
    }
    parameters = parameters.replace(/&$/, '')
    return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters
}

// 获取assets静态图片
export const getAssetsImge = (url: string) => {
    return new URL(`../assets/images/${url}`, import.meta.url).href
}


/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 字典列表
 * @param {Array} fieldNames label && value && children 的 key 值
 * @param {String} type 过滤类型（目前只有 tag）
 * @returns {String}
 * */
export function filterEnum(callValue: any, enumData?: any, fieldNames?: FieldNamesProps, type?: "tag") {
    const value = fieldNames?.value ?? "value";
    const label = fieldNames?.label ?? "label";
    const children = fieldNames?.children ?? "children";
    let filterData: { [key: string]: any } = {};
    // 判断 enumData 是否为数组
    if (Array.isArray(enumData)) filterData = findItemNested(enumData, callValue, value, children);
    // 判断是否输出的结果为 tag 类型
    if (type == "tag") {
        return filterData?.tagType ? filterData.tagType : "";
    } else {
        return filterData ? filterData[label] : "--";
    }
}

/**
* @description 递归查找 callValue 对应的 enum 值
* */
export function findItemNested(enumData: any, callValue: any, value: string, children: string) {
    return enumData.reduce((accumulator: any, current: any) => {
        if (accumulator) return accumulator;
        if (current[value] === callValue) return current;
        if (current[children]) return findItemNested(current[children], callValue, value, children);
    }, null);
}
/**
* @description 处理值无数据情况
* @param {*} callValue 需要处理的值
* @returns {String}
* */
export function formatValue(callValue: any) {
    // 如果当前值为数组，使用 / 拼接（根据需求自定义）
    if (isArray(callValue)) return callValue.length ? callValue.join(" / ") : "";
    return callValue ?? "";
}

/**
* @description 处理 prop，当 prop 为多级嵌套时 ==> 返回最后一级 prop
* @param {String} prop 当前 prop
* @returns {String}
* */
export function handleProp(prop: string) {
    const propArr = prop.split(".");
    if (propArr.length == 1) return prop;
    return propArr[propArr.length - 1];
}
/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 * @param {Object} row 当前行数据
 * @param {String} prop 当前 prop
 * @returns {*}
 * */
export function handleRowAccordingToProp(row: { [key: string]: any }, prop: string) {
    if (!prop.includes(".")) return row[prop] ?? "";
    prop.split(".").forEach(item => (row = row[item] ?? ""));
    return row;
}  