// Importações

const pool = require('./pool')

// Funções querys

async function inserirAula(dados){
    const {título, objetivo, resumo, data_prevista, disciplina, conteúdos, recursos, tags, cadastro} = dados;

    await pool.query(`
        INSERT INTO aulas (título, objetivo, resumo, data, disciplina, conteúdos, recursos, tags, cadastro)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [título, objetivo, resumo, data_prevista, disciplina, conteúdos, recursos, tags, cadastro]);
}

async function atualizarAula(id, dados){
    const {título, objetivo, resumo, data_prevista, disciplina, conteúdos, recursos, tags} = dados;
    await pool.query(`
        UPDATE aulas
        SET título = $2, objetivo = $3, resumo = $4, data = $5, disciplina = $6, conteúdos = $7, recursos = $8, tags = $9
        WHERE id = $1
    `, [id, título, objetivo, resumo, data_prevista, disciplina, conteúdos, recursos, tags]);
}

async function deletarAula(id) {
    await pool.query(`
        DELETE FROM aulas
        WHERE id = $1
        `, [id])
}

async function listarAulas(){
    const {rows} = await pool.query(`
        SELECT * FROM aulas
    `);
    return rows;
}

async function inicializarDB(){
    await pool.query(`
    CREATE TABLE IF NOT EXISTS aulas (
    id SERIAL PRIMARY KEY,
    título VARCHAR(255) NOT NULL, 
    objetivo TEXT NOT NULL,
    resumo TEXT NOT NULL, 
    data DATE NOT NULL, 
    disciplina VARCHAR(100) NOT NULL, 
    conteúdos TEXT,
    recursos TEXT, 
    tags TEXT[], 
    cadastro DATE NOT NULL);`)
}

async function healthTest() {
    await pool.query('SELECT 1');
}

module.exports = { inserirAula, listarAulas, atualizarAula, deletarAula, inicializarDB, healthTest}