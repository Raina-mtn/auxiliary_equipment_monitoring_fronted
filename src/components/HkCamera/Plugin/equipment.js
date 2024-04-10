import Camera from './camera';
import CommunicateWidthIframe from './communicate'
import { pending } from './utils'
export default class Equipment {
    loginStatus = 'default' // succeed, fail
    channels = []
    loginCB = {
        succeed: [],
        fail: []
    }
    constructor({ id, ip, port, username, password, data, channels = [] }) {
        this.id = id
        this.ip = ip
        this.port = port
        this.username = username
        this.password = password
        this.data = data
        this.channels = channels
    }

    getCameras() {
        return new Promise(async (resolve, reject) => {
            let szInfo = `equipment (${this.ip} ${this.port} ${this.username} ${this.password}) getCameras: `;
            try {
                await this.login();
                await pending(1000);
                if (!this.channels.length) {
                    this.channels = await this.getAllChannel();
                }
                const cameras = this.channels.reduce((state, cur) => {
                    state.push({ id: this.id, ip: this.ip, port: this.port, username: this.username, data: this.data, channel: cur })
                    return state
                }, [])
                szInfo = szInfo + '成功'
                resolve(cameras)
            } catch (error) {
                szInfo = szInfo + '失败' + error
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }

        })
    }

    async login() {
        return new Promise(async (resolve, reject) => {
            let szInfo = `equipment (${this.ip} ${this.port} ${this.username} ${this.password}) login: `;
            try {
                if (this.loginStatus == 'loading') {
                    szInfo = szInfo + '设备登录中'
                    return reject(szInfo)
                }
                this.loginStatus = 'loading'
                await CommunicateWidthIframe.p_connect({ connectType: 'login', params: { ip: this.ip, port: this.port, username: this.username, password: this.password } })
                this.loginStatus = 'succeed'
                szInfo = szInfo + '成功'
                resolve(szInfo)
            } catch (error) {
                szInfo = szInfo + '失败' + error
                this.loginStatus = 'fail'
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    asyncLogin = (() => {
        let loginCB = {
            succeed: [],
            fail: []
        }
        let isLoading = false
        return async function () {
            return new Promise(async (resolve, reject) => {
                loginCB.succeed.push(resolve)
                loginCB.fail.push(reject)

                if (!isLoading) {
                    isLoading = true
                    try {
                        const res = await this.login()
                        loginCB.succeed.map(fun => fun(res))
                    } catch (error) {
                        loginCB.fail.map(fun => fun(error))
                    } finally {
                        loginCB.succeed = []
                        loginCB.fail = []
                        isLoading = false
                    }
                }
            })
        }
    })()

    async getAllChannel() {
        return Promise.all([
            // this.GetAnalogChannelInfo(), 
            this.GetDigitalChannelInfo(),
            // this.GetZeroChannelInfo()
        ]).then(res => {
            const channle = res.flat();
            if (channle.length) {
                return channle
            } else {
                return []
            }
        })
    }

    // async GetAnalogChannelInfo() {
    //     return new Promise((resolve, reject) => {
    //         WebVideoCtrl.I_GetAnalogChannelInfo(this.ip, {
    //             success: function (xmlDoc) {
    //                 console.log('GetAnalogChannelInfo sucess>>>', xmlDoc)
    //                 resolve([])
    //             },
    //             error: function (oError) {
    //                 console.warn('GetAnalogChannelInfo error>>>', oError)
    //                 resolve([])
    //             }
    //         });
    //     })
    // }

    async GetDigitalChannelInfo() {
        console.log('GetDigitalChannelInfo>>>')
        return new Promise((resolve, reject) => {
            CommunicateWidthIframe.connect({ connectType: 'GetDigitalChannelInfo', params: { ip: this.ip } }).then(res => {
                resolve(res)
            }).catch(error => {
                console.log('GetDigitalChannelInfo error>>>', error)
                reject(error)
            })
        })
    }

    // async GetZeroChannelInfo() {
    //     return new Promise((resolve, reject) => {
    //         WebVideoCtrl.I_GetZeroChannelInfo(this.ip, {
    //             success: function (xmlDoc) {
    //                 let oSel = []
    //                 var oChannels = $(xmlDoc).find("ZeroVideoChannel");
    //                 $.each(oChannels, function (i) {
    //                     var id = $(this).find("id").eq(0).text(),
    //                         name = $(this).find("name").eq(0).text();
    //                     console.log('GetZeroChannelInfo>>>>', id)
    //                     if ("" == name) {
    //                         name = "Zero Channel " + (i < 9 ? "0" + (i + 1) : (i + 1));
    //                     }
    //                     if ("true" == $(this).find("enabled").eq(0).text()) {// 过滤禁用的零通道
    //                         oSel.push(id)
    //                     }
    //                 });
    //                 resolve(oSel)
    //             },
    //             error: function (oError) {
    //                 console.log('GetZeroChannelInfo error>>>', oError)
    //                 resolve([])
    //             }
    //         });
    //     })
    // }
}