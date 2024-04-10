import type { App } from 'vue';
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/styles/element/index.scss'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

setFontSize()
function setFontSize() {
  let designWidth = 1920;//设计稿的宽度，根据实际项目调整
  let designHeight = 1080;//设计稿的高度，根据实际项目调整
  var fontSize =
    document.documentElement.clientWidth / document.documentElement.clientHeight < designWidth / designHeight ?
      (document.documentElement.clientWidth / designWidth) * 20 :
      (document.documentElement.clientHeight / designHeight) * 20;
  document.querySelector('html').style.fontSize = fontSize + 'px';

  // const deviceWidth = document.documentElement.clientWidth || document.body.clientWidth; // 750px - 16px
  // document.querySelector('html').style.fontSize = deviceWidth / 7.5 + 'px';
}
window.onresize = function () {
  setFontSize()
};


export function registerComponent(app: App) {
  app.use(ElementPlus, {
    locale: zhCn,
  })
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}
