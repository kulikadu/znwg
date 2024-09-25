// import './assets/main.css'

import 'tailwindcss/tailwind.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// import App from './views/home.vue'
import App from './components/wind.vue'
import router from './router'
// import axios from './http/index'

const app = createApp(App)

// app.config.globalProperties.$api = axios
app.use(createPinia())
app.use(router)
// app.use(axios)

app.mount('#app')
