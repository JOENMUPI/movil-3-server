const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesUserExperience = require('../config/queries/experience');
const jwt = require('jsonwebtoken');


// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToExperience = (rows) => {
    const experiences = [];
        
    rows.forEach(element => {
        let aux = {  
            id: element.job_offer_ide,
            dateInit: element.experience_dat_sta,
            dateEnd: element.experience_dat_end,
            job: element.experience_job,
            typeJob: element.experience_typ_job,
            enterpriseId: element.enterprise_ide,
            enterprise: element.enterprise_nam,
            img: element.enterprise_img,
        }

        if(aux.img != null) {
            aux.img = aux.img.toString();
        }

        experiences.push(aux);
    });

    return experiences;
}


// Logic
const createExperience = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { enterpriseId, dateInit, dateEnd, job, typeJob } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET);
        const arrAux = [ dateInit, dateEnd, job, typeJob, enterpriseId, tokenDecoded.id ];
        const data = await pool.query(dbQueriesUserExperience.createExperience, arrAux);
        
        (data)
        ? res.json(newReponse('Experience created', 'Success', dataToExperience(data.rows)[0]))
        : res.json(newReponse('Error create experience', 'Error', { }));
    }
}

const updateExperienceById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { enterpriseId, dateInit, dateEnd, job, typeJob, id } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET);
        const arrAux = [ dateInit, dateEnd, job, typeJob, enterpriseId, tokenDecoded.id, id ];  
        const data = await pool.query(dbQueriesUserExperience.updatetExperienceById, arrAux);
        
        (data)
        ? res.json(newReponse('Experience updated', 'Success', { }))
        : res.json(newReponse('Error update experience', 'Error', { }));
    }
}

const deleteExperienceById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { experienceId } = req.params; 

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));
    
    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const data = await pool.query(dbQueriesUserExperience.deleteExperienceById, [ tokenDecoded.id, experienceId ]);

        (data)
        ? res.json(newReponse('experience deleted successfully', 'Success', { }))
        : res.json(newReponse('Error on delete with id', 'Error', { }));
    }
}


// Export
module.exports = { 
    createExperience,
    updateExperienceById,
    deleteExperienceById
}