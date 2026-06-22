import { createApp } from 'vue'
import Vant from 'vant'
import 'vant/lib/index.css'
import './style.css'

import App from './App.vue'
import router from './router'

// 创建 Vue 应用，注册 Vant 组件库和路由。
const app = createApp(App)

app.use(Vant)
app.use(router)
app.mount('#app')
