const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesEnterprise = require('../config/queries/enterprise');
const dbQueriesCountryEnterprise = require('../config/queries/enterprise_country');
const dbQueriesJob = require('../config/queries/job');
const dbQueriesOffer = require('../config/queries/offer');
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

const dataToJobs = (rows) => {
    const jobs = [];
        
    rows.forEach(element => {
        jobs.push({  
            id: element.job_ide,
            description: element.job_des
        });
    });

    return jobs;
}

const dataToOffers = (rows) => {
    const offers = [];
        
    rows.forEach(element => {
        offers.push({  
            id: element.job_offer_ide,
            tittle: element.job_offer_tit,
            description: element.job_offer_des,
            dateExp: element.job_offer_dat_exp,
            price: element.job_offer_pri,
            jobId: element.job_ide,
            job: {
                description: element.job_des
            }
        });
    });

    return offers;
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

const getCompaniesByName = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { name } = req.params;

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const arrAux = [ `%${name.toUpperCase()}%` ];
        const data = await pool.query(dbQueriesEnterprise.getEnterpriseByName, arrAux);
        
        if(data) { 
            (data.rowCount > 0)
            ? res.json(newReponse('Companies found', 'Success', dataToCompanies(data.rows)))
            : res.json(newReponse('Companies not found', 'Success', []));
        
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
        let data = await pool.query(dbQueriesEnterprise.getEnterpriseById, [ enterpriseId ]);

        (data.rowCount > 0)
        ? data = dataToCompanies(data.rows)[0]
        : res.json(newReponse('Company not found', 'Success', { }));

        if(data) {
            let countriesData = await pool.query(dbQueriesCountryEnterprise.getCountriesByEnterprise, [ enterpriseId ]);
            let jobsData = await pool.query(dbQueriesJob.getJobsByEnterpriseId, [ enterpriseId ]);
            let offersData = await pool.query(dbQueriesOffer.getOffersByEnterpriseId, [ enterpriseId ]);
            
            (offersData)
            ? offersData = dataToOffers(offersData.rows)
            : offersData = [];

            (jobsData)
            ? jobsData = dataToJobs(jobsData.rows)
            : jobsData = [];

            (countriesData)
            ? countriesData = dataToCountries(countriesData.rows)
            : countriesData = [];
    
            const response = {
                ...data,
                countries: countriesData,
                jobs: jobsData,
                offers: offersData
            } 

            res.json(newReponse('Company found', 'Success', response));
        
        } else {
            res.json(newReponse('Error searhing company', 'Error', { }));
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
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const data = await pool.query(dbQueriesEnterprise.deleteEnterpriseById, [ enterpriseId, tokenDecoded.id ]);

        (data)
        ? res.json(newReponse('Detele company successfully', 'Success', { }))
        : res.json(newReponse('Error on delete with id', 'Error', { }));
    }
}

// Export
module.exports = { 
    createEnterprise,
    getCompaniesByName,
    getEnterprise,
    getEnterpriseById,
    updateEnterpriseById,
    deleteEnterpriseById
}