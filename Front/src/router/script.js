import { createRouter } from 'vue-router'
import { createWebHistory} from 'vue-router'
import LogInOrRegister from '../View/LogInOrRegister.vue'
import Home from '../View/Home.vue'
import Post from '../View/Post.vue'
import UserPosts from '../View/UserPosts.vue'
import UserSettings from '../View/UserSettings.vue'

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
        path: '/post/:id',
        component: Post,
        name: 'Post'
    },
    {
        path: '/user/:id',
        component: UserPosts,
        name: 'UserPosts'
    },
    {
        path: '/settings/user/:id',
        component: UserSettings,
        name: 'UserSettings'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router