export {}

declare module 'vue' {
    export interface GlobalComponents {
        ElButton: typeof import('element-plus/es')['ElButton']
        Layout: typeof import('./src/components/Layout.vue')['default']
        Parent: typeof import('../components/Parent.vue')['default']
        RouterLink: typeof import('vue-router')['RouterLink']
        RouterView: typeof import('vue-router')['RouterView']
    }
}
