// Importações

const query = require('../db/query')

// Controladores

async function getAulas(req,res) {

    const rows = await query.listarAulas()

    return res.status(200).json({
        success: true,
        data: rows
    })
}

async function postAula(req,res){
    const dados = {...req.body, cadastro: new Date()}

    await query.inserirAula(dados)

    return res.status(201).json({
        success: true,
        message: "Aula cadastrada com sucesso!"
    })
}

async function putAula(req,res){
    
    await query.atualizarAula(req.body.id, req.body)

    return res.status(200).json({
        success: true,
        message: "Aula atualizada com sucesso!"
    })
}

async function deleteAula(req,res){
    
    await query.deletarAula(req.query.id)

    return res.status(200).json({
        success: true,
        message: "Aula deletada com sucesso!"
    })
}


module.exports = {
    getAulas,
    postAula,
    putAula,
    deleteAula
}