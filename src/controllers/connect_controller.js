const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesConnect = require('../config/queries/connect');


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
            benefactorId: element.country_ide,
            tittle: element.country_nam,
            code: element.country_num_cod
        });
    });

    return countries;
}


// Logic
const createConnect = (req, res) => {
    const token = req.headers['x-access-token'];
    const { userObjId } = req.body;

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 


    }

    
}
 

// Export
module.exports = { 
   createConnect
}