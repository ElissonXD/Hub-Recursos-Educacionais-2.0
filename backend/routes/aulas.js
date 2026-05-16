// Importações

const express = require('express')
const router = express.Router()
const controller = require('../controllers/aulasController')
const aulaValidator = require('../schemas/validationSchemas')

// Endpoints

const aulaValidate = aulaValidator.aulaValidation

router.get('/', controller.getAulas)
router.post('/', aulaValidate, controller.postAula)
router.put('/', aulaValidate, controller.putAula)
router.delete('/', controller.deleteAula)

module.exports = router