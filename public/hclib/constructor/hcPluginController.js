export default class HcPluginController {
    ele = null
    g_iWndIndex = 0

    constructor({ ele }) {
        if (ele) {
            this.ele = ele
        }
    }

    // 初始化插件参数及插入插件
    initPlugin() {
        return new Promise(async (resolve, reject) => {
            WebVideoCtrl.I_InitPlugin({
                bWndFull: true,     //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
                iWndowType: 0,
                cbSelWnd: function (xmlDoc) {
                    this.g_iWndIndex = parseInt($(xmlDoc).find("SelectWnd").eq(0).text(), 10);
                    var szInfo = "当前选择的窗口编号：" + this.g_iWndIndex;
                    console.log(szInfo);
                    window.parent.postMessage({ contentType: 'g_iWndIndex', params: { g_iWndIndex: this.g_iWndIndex } }, "*");
                },
                cbDoubleClickWnd: function (iWndIndex, bFullScreen) {
                    var szInfo = "当前放大的窗口编号：" + iWndIndex;
                    if (!bFullScreen) {
                        szInfo = "当前还原的窗口编号：" + iWndIndex;
                    }
                    console.log(szInfo);
                },
                cbEvent: function (iEventType, iParam1, iParam2) {
                    if (2 == iEventType) {// 回放正常结束
                        showCBInfo("窗口" + iParam1 + "回放结束！");
                    } else if (-1 == iEventType) {
                        showCBInfo("设备" + iParam1 + "网络错误！");
                    } else if (3001 == iEventType) {
                        clickStopRecord(g_szRecordType, iParam1);
                    }
                },
                cbInitPluginComplete: () => {
                    console.log('初始化海康插件成功>>>>>')
                    WebVideoCtrl.I_InsertOBJECTPlugin(this.ele).then(() => {
                        console.log('插入元素成功>>>>>')
                        resolve()
                    })
                }
            });
        })
    }

    resize = ({ width, height, left = 0, top = 0 }) => {
        if (!width) {
            width = $("body").width()
        }
        if (!height) {
            height = $("body").height()
        }
        return WebVideoCtrl.I_Resize(width, height, left, top)
    };

    // 插入到dom原生
    insetElement() {
        return new Promise(async (resolve, reject) => {
            try {
                await WebVideoCtrl.I_InsertOBJECTPlugin(this.ele)
                resolve('插入成功')
            } catch (error) {
                console.log('插入失败', this.ele)
                reject('插入失败')
                alert("插件初始化失败，请确认是否已安装插件；如果未安装，请双击开发包目录里的HCWebSDKPlugin.exe安装！");
            }
        })
    }

    // 窗口分割数
    async changeWndNum(iType) {
        iType = parseInt(iType, 10);
        return WebVideoCtrl.I_ChangeWndNum(iType)
    }

    // 登录设备
    async login(params) {
        const { ip, port, username, password } = params;
        return new Promise((resolve, reject) => {
            WebVideoCtrl.I_Login(ip, 1, port, username, password, {
                timeout: 3000,
                success: (xmlDoc) => {
                    setTimeout(() => {
                        // 登录后延迟下，不然后续操作失败
                        console.log(ip, '登录成功')
                        resolve()
                    }, 1000)
                },
                error: (oError) => {
                    if (2001 === oError.errorCode) {
                        console.log(ip, '已登录过')
                        resolve()
                    } else {
                        console.log(ip, '登录异常')
                        reject('登录失败！')
                    }
                }
            });
        })
    }

    async GetDigitalChannelInfo(params) {
        return new Promise((resolve, reject) => {
            WebVideoCtrl.I_GetDigitalChannelInfo(params.ip, {
                success: function (xmlDoc) {
                    let oSel = []
                    var oChannels = $(xmlDoc).find("InputProxyChannelStatus");
                    $.each(oChannels, function (i) {
                        var id = $(this).find("id").eq(0).text(),
                            name = $(this).find("name").eq(0).text(),
                            online = $(this).find("online").eq(0).text();
                        if ("false" == online) {// 过滤禁用的数字通道
                            return true;
                        }
                        if ("" == name) {
                            name = "IPCamera " + (i < 9 ? "0" + (i + 1) : (i + 1));
                        }
                        oSel.push(id)
                    });
                    resolve(oSel)
                },
                error: function (oError) {
                    resolve([])
                }
            });
        })
    }

    // 开始播放
    I_StartRealPlay = async ({ ip, iWndIndex, iStreamType, iChannelID, bZeroChannel }) => WebVideoCtrl.I_StartRealPlay(ip, {
        iWndIndex,
        iStreamType,
        iChannelID,
        bZeroChannel
    })

    // 获取播放状态
    I_GetWindowStatus = async ({ iWndIndex }) => WebVideoCtrl.I_GetWindowStatus(iWndIndex)

    // 停止
    I_Stop = async ({ iWndIndex }) => WebVideoCtrl.I_Stop({ iWndIndex })

    // 获取插件参数
    I_GetLocalCfg = async () => WebVideoCtrl.I_GetLocalCfg();

    // 设置本地参数
    I_SetLocalCfg = async (params) => WebVideoCtrl.I_SetLocalCfg(params)

    // 打开文件夹 iType 0：文件夹  1：文件
    I_OpenFileDlg = async (params) => WebVideoCtrl.I_OpenFileDlg(params)

    // 开始录像
    startRecord = async () => {
        return new Promise(async (resolve, reject) => {
            let szInfo = "plugin 开始录像: ";
            try {
                const oWndInfo = WebVideoCtrl.I_GetWindowStatus()
                if (!oWndInfo) {
                    szInfo = szInfo + '当前窗口未在播放'
                    return reject(szInfo)
                }
                const szFileName = `${new Date().getTime()}`;
                await WebVideoCtrl.I_StartRecord(szFileName, { bDateDir: true })
                szInfo = szInfo + '成功'
                resolve(szInfo)
            } catch (error) {
                szInfo = szInfo + '失败' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }

        })
    }

    // 停止
    endRecord = async () => {
        return new Promise(async (resolve, reject) => {
            let szInfo = "plugin 停止录像: ";
            try {
                const oWndInfo = WebVideoCtrl.I_GetWindowStatus()
                if (!oWndInfo) {
                    szInfo = szInfo + '当前窗口未在播放'
                    return reject(szInfo)
                }
                await WebVideoCtrl.I_StopRecord()
                szInfo = szInfo + '成功'
                resolve(szInfo)
            } catch (error) {
                szInfo = szInfo + '失败' + error
                resolve(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    // 回放
    I_StartPlayback = async ({ szDeviceIdentify, options }) => {
        return new Promise(async (resolve, reject) => {
            let szInfo = "plugin 停止录像: ";
            try {
                await WebVideoCtrl.I_StartPlayback(szDeviceIdentify, options)
                szInfo = szInfo + '成功'
                resolve(szInfo)
            } catch (error) {
                szInfo = szInfo + '失败' + error
                resolve(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    // 抓图
    I_CapturePic = async ({ filename, options }) => {
        return new Promise(async (resolve, reject) => {
            let szInfo = "plugin 抓图: ";
            try {
                const oWndInfo = await WebVideoCtrl.I_GetWindowStatus()
                if (!oWndInfo) {
                    szInfo = szInfo + '当前窗口未在播放'
                    return reject(szInfo)
                }
                await WebVideoCtrl.I_CapturePic(filename, options);
                szInfo = szInfo + '成功'
                resolve(szInfo)
            } catch (error) {
                szInfo = szInfo + '失败' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    // 云台控制
    I_PTZControl = async ({ iPTZIndex, bStop, options }) => {
        return new Promise(async (resolve, reject) => {
            let szInfo = "plugin I_PTZControl :";
            try {
                const oWndInfo = await WebVideoCtrl.I_GetWindowStatus()
                if (!oWndInfo) {
                    szInfo = szInfo + '当前窗口未在播放'
                    reject(szInfo)
                }
                await WebVideoCtrl.I_PTZControl(iPTZIndex, bStop, options);
                szInfo = szInfo + '成功'
                resolve(szInfo)
            } catch (error) {
                szInfo = szInfo + '失败' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    // 调用预置点
    I_GoPreset = async ({ iPresetID, options }) => {
        return new Promise(async (resolve, reject) => {
            let szInfo = "plugin I_GoPreset :";
            try {
                const oWndInfo = await WebVideoCtrl.I_GetWindowStatus()
                if (!oWndInfo) {
                    szInfo = szInfo + '当前窗口未在播放'
                    return reject(szInfo)
                }
                await WebVideoCtrl.I_GoPreset(iPresetID, options);
                szInfo = szInfo + '成功'
                resolve(szInfo)
            } catch (error) {
                szInfo = szInfo + '失败' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    // 设置预置点
    I_SetPreset = async ({ iPresetID, options }) => {
        return new Promise(async (resolve, reject) => {
            let szInfo = "plugin I_SetPreset :";
            try {
                const oWndInfo = await WebVideoCtrl.I_GetWindowStatus()
                if (!oWndInfo) {
                    szInfo = szInfo + '当前窗口未在播放'
                    return reject(szInfo)
                }
                await WebVideoCtrl.I_SetPreset(iPresetID, options);
                szInfo = szInfo + '成功'
                resolve(szInfo)
            } catch (error) {
                szInfo = szInfo + '失败' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    // 启用多边形绘制
    I_SetPlayModeType = async () => {
        return new Promise(async (resolve, reject) => {
            let szInfo = "plugin I_SetPlayModeType :";
            try {
                const oWndInfo = await WebVideoCtrl.I_GetWindowStatus()
                if (!oWndInfo) {
                    szInfo = szInfo + '当前窗口未在播放'
                    return reject(szInfo)
                }
                await WebVideoCtrl.I_SetPlayModeType(6);
                szInfo = szInfo + '成功'
                resolve(szInfo)
            } catch (error) {
                szInfo = szInfo + '失败' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    // 关闭多边形绘制
    I_SetSnapDrawMode = async () => {
        return new Promise(async (resolve, reject) => {
            let szInfo = "plugin I_SetPlayModeType :";
            try {
                const oWndInfo = await WebVideoCtrl.I_GetWindowStatus()
                if (!oWndInfo) {
                    szInfo = szInfo + '当前窗口未在播放'
                    return reject(szInfo)
                }
                await WebVideoCtrl.I_SetSnapDrawMode(0, -1);
                szInfo = szInfo + '成功'
                resolve(szInfo)
            } catch (error) {
                szInfo = szInfo + '失败' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    AddSnapPolygon = async (params) => {
        return new Promise(async (resolve, reject) => {
            let szInfo = "plugin AddSnapPolygon: ";
            try {
                const oWndInfo = await WebVideoCtrl.I_GetWindowStatus()
                if (!oWndInfo) {
                    szInfo = szInfo + '当前窗口未在播放'
                    return reject(szInfo)
                }

                const { szId, szName } = params
                if ([undefined, null].includes(szId) || [undefined, null].includes(szName)) {
                    szInfo = szInfo + 'szId或szName不存在!'
                    return reject(szInfo)
                }
                let setInfo = "<?xml version='1.0' encoding='utf-8'?>";
                setInfo += "<SnapPolygonList>";
                setInfo += "<SnapPolygon>";
                setInfo += "<id>" + szId + "</id>";          // [1, 32]
                setInfo += "<polygonType>1</polygonType>";
                setInfo += "<PointNumMax>17</PointNumMax>";  // [MinClosed, 17]
                setInfo += "<MinClosed>4</MinClosed>";       // [4, 17]
                setInfo += "<tips>#" + szId + "#" + szName + "</tips>";
                setInfo += "<isClosed>false</isClosed>";
                setInfo += "<color><r>0</r><g>255</g><b>0</b></color>";
                setInfo += "<pointList/>";
                setInfo += "</SnapPolygon>";
                setInfo += "</SnapPolygonList>";

                var iRet = await WebVideoCtrl.I_SetSnapPolygonInfo(0, setInfo);
                if (-1 === iRet) {
                    szInfo = szInfo + '添加图形失败！'
                    return reject(szInfo)
                } else if (-2 === iRet) {
                    //alert("参数错误！");
                    szInfo = szInfo + '参数错误！'
                    return reject(szInfo)
                } else if (-3 === iRet) {
                    szInfo = szInfo + '图形个数达到上限！'
                    return reject(szInfo)
                } else if (-4 === iRet) {
                    szInfo = szInfo + '图形ID已存在！'
                    return reject(szInfo)
                }

                WebVideoCtrl.I_SetSnapDrawMode(0, 2);
                szInfo = szInfo + '成功'
                resolve(szInfo)
            } catch (error) {
                szInfo = szInfo + '失败' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    // 关闭多边形绘制
    I_GetSnapPolygonInfo = async () => {
        return new Promise(async (resolve, reject) => {
            let szInfo = "plugin I_GetSnapPolygonInfo :";
            try {
                const oWndInfo = await WebVideoCtrl.I_GetWindowStatus()
                if (!oWndInfo) {
                    szInfo = szInfo + '当前窗口未在播放'
                    return reject(szInfo)
                }
                const res = await WebVideoCtrl.I_GetSnapPolygonInfo(this.g_iWndIndex);
                szInfo = szInfo + '成功'
                resolve(res)
            } catch (error) {
                szInfo = szInfo + '失败' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

    // 关闭多边形绘制
    I_PlaySlow = async () => {
        return new Promise(async (resolve, reject) => {
            let szInfo = "plugin I_PlaySlow :";
            try {
                const oWndInfo = await WebVideoCtrl.I_GetWindowStatus()
                if (!oWndInfo) {
                    szInfo = szInfo + '当前窗口未在播放'
                    return reject(szInfo)
                }
                const res = await WebVideoCtrl.I_PlaySlow();
                szInfo = szInfo + '成功'
                resolve(res)
            } catch (error) {
                szInfo = szInfo + '失败' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }


    I_PlayFast = async () => {
        return new Promise(async (resolve, reject) => {
            let szInfo = "plugin I_PlayFast :";
            try {
                const oWndInfo = await WebVideoCtrl.I_GetWindowStatus()
                if (!oWndInfo) {
                    szInfo = szInfo + '当前窗口未在播放'
                    return reject(szInfo)
                }
                const res = await WebVideoCtrl.I_PlayFast();
                szInfo = szInfo + '成功'
                resolve(res)
            } catch (error) {
                szInfo = szInfo + '失败' + JSON.stringify(error)
                reject(szInfo)
            } finally {
                console.log(szInfo)
            }
        })
    }

}