// Importações

const express = require('express')
const router = express.Router()
const controller = require('../controllers/aulasController')

// Endpoints

router.get('/', controller.getAulas)
router.post('/', controller.getAulas)
router.put('/', controller.getAulas)
router.delete('/', controller.getAulas)

module.exports = router