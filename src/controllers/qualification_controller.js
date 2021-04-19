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

const updateQualificationById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { averageScore, dateInit, dateEnd, qualificationId, universityId, oldQualificationId, oldUniversityId } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ 
            qualificationId, universityId, averageScore, dateInit, 
            dateEnd, tokenDecoded.id, oldQualificationId, oldUniversityId 
        ]; 
        const data = await pool.query(dbQueriesUserQualification.updatetQualificationById, arrAux);
        
        (data)
        ? res.json(newReponse('Qualification updated', 'Success', { }))
        : res.json(newReponse('Error update qualification', 'Error', { }));
    }
}

const deleteQualificationById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { qualificationId, universityId } = req.params; 

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));
    
    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ tokenDecoded.id, qualificationId, universityId ]; 
        const data = await pool.query(dbQueriesUserQualification.deleteQualificationById, arrAux);

        (data)
        ? res.json(newReponse('Qualification deleted successfully', 'Success', { }))
        : res.json(newReponse('Error on delete with id', 'Error', { }));
    }
}


// Export
module.exports = { 
    createQualification,
    updateQualificationById,
    deleteQualificationById
}