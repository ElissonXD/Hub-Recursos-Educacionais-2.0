// Importações

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

// Rotas

const aulasRoute = require('./routes/aulas')
const geminiRoute = require('./routes/gemini')
const healthcheckRoute = require('./routes/healthcheck')

// Middlewares

const errorHandler = require('./middlewares/errorHandler')

// Configuração

const app = express()

app.use(cors())

app.use('/api/aulas', aulasRoute)
app.use('/api/gemini', geminiRoute)
app.use('/api/check', healthcheckRoute)
app.use(errorHandler)

module.exports = app