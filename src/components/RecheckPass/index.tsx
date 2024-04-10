
import { apiRecheckPass } from '@/api/interface'
import { ElMessage, ElMessageBox } from "element-plus";
import { userStore } from '@/store'
const useUserStore = userStore()
// 二次确认
export function recheckPass() {
    return new Promise<void>((resolve, reject) => {
        ElMessageBox.prompt('请输入您的用户密码', '重要操作二次确认', {
            inputPattern: /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@;:])|(?=.*[A-Z])(?=.*[0-9])(?=.*[!@;:])|(?=.*[a-z])(?=.*[0-9])(?=.*[!@;:]))/,
            inputErrorMessage: '密码应为大写字母、小写字母、数字、特殊字符中三种或三种以上的组合',
            inputType: 'password'
        })
            .then(async ({ value }) => {
                const params = {
                    password: value,
                    userId: useUserStore.userInfo.userId
                }
                const res = await apiRecheckPass(params)
                if (res.data) {
                    resolve()
                } else {
                    ElMessage.error('密码不正确')
                    reject()
                }
            })
    })

}