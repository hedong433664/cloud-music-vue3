import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '../permission'
import '@/styles/global.scss'
import '@/assets/icon/iconfont.css'
import 'element-plus/es/components/message/style/css'
// import 'element-plus/theme-chalk/dark/css-vars.css'
// import '@/styles/element/index.scss'

import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import components from '@/components'

const app = createApp(App)
const pinia = createPinia()

pinia。use(piniaPluginPersistedstate)
app。use(pinia)
app。use(router)
app。use(components)
app。mount('#app')
// eslint-disable-next-line no-console
console.log("111")
