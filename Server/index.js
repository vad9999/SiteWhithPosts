const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const db = require('./models')
const applyAssociations = require('./models/associations')

const port = 3000

const app = express()

app.use(cors())
app.use(bodyParser.json())

applyAssociations(db)

db.sequelize.sync({alter: true})
    .then(() => {
        console.log('Таблицы синхронизированы')
        app.listen(port, () => {
        console.log(`Сервер запущен на http://localhost:${port}`)
        })
    })
    .catch(err => {
        console.log('Ошибка при запуске:', err)
    })