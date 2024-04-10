/*
 * @Date: 2023-07-03 17:18:19
 * @LastEditors: zhusisheng zhusisheng@shenhaoinfo.com
 * @LastEditTime: 2023-07-14 13:05:14
 * @FilePath: \robot_outdoor_e_vue3\src\router\config.ts
 */
import type { RouteRecordRaw } from "vue-router";

// 默认路由白名单
export const defaultRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/login',
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import("@/components/Layout/index.vue"),
                children: []
            },
            {
                path: "login",
                name: "login",
                component: () => import("@/views/login/index.vue"),
            },
            {
                path: "404",
                name: "notFound",
                component: () => import("@/views/404/index.vue"), //这个是我自己的路径
            },
        ]
    },
];
