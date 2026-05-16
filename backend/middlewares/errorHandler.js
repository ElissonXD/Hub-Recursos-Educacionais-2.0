function errorHandler(err, req, res, next) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`)

    const statusCode = err.statusCode || 500

    res.status(statusCode).json({
        success: false,
        message: "Ocorreu um erro inesperado"
    })
}

module.exports = errorHandler