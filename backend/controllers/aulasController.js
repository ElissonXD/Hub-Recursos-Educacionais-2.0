// Importações

const query = require('../db/query')

// Controladores

function getAulas(req,res) {

    const {limit, offset} = req.query

    const rows = query.getAulas(limit, offset)

    return res.status(200).json({
        success: true,
        data: rows
    })
}

function postAula(req,res){
    const dados = {...req.body, cadastro: new Date()}

    query.inserirAula(dados)

    return res.status(201).json({
        success: true,
        message: "Aula cadastrada com sucesso!"
    })
}

function putAula(req,res){
    
    query.atualizarAula(req.body.id, req.body)

    return res.status(200).json({
        success: true,
        message: "Aula atualizada com sucesso!"
    })
}

function deleteAula(req,res){
    
    query.deletarAula(req.body.id)

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