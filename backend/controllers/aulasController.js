// Importações

const query = require('../db/query')

// Controladores

async function getAulas(req,res) {

    const rows = await query.listarAulas()

    console.log(`[INFO] - GET all cards`)

    return res.status(200).json({
        success: true,
        data: rows
    })
}

async function postAula(req,res){
    const dados = {...req.body, cadastro: new Date()}

    await query.inserirAula(dados)

    console.log(`[INFO] - POST new card - Title = ${req.body.título} `)

    return res.status(201).json({
        success: true,
        message: "Aula cadastrada com sucesso!"
    })
}

async function putAula(req,res){
    
    await query.atualizarAula(req.body.id, req.body)

    console.log(`[INFO] - PUT card: ID = ${req.body.id}, Title = ${req.body.título} `)

    return res.status(200).json({
        success: true,
        message: "Aula atualizada com sucesso!"
    })
}

async function deleteAula(req,res){
    
    await query.deletarAula(req.query.id)

    console.log(`[INFO] - DELETE card: ID = ${req.query.id}`)

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