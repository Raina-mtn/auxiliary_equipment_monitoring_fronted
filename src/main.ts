import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { setupStore } from '@/store'
import { setupRouter } from '@/router'
import { registerComponent } from "@/components/registerComponent";
import longClick from '@/directive/longClick'
// import 'element-plus/dist/index.css'
import 'virtual:windi.css'
import '@/assets/font/iconfont.css'
import '@/styles/element/index.scss'


const app = createApp(App)
// 注册store
setupStore(app)

// 注册路由
setupRouter(app)

// 注册全局组件
registerComponent(app)

const longClickInstance = longClick({})
app.directive('longclick', longClickInstance)

app.mount('#app')
