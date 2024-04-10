// 初始化插件


// 全局保存当前选中窗口
var g_iWndIndex = 0; //可以不用设置这个变量，有窗口参数的接口中，不用传值，开发包会默认使用当前选择窗口
var version = "websdk3.220191023";
let hasGetChannel = false
let curTime = new Date().getTime()
$(function () {
    // 检查插件是否已经安装过
    var iRet = window.WebVideoCtrl.I_CheckPluginInstall();
    if (-1 == iRet) {
        alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
        return;
    }

});
function computeTime() {
    let time = new Date().getTime() - curTime
    console.log(time);
}
// I_DestroyWorker
// I_CloseWin
// 初始化
function initPlugin(iWndowType = 1, { width, height }) {
    console.log('>>>>>init', iWndowType);
    // 初始化插件参数及插入插件
    WebVideoCtrl.I_InitPlugin(width, height, {
        bWndFull: true, //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
        iPackageType: 2,
        //szColorProperty:"plugin-background:0000ff; sub-background:0000ff; sub-border:00ffff; sub-border-select:0000ff",   //2:PS 11:MP4
        iWndowType: iWndowType,
        bNoPlugin: true,
        cbSelWnd: function (xmlDoc) {
            g_iWndIndex = parseInt($(xmlDoc).find("SelectWnd").eq(0).text(), 10);
            var szInfo = "当前选择的窗口编号：" + g_iWndIndex;
            console.log(szInfo);
            computeTime()

            sendMessage({
                connectType: 'chooseWinIndex', // 告诉父级
                params: {
                    winIndex: g_iWndIndex
                }
            })

        },
        cbInitPluginComplete: function () {
            WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
            WebVideoCtrl.I_Resize('100%', '100%')
            // 检查插件是否最新
            if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
                alert(
                    "检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！"
                );
                return;
            }
        },
    });
}

// 全屏
function clickFullScreen() {
    WebVideoCtrl.I_FullScreen(true);
}

// resize
function resize(wdith, height) {
    WebVideoCtrl.I_Resize(wdith, height)
}



// 窗口分割数
function changeWndNum(iType) {
    console.log('>>>>iType', iType);
    iType = parseInt(iType, 10);
    const ret = WebVideoCtrl.I_ChangeWndNum(iType);
    console.log(ret);
}

// 登录
function clickLogin({ ip, port, username, password }, index) {

    computeTime()
    return new Promise((resolve, reject) => {
        if ("" == ip || "" == port) {
            return;
        }

        var szDeviceIdentify = ip + "_" + port;

        var iRet = WebVideoCtrl.I_Login(ip, 1, port, username, password, {
            success: function (xmlDoc) {
                console.log(szDeviceIdentify + " 登录成功！");
                if (!hasGetChannel) {
                    getChannelInfo({ ip, port })
                }

                computeTime()
                resolve(1)
            },
            error: function (status, xmlDoc) {
                console.log(szDeviceIdentify + " 登录失败！", status, xmlDoc);
                reject();
            },
        });
        if (-1 == iRet) {
            console.log(szDeviceIdentify + " 已登录过！");
            resolve(-1)
        }
    });
}

// 获取通道
// 无插件下需要先获取通道，之后调用预置位等才能正确请求接口
function getChannelInfo({ ip, port, username, password }) {
    hasGetChannel = true
    var szDeviceIdentify = ip + "_" + port;
    // 模拟通道
    WebVideoCtrl.I_GetAnalogChannelInfo(szDeviceIdentify, {
        async: false,
        success: function (xmlDoc) {
            console.log(szDeviceIdentify + " 获取模拟通道成功！", status, xmlDoc);
        },
        error: function (status, xmlDoc) {
            console.log(szDeviceIdentify + " 获取模拟通道失败！", status, xmlDoc);
        }
    });
}
// 退出
function clickLogout({ ip }) {
    return new Promise((reslove, reject) => {

        var szInfo = "";

        if (null == ip) {
            return;
        }

        var iRet = WebVideoCtrl.I_Logout(ip);
        if (0 == iRet) {
            szInfo = "退出成功！";
            reslove()
        } else {
            szInfo = "退出失败！";
            reject()
        }
        console.log(ip + " " + szInfo);
    })
}

// 开始预览
function clickStartRealPlay({ ip, port, iChannelID, win_index }) {

    computeTime()
    return new Promise((reslove, reject) => {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(win_index),
            szDeviceIdentify = `${ip}_${port}`,
            bZeroChannel = false,
            szInfo = "";

        if (null == szDeviceIdentify) {
            return;
        }
        var startRealPlay = function () {
            const ret = WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
                iWndIndex: win_index, // 播放窗口
                iRtspPort: 554,
                iStreamType: 2, // 子码流 写死
                iChannelID: iChannelID,
                bZeroChannel: bZeroChannel,
                success: function () {

                    computeTime()
                    szInfo = "开始预览成功！";
                    console.log(szDeviceIdentify + " " + szInfo);
                    reslove();
                },
                error: function (status, xmlDoc) {
                    if (403 === status) {
                        szInfo = "设备不支持Websocket取流！";
                    } else {
                        szInfo = "开始预览失败！";
                    }
                    console.log(szDeviceIdentify + " " + szInfo);
                    reject();
                },
            });
        };

        if (oWndInfo != null) {
            console.log('已经在播放了');
            // 已经在播放了，先停止
            WebVideoCtrl.I_Stop({
                iWndIndex: win_index,
                success: function () {
                    startRealPlay();
                },
            });
        } else {
            startRealPlay();
        }
    });
}
// 停止预览
function clickStopRealPlay(win_index) {
    return new Promise((resolve, reject) => {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(win_index),
            szInfo = "";

        if (oWndInfo != null) {
            WebVideoCtrl.I_Stop({
                iWndIndex: win_index,
                success: function () {
                    szInfo = "停止预览成功！";
                    console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
                    resolve()
                },
                error: function () {
                    szInfo = "停止预览失败！";
                    console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
                    reject()
                },
            });
        }

    })
}

//回放
function clickPlayBack({ ip, port, startTime, endTime, channel, iStreamType = 1, win_index }) {
    return new Promise((resolve, reject) => {
        if ("" == ip || "" == port) {
            return;
        }

        var szDeviceIdentify = ip + "_" + port;

        WebVideoCtrl.I_StartPlayback(szDeviceIdentify, {
            iWndIndex: win_index,
            szStartTime: startTime,
            szEndTime: endTime,
            iChannelID: channel,
            iStreamType: iStreamType,
            success: function (xmlDoc) {
                console.log(szDeviceIdentify + "回放成功！");
                resolve(1)
            },
            error: function (status, xmlDoc) {
                console.log(szDeviceIdentify + "回放失败！", status, xmlDoc);
                reject('playback fail');
            },
        });
    });

}
// 搜索录像
function searchRecord({ ip, port, startTime, endTime, channel, iStreamType = 1 }) {
    return new Promise((resolve, reject) => {
        WebVideoCtrl.I_RecordSearch(`${ip}-${port}`, channel, startTime, endTime, {
            iStreamType: iStreamType,
            success: function () {
                resolve(1)
                console.log(szDeviceIdentify + "搜索录像成功");
            },
            error: function () {
                reject('record fail');
                console.log(szDeviceIdentify + "搜索录像失败");
            }
        })
    })
}

function togglePlay(playing, win_index) {
    return new Promise((resolve, reject) => {
        if (playing) {
            WebVideoCtrl.I_Resume({
                success: function () {
                    resolve(1)
                    console.log(szDeviceIdentify + "恢复播放成功！", status, xmlDoc);
                },
                error: function () {
                    reject();
                    console.log(szDeviceIdentify + "恢复播放失败！", status, xmlDoc);
                }
            })
        } else {
            WebVideoCtrl.I_Pause({
                success: function () {
                    resolve(1)
                    console.log(szDeviceIdentify + "暂停播放成功！", status, xmlDoc);
                },
                error: function () {
                    reject();
                    console.log(szDeviceIdentify + "暂停播放失败！", status, xmlDoc);
                }
            })
        }
    })

}
// 快放/慢放
function playChangeSpeed(fast) {
    return new Promise((resolve, reject) => {
        if (fast) {
            WebVideoCtrl.I_PlayFast({
                success: function () {
                    resolve(1)
                    console.log(szDeviceIdentify + "快放成功！", status, xmlDoc);
                },
                error: function () {
                    reject();
                    console.log(szDeviceIdentify + "快放失败！", status, xmlDoc);
                }
            })
        } else {
            WebVideoCtrl.I_PlaySlow({
                success: function () {
                    resolve(1)
                    console.log(szDeviceIdentify + "慢放成功！", status, xmlDoc);
                },
                error: function () {
                    reject();
                    console.log(szDeviceIdentify + "慢放失败！", status, xmlDoc);
                }
            })
        }
    })
}
//云台控制
function PTZControl({ iPTZIndex, bStop, options = {} }) {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
    if (oWndInfo) {
        WebVideoCtrl.I_PTZControl(iPTZIndex, bStop, {
            iWndIndex: 0,
            iPTZSpeed: 4,
            success: function () {
                console.log('云台控制成功');
            },
            error: function () {
                console.log('云台控制失败');
            },
            ...options
        })
    }
}
// 设置预置位
function setPreset(iPresetID) {
    return new Promise((resolve, reject) => {
        const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
        if (oWndInfo) {
            WebVideoCtrl.I_SetPreset(iPresetID, {
                iWndIndex: 0,
                success: function () {
                    console.log('设置预置位成功');
                    resolve(1)
                },
                error: function () {
                    console.log('设置预置位失败');
                    reject()
                }
            })

        }
    })
}
// 预置位跳转
function goPreset(iPresetID) {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
    if (oWndInfo) {
        return new Promise((resolve, reject) => {
            WebVideoCtrl.I_GoPreset(iPresetID, {
                iWndIndex: 0,
                success: function () {
                    console.log('预置位跳转成功');
                    resolve(1)
                },
                error: function () {
                    console.log('预置位跳转失败');
                    reject()
                }
            })
        })
    }
}

// 抓图
function capturePic({ ip, port, channel }) {
    return new Promise((resolve, reject) => {
        const szPicName = `${ip}_${port}_${channel}_${new Date().getTime()}`;
        WebVideoCtrl.I_DeviceCapturePic(`${ip}_${port}`, channel, szPicName, {
            bDateDir: true,
            success: function () {
                console.log('抓图成功');
                resolve(1)
            },
            error: function () {
                console.log('抓图成功');
                reject()
            }
        })
    })
}


//判断是否在线
let timer = null
function judgeOnline(camera = {}, win_index = 0) {
    return new Promise((reslove, reject) => {
        const szDeviceIdentify = `${camera.ip}_${camera.port}`
        const szUrl = 'ISAPI/Security/sessionHeartbeat'
        let flag = false // 是否成功
        try {
            WebVideoCtrl.I_SendHTTPRequest(szDeviceIdentify, szUrl, {
                type: "PUT",
                success: function () {
                    flag = true
                    reslove('online')
                },
                error: function (code) {
                    flag = true
                    reject('error')
                }
            });
        } catch (error) {
            flag = true
            reject('error')
        }
        if (!timer) {
            timer = setTimeout(async () => {
                console.log('进入setTimeOut');
                if (!flag) { // 未得到响应
                    reject('no response')
                }
            }, 2000)
        } else {
            clearTimeout(timer)
            timer = null
        }
    })
}

// 重连
function reconnect({ ip, port }) {
    return new Promise((resolve, reject) => {
        const szDeviceIdentify = `${ip}_${port}`
        WebVideoCtrl.I_Reconnect(szDeviceIdentify, {
            success: function (xmlDoc) {
                resolve(1)
            },
            error: function (status, xmlDoc) {
                if (401 == status) {// 无插件方案，重启后session已失效，程序执行登出，从已登录设备中删除
                    clickLogout({ ip }).then(res => {
                        console.log('退出重连成功');
                        reconnect({ ip, port })
                        resolve(1)
                    }).catch(() => {
                        reconnect({ ip, port })
                    })
                } else {
                    setTimeout(function () { reconnect({ ip, port }); }, 2000);
                }
            }
        });
    })

}

// 发送消息
function sendMessage({ connectType, params }) {
    window.parent.postMessage({
        connectType,
        params
    }, '*')
}