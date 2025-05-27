import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from 'pinia'
import router from './router/script'
import components from './components/UI'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)

components.forEach(({name, component }) => {
    app.component(name, component)
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.mount('#app')
