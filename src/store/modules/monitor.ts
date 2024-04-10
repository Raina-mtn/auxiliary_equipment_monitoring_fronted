import { defineStore } from "pinia";
import type { Camera } from '@/api/interface/types';
import { isEqual } from 'lodash-es';
import { ElMessage } from "element-plus";

// 视频监控store
export const monitorStore = defineStore({
    id: 'monitorStore', // 必须指明唯一的pinia仓库的id
    state: () => ({
        cameraIframe: HTMLElement,
        cameraList: [] as Camera[],
        pageIndex: 1,
        pageSize: 1,
        winType: 1,
        playingCamera: {} as Camera, // 正在播放的视频
        choosedWinIndex: 0
    }),
    actions: {
        initFrame(frameContent: HTMLElement, cameraList: Camera[]) {
            this.cameraIframe = frameContent
            this.cameraList = cameraList
            this.playingCamera = cameraList[0]

        },
        playCamera(camera: Camera) {
            if (!isEqual(camera, this.playingCamera)) {
                this.playingCamera = camera
                this.postMessage({
                    connectType: 'playSigleCamera',
                    params: {
                        camera: camera,
                        win_index: this.choosedWinIndex
                    }
                })
            }
        },
        postMessage(message: { connectType: string, params?: object }) {
            const data = JSON.parse(JSON.stringify(message))
            console.log('>>>>>>>message', data);

            this.cameraIframe && this.cameraIframe.postMessage(
                data,
                "*"
            );
        },
        reciveMessage() {
            window.addEventListener('message', (messageEvent) => {
                const { connectType, params } = messageEvent.data;
                console.log('>>>>>接收消息:', connectType, params);

                if (connectType == 'chooseWinIndex') {
                    this.choosedWinIndex = params.winIndex
                }
                if (connectType === 'init' && params === 'success') { // 首屏播放成功后，依次登录剩余摄像头，这样切换的时候可以减少登录时间
                    this.postMessage({
                        connectType: 'loginAll',
                        params: {
                            cameraList: this.cameraList
                        }
                    })
                }
                if (connectType == 'playBack' && params.type === 'success') {
                    const { error } = params
                    if (error === 'record fail') {
                        ElMessage.error('没有可以播放的录像')
                    }
                }
            })
        },
        playBack({ startTime, endTime }) {
            this.postMessage({
                connectType: 'playBack',
                params: {
                    camera: this.playingCamera,
                    win_index: this.choosedWinIndex,
                    startTime,
                    endTime
                }
            })
        }

    },
})
