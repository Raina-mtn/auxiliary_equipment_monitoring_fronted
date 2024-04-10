import { defineStore } from "pinia";
import { getSm2PublicKey } from '@/api/interface'
import { sm2, sm3 } from 'sm-crypto'

type CryptoStateType = { enable: number | null, cipherMode: number, sm2PublicKey: string, uiPrivateKey: string }
export const cryptoStore = defineStore({
    id: 'crypto', // 必须指明唯一的pinia仓库的id
    state: (): CryptoStateType => ({
        enable: null,
        cipherMode: 0,
        sm2PublicKey: '', // 系统后台公钥
        uiPrivateKey: (sm2.generateKeyPairHex()).privateKey // 前端UI私钥
    }),
    actions: {
        async initSm2PublicKey() {
            if (!this.sm2PublicKey) {
                try {
                    const { data } = await getSm2PublicKey()
                    const { publicKey, enable } = JSON.parse(data)
                    this.sm2PublicKey = publicKey
                    this.enable = enable
                } catch (error) {
                    console.error('getSm2PublicKey:', error)
                }
            }
            return this.sm2PublicKey;
        },

        // 加密字段
        async getSm2DataHex(value: any) {
            const data = JSON.stringify(value) + '/' + sm3(JSON.stringify(value))
            return '04' + sm2.doEncrypt(data, this.sm2PublicKey, this.cipherMode)
        },

        // 解密
        getSm2DataByString(dataHex: string) {
            dataHex = dataHex.substring(2).toLocaleLowerCase()
            return sm2.doDecrypt(dataHex, this.uiPrivateKey, 1)
        },

        // 加密传参
        async encryptParams(data: any, forceEncrypto?: boolean) {
            // 检查是否获取过
            await this.initSm2PublicKey()

            let encryptoEnable = this.enable
            if (forceEncrypto != null) {
                encryptoEnable = forceEncrypto ? 1 : 0;
            }

            let returnData = data
            if (encryptoEnable == 1 && Object.prototype.toString.call(data) == '[object FormData]') {
                returnData = new FormData()
                for (const [key, value] of data.entries()) {
                    let encryptValue = await this.getSm2DataHex(value)
                    returnData.set(key, encryptValue)
                }
            } else if (encryptoEnable == 1 && Object.prototype.toString.call(data) == '[object Object]') {
                returnData = await this.getSm2DataHex(data)
            }
            return returnData
        }
    },
})
