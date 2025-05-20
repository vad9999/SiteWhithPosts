import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from 'pinia'
import router from './router/script'
import components from './components/UI'

const app = createApp(App)

components.forEach(({name, component }) => {
    app.component(name, component)
})

app.use(createPinia())
app.use(router)
app.mount('#app')
