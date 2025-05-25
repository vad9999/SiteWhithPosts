import { createRouter } from 'vue-router'
import { createWebHistory} from 'vue-router'
import LogInOrRegister from '../View/LogInOrRegister.vue'

const routes = [
    {
        path: '/',
        component: LogInOrRegister,
        name: 'LogInOrRegister'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router