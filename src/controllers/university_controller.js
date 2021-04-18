const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesUniversity = require('../config/queries/university');
const jwt = require('jsonwebtoken');


// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToUniversities = (rows) => {
    const universities = [];
        
    rows.forEach(element => {
        let aux = {
            id: element.university_ide,
            name: element.university_nam,
            description: element.university_des,
            img: element.university_img
        }

        if(aux.img != null) {
            aux.img = aux.img.toString();
        }

        universities.push(aux);
    });

    return universities;
}

const dataToQualifications = (rows) => {
    const qualifications = [];
        
    rows.forEach(element => {
        qualifications.push({
            tittle: element.qualification_nam,
            id: element.qualification_ide
        });
    });

    return qualifications;
}


// Logic
const getUniversitiesByName = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { name } = req.params;

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const arrAux = [ `%${name.toUpperCase()}%` ];
        const data = await pool.query(dbQueriesUniversity.getUniversityByName, arrAux);
        
        if(data) { 
            (data.rowCount > 0)
            ? res.json(newReponse('All universities', 'Success', dataToUniversities(data.rows)))
            : res.json(newReponse('Universities not found', 'Success', []));
        
        } else {
            res.json(newReponse('Error searhing universities', 'Error', { }));
        }
    }
}

const getQualificationByUniversity = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { universityId } = req.params;

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const data = await pool.query(dbQueriesUniversity.getQualificationByUniversity, [ universityId ]);
        
        if(data) { 
            (data.rowCount > 0)
            ? res.json(newReponse('All qualifications', 'Success', dataToQualifications(data.rows)))
            : res.json(newReponse('Qualifications not found', 'Success', []));
        
        } else {
            res.json(newReponse('Error searhing qualifications', 'Error', { }));
        }
    }
}


// Export
module.exports = { 
    getUniversitiesByName,
    getQualificationByUniversity,
}