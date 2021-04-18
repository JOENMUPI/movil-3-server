const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesUserQualification = require('../config/queries/user_qualification');
const jwt = require('jsonwebtoken');


// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}


// Logic
const createQualification = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { averageScore, dateInit, dateEnd, qualificationId, universityId } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ qualificationId, universityId, averageScore, dateInit, dateEnd, tokenDecoded.id ];
        const data = await pool.query(dbQueriesUserQualification.createUserQualification, arrAux);
        
        (data)
        ? res.json(newReponse('Qualification created', 'Success', { }))
        : res.json(newReponse('Error create qualification', 'Error', { }));
    }
}


// Export
module.exports = { 
    createQualification
}