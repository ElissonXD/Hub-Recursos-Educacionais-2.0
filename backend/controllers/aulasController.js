// Controladores

function getAulas(req,res) {

    const {limit, offset} = req.body

    // acessar banco e enviar baseado no limit e offset

    return res.status(200).json({
        success: true,
        data: []
    })
}





module.exports = {
    getAulas
}