import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProcessView from '../views/ProcessView.vue'
import CreateView from '../views/CreateView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/create',
            name: 'create',
            component: CreateView
        },
        {
            path: '/process/:name',
            name: 'process',
            component: ProcessView
        }
    ]
})

export default router
