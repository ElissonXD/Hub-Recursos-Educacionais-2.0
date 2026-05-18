// Importações
const query = require('../db/query')

// Funções

async function getHealth(req, res){
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        services: {
            database: 'unknown'
        }
    }

    // Verificando Postgres

    try {
        await query.healthTest();
        healthcheck.services.database = 'HEALTHY';
    } catch (error) {
        console.log(`[HEALTH] Database conncection failed: ${error.message}`);
        healthcheck.services.database = 'UNHEALTHY';
    }

    return res.status(200).json(healthcheck);
}


module.exports = {getHealth}