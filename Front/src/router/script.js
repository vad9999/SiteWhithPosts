import { createRouter } from 'vue-router'
import { createWebHistory} from 'vue-router'
import LogInOrRegister from '../View/LogInOrRegister.vue'
import Home from '../View/Home.vue'
import Post from '../View/Post.vue'

const routes = [
    {
        path: '/',
        component: LogInOrRegister,
        name: 'LogInOrRegister'
    },
    {
        path: '/home',
        component: Home,
        name: 'Home'
    },
    {
        path: '/home/post/:id',
        component: Post,
        name: 'Post'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router