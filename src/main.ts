// import './assets/main.css'

import 'tailwindcss/tailwind.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// import App from './views/home.vue'
import App from './components/MapSetting.vue'
import router from './router'
// import axios from './http/index'

const app = createApp(App)

// app.config.globalProperties.$api = axios
app
  .use(createPinia())
  .use(router)
  .use(ElementPlus, {
    locale: zhCn
  })
  .mount('#app')
// .use(axios)
