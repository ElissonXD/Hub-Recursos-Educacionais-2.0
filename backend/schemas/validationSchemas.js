const {body} = require('express-validator')
const { validate } = require('../middlewares/validators')

const aulaValidation = [
    body('título').trim().isString().notEmpty().withMessage('Título é obrigatório'),
    body('objetivo').trim().isString().notEmpty().withMessage('Objetivo é obrigatório'),
    body('resumo').trim().isString().notEmpty().withMessage('Resumo é obrigatório'),
    body('data_prevista').trim().isDate().withMessage('Data prevista deve ser uma data válida'),
    body('conteúdos').trim().isString().withMessage('Conteúdos deve conter pelo menos um item'),
    body('recursos').trim().isString().notEmpty().withMessage('Recursos é obrigatório'),
    body('tags').isArray({ min: 1 }).withMessage('Tags deve conter pelo menos uma tag'),
    validate
]




module.exports = {
    aulaValidation
}