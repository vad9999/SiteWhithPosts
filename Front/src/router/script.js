import { createRouter } from 'vue-router'
import { createWebHistory} from 'vue-router'
import HomeView from '../View/HomeView.vue'

const routes = [
    {
        path: '/',
        component: HomeView,
        name: 'HomeView'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router