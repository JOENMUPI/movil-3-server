const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesEnterprise = require('../config/queries/enterprise');
const jwt = require('jsonwebtoken');


// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToCompanies = (rows) => {
    const companies = [];
        
    rows.forEach(element => {
        let aux = {  
            id: element.enterprise_ide,
            name: element.enterprise_nam,
            description: element.enterprise_des,
            img: element.enterprise_img,
            userId: element.user_ide
        }

        if(aux.img != null) {
            aux.img = aux.img.toString();
        }

        companies.push(aux);
    });

    return companies;
}


// Logic
const getEnterprise = async (req, res) => {
    const token = req.headers['x-access-token'];
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const data = await pool.query(dbQueriesEnterprise.getEnterpriseByUserId, [ tokenDecoded.id ]);

        if(data) { 
            (data.rowCount > 0)
            ? res.json(newReponse('Companies found', 'Success', dataToCompanies(data.rows)))
            : res.json(newReponse('Comapnies not found', 'Success', []));
        
        } else {
            res.json(newReponse('Error searhing companies', 'Error', { }));
        }
    }
}

const getEnterpriseById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { enterpriseId } = req.params;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const data = await pool.query(dbQueriesEnterprise.getEnterpriseById, [ enterpriseId ]);

        if(data) { 
            (data.rowCount > 0)
            ? res.json(newReponse('Companies found', 'Success', dataToCompanies(data.rows)[0]))
            : res.json(newReponse('Comapnies not found', 'Success', []));
        
        } else {
            res.json(newReponse('Error searhing companies', 'Error', { }));
        }
    }
}

const createEnterprise = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { img, name, description } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ name, description, img, tokenDecoded.id ];
        const data = await pool.query(dbQueriesEnterprise.createEnterprise, arrAux);
        
        (data)
        ? res.json(newReponse('Enterprise created', 'Success', dataToCompanies(data.rows)[0]))
        : res.json(newReponse('Error create Enterprise', 'Error', { }));
    }
}

const updateEnterpriseById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { img, name, description, id } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ name, description, img, id, tokenDecoded.id ];
        const data = await pool.query(dbQueriesEnterprise.updateEnterpriseById, arrAux);
        
        (data)
        ? res.json(newReponse('Enterprise updated', 'Success', { }))
        : res.json(newReponse('Error on update Enterprise', 'Error', { }));
    }
}
 
const deleteEnterpriseById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { enterpriseId } = req.params;

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));
    
    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); console.log(enterpriseId, tokenDecoded.id);
        const data = await pool.query(dbQueriesEnterprise.deleteEnterpriseById, [ enterpriseId, tokenDecoded.id ]);

        (data)
        ? res.json(newReponse('Detele company successfully', 'Success', { }))
        : res.json(newReponse('Error on delete with id', 'Error', { }));
    }
}

// Export
module.exports = { 
    createEnterprise,
    getEnterprise,
    getEnterpriseById,
    updateEnterpriseById,
    deleteEnterpriseById
}