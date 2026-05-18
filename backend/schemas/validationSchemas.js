const {body} = require('express-validator')
const { validate } = require('../middlewares/validators')

const aulaValidation = [
    body('título').trim().isString().notEmpty().escape().withMessage('Título é obrigatório'),
    body('objetivo').trim().isString().notEmpty().escape().withMessage('Objetivo é obrigatório'),
    body('resumo').trim().isString().notEmpty().escape().withMessage('Resumo é obrigatório'),
    body('data_prevista').trim().isDate().withMessage('Data prevista deve ser uma data válida'),
    body('conteúdos').trim().isString().notEmpty().escape().withMessage('Conteúdos é obrigatório'),
    body('recursos').trim().isString().notEmpty().escape().withMessage('Recursos é obrigatório'),
    body('tags').isArray({ min: 1 }).withMessage('Tags deve conter pelo menos uma tag'),
    validate
]

const geminiValidation = [
    body('title').trim().isString().notEmpty().escape().withMessage('Título é obrigatório'),
    body('type').trim().isString().notEmpty().escape().withMessage('Disciplina é obrigatória'),
    body('description').trim().isString().notEmpty().escape().withMessage('Descrição é obrigatória'),
    validate
]


module.exports = {
    aulaValidation,
    geminiValidation
}