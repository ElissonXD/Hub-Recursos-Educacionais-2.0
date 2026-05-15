// Importações

const {Pool} = require('pg')
const dotenv = require('dotenv')

// Configuração
dotenv.config()

module.exports = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER, 
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD, 
  port: process.env.POSTGRES_PORT 
});