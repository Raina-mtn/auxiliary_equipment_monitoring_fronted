import type { App } from 'vue'
import { createPinia } from "pinia";
import { userStore } from './modules/user'
import { cryptoStore } from './modules/crypto'
import { alarmStore } from './modules/alarm'
import { wsStore } from './modules/ws'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

export function setupStore(app: App<Element>) {
    pinia.use(({ store }) => {
        const initialState = JSON.parse(JSON.stringify(store.$state));
        store.$reset = () => {
            store.$state = JSON.parse(JSON.stringify(initialState));
        }

    });
    pinia.use(piniaPluginPersistedstate)
    app.use(pinia)
}

export {
    pinia,
    userStore,
    cryptoStore,
    alarmStore,
    wsStore
}
