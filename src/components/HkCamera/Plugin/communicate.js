import { nanoid } from 'nanoid'
import PQueue from 'p-queue';
export default class CommunicateWidthIframe {
    static iframeId = null
    static connectQueue = new Map();
    static queue = new PQueue({ concurrency: 2 });

    static initCommunicate({ iframeId }) {
        this.iframeId = iframeId
        this.initIframeListener()
    }

    static initIframeListener() {
        window.addEventListener('message', (event) => {
            let { connectId, params } = event.data;
            if (connectId) {
                const connetFun = this.connectQueue.get(connectId)
                if (connetFun) {
                    connetFun.messageCb(params)
                    this.connectQueue.delete(connectId)
                }
            }

        })
    }

    // 通信封装
    static async connect({ connectType, params = {}, reTryCount = 0, timeOut = 10000 }) {
        return new Promise((resolve, reject) => {
            let that = this
            const connectId = nanoid();
            // 设置超时自动结束方法
            const timer = setTimeout(() => {
                clearTimeout(timer)

                // 清除
                this.connectQueue.delete(connectId)
                console.error(`${connectType} - timeout`)
                return reject(`${connectType} - timeout`)
            }, timeOut);

            // 获取iframe
            let iframeEle = document.getElementById(this.iframeId);
            const iframeWin = iframeEle.contentWindow;
            iframeWin.postMessage({ connectType, connectId, params }, "*");
            this.connectQueue.set(connectId, {
                messageCb: (event) => {
                    clearTimeout(timer)
                    const { succeed, error = null, data = null } = event
                    if (succeed) {
                        resolve(data)
                    } else {
                        reject(error)
                    }
                }
            })
        })
    }

    static p_connect = (params) => this.queue.add(() => this.connect(params))
}