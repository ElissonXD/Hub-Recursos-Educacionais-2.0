// Importações
const {validationResult} = require('express-validator');

// Middleware

function validate(req, res, next){
    const errors = validationResult(req)
    if(errors.isEmpty()){
        return next()
    }

    console.log(`[VALIDATION FAILED] - ${errors.array().map(e => e.msg).join(', ')}`)

    return res.status(400).json({
        success: false,
    })
}

module.exports = {
    validate
}