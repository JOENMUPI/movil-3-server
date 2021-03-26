const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesCountry = require('../config/queries/country');


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
 

// Export
module.exports = { 
    getCountries,
}