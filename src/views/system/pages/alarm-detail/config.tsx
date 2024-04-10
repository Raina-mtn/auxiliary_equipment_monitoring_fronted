import { ColumnProps } from "@/components/ProTable/interface";
import dayjs from "dayjs";

export function ifLock(row: { lastLockedTime: null | string }) {
  if (!row.lastLockedTime) return false
  if (row.lastLockedTime) {
    return dayjs().isBefore(dayjs(row.lastLockedTime))
  }
}

export const columns: ColumnProps[] = [
  {
    prop: "state",
    label: "告警等级",
    render: ({ row }) => {
      return (<span class={!ifLock(row) ? 'text-green-400' : 'text-red-400'} > {!ifLock(row) ? '正常' : '冻结'}</span>)
    }
  },
  {
    prop: "mobileLike",
    label: "告警目标",
  },
  {
    prop: "deptName",
    label: "阈值",
  },
  {
    prop: "role",
    label: "备注",
    render: ({ row }) => {
      return row.roleList && row.roleList.map((v: { roleName: string }) => v.roleName).join('/')
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 180 }
];


export const checkPhone = (_rule: any, value: any, callback: any) => {
  const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
  if (!value) {
    return callback(new Error('电话号码不能为空'))
  }
  setTimeout(() => {
    // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
    // 所以在前面加了一个+实现隐式转换

    if (!Number.isInteger(+value)) {
      callback(new Error('请输入数字值'))
    } else {
      if (phoneReg.test(value)) {
        callback()
      } else {
        callback(new Error('电话号码格式不正确'))
      }
    }
  }, 100)
}
export const checkEmail = (_rule: any, value: any, callback: any) => {
  const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/

  setTimeout(() => {
    if (!value || mailReg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的邮箱格式'))
    }
  }, 100)
}


