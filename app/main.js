import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Client from './http/client'
import Notifications from '@kyvg/vue3-notification'

import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(Notifications)

app.config.globalProperties.$client = new Client()
app.mount('#app')
