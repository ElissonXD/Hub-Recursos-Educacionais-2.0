// Importações

const express = require('express')
const router = express.Router()
const controller = require('../controllers/healthcheckController')

// Endpoints
router.get('/', controller.healthCheck)



module.exports = router