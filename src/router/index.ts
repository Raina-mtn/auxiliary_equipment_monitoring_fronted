import type { App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { defaultRoutes } from './config'
import { beforeEachInterceptor } from './intercepter'

export const router = createRouter({
    history: createWebHashHistory(),
    routes: defaultRoutes,
    scrollBehavior: () => ({ left: 0, top: 0 })
})

// 路由守卫
router.beforeEach(beforeEachInterceptor);

// 启动函数
export function setupRouter(app: App<Element>) {
    app.use(router)
}