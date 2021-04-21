const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesCountry = require('../config/queries/country');
const dbQueriesCountryEnterprise = require('../config/queries/enterprise_country');


// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToCountries = (rows) => {
    const countries = [];
        
    rows.forEach(element => {
        countries.push({  
            id: element.country_ide,
            tittle: element.country_nam,
            code: element.country_num_cod
        });
    });

    return countries;
}


// Logic
const createCountryEnterprise = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { enterpriseId, countryId } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const data = await pool.query(dbQueriesCountryEnterprise.createCountryEnterprise, [ enterpriseId, countryId]);
        
        (data)
        ? res.json(newReponse('Country-company created', 'Success', { }))
        : res.json(newReponse('Error create Enterprise', 'Error', { }));
    }
}

const getCountries = async (req, res) => {
    const data = await pool.query(dbQueriesCountry.getAllCountries);
    
    if(data) { 
        (data.rowCount > 0)
        ? res.json(newReponse('All countries', 'Success', dataToCountries(data.rows)))
        : res.json(newReponse('Countries not found', 'Success', []));
    
    } else {
        res.json(newReponse('Error searhing countries', 'Error', { }));
    }
}

const deleteCountryEnterpriseById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { enterpriseId, countryId } = req.params;

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));
    
    } else {
        const data = await pool.query(dbQueriesCountryEnterprise.deleteCountryEnterpriseById, [ enterpriseId, countryId ]);

        (data)
        ? res.json(newReponse('Detele country-company successfully', 'Success', { }))
        : res.json(newReponse('Error on delete with id', 'Error', { }));
    }
}
 

// Export
module.exports = { 
    createCountryEnterprise,
    getCountries,
    deleteCountryEnterpriseById
}