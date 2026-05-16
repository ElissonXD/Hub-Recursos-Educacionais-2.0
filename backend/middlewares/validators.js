// Importações
const {validationResult} = require('express-validator');

// Middleware

function validate(req, res, next){
    const errors = validationResult(req)
    if(errors.isEmpty()){
        return next()
    }

    return res.status(400).json({
        success: false,
        errors: errors.array()
    })
}

module.exports = {
    validate
}