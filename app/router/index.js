import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProcessView from '../views/ProcessView.vue'
import CreateView from '../views/CreateView.vue'
import ErrorView from '../views/ErrorView.vue'

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
            component: ProcessView,
            children: [
                {
                    path: 'console',
                    component: () => import('../views/ProcessSubViews/ProcessConsoleView.vue')
                },
                {
                    path: 'dashboard',
                    component: () => import('../views/ProcessSubViews/ProcessDashboardView.vue')
                }
            ]
        },
        {
            path: '/error',
            name: 'error',
            component: ErrorView
        }
    ]
})

export default router
