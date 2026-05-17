// Importações

const express = require('express')
const router = express.Router()
const controller = require('../controllers/geminiController')

// Endpoints

router.post('/', controller.postResponse)


module.exports = router