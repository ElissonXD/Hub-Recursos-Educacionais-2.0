// Importações

const express = require('express')
const router = express.Router()
const controller = require('../controllers/healthController')

// Endpoints

router.get('/', controller.getHealth)

module.exports = router