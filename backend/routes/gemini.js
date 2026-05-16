// Importações

const express = require('express')
const router = express.Router()
const controller = require('../controllers/geminiController')

// Endpoints

router.get('/', controller.getResponse)


module.exports = router