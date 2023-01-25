import { createApp, nextTick } from 'vue'
import App from './App.vue'
import router from './router'
import Client from './http/client'
import Notifications from '@kyvg/vue3-notification'

import './assets/main.css'

const app = createApp(App)

const client = new Client()

//display machine name in title
async function fetchMachineName() {
    const title = `jand-web ${(await client.getSystemInfo()).hostname}`;
    document.title = title;
}

fetchMachineName()

app.use(router)
app.use(Notifications)
app.mount('#app')
