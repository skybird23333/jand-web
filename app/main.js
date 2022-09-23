import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Client from './http/client'

import './assets/main.css'

const app = createApp(App)

app.use(router)

app.config.globalProperties.$client = new Client()
app.mount('#app')
