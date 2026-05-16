// Importações

const pool = require('./pool')

// Funções querys

async function inserirAula(dados){
    const {título, objetivo, resumo, data, disciplina, conteúdos, recursos, tags, cadastro} = dados;

    await pool.query(`
        INSERT INTO aulas (título, objetivo, resumo, data, disciplina, conteúdos, recursos, tags, cadastro)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [título, objetivo, resumo, data, disciplina, conteúdos, recursos, tags, cadastro]);
}

async function atualizarAula(id, dados){
    const {título, objetivo, resumo, data, disciplina, conteúdos, recursos, tags} = dados;
    await pool.query(`
        UPDATE aulas
        SET título = $2, objetivo = $3, resumo = $4, data = $5, disciplina = $6, conteúdos = $7, recursos = $8, tags = $9
        WHERE id = $1
    `, [id, título, objetivo, resumo, data, disciplina, conteúdos, recursos, tags]);
}

async function deletarAula(id) {
    await pool.query(`
        DELETE FROM aulas
        WHERE id = $1
        `, [id])
}

async function listarAulas(offset, limit){
    const {rows} = await pool.query(`
        SELECT * FROM aulas
        LIMIT $1 OFFSET $2
    `, [limit, offset]);
    return rows;
}

async function contarAulas(){
    const {rows} = await pool.query(`
        SELECT COUNT(*) FROM aulas
    `);
    return parseInt(rows[0].count);
}

async function buscarAulas(dados){
    const {titulo, disciplina, tags, data, limit, offset} = dados;
    const {rows} = await pool.query(`
        SELECT * FROM aulas
        WHERE (título ILIKE '%' || COALESCE($1, '') || '%') AND
              (disciplina ILIKE '%' || COALESCE($2, '') || '%') AND
              ($3::text[] IS NULL OR tags && $3) AND
              ($4::date IS NULL OR data = $4)
        LIMIT $5 OFFSET $6
    `, [titulo, disciplina, tags, data, limit, offset]);
    return rows;
}

module.exports = { inserirAula, listarAulas, atualizarAula, deletarAula, contarAulas, buscarAulas }