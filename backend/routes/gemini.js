// Importações

const express = require('express')
const router = express.Router()
const controller = require('../controllers/geminiController')
const validator = require('../schemas/validationSchemas')
// Endpoints

router.post('/', validator.geminiValidation, controller.postResponse)


module.exports = router