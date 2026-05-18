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

app.use(express.json())
app.use(cors())

app.use('/api/aulas', aulasRoute)
app.use('/api/gemini', geminiRoute)
app.use('/api/health', healthcheckRoute)
app.get('/api/db', async (req,res) => {
    const query = require('./db/query')
    await  query.inicializarDB()
    return res.status(200).json({success: true, message: "Banco de dados inicializado com sucesso!"})
})
app.use(errorHandler)

module.exports = app