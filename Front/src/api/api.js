import axios from 'axios'

const port = 3000

const api = axios.create({
    baseURL: `http://localhost:${port}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default api