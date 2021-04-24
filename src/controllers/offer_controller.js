const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesOffer = require('../config/queries/offer');


// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToOffers = (rows) => {
    const offers = [];
        
    rows.forEach(element => {
        let aux = {  
            id: element.job_offer_ide,
            tittle: element.job_offer_tit,
            description: element.job_offer_des,
            price: element.job_offer_pri,
            enterpriseId: element.enterprise_ide,
            enterprise: element.enterprise_nam,
            img: element.enterprise_img,
            jobId: element.job_ide,
        }

        if(aux.img != null) {
            aux.img = aux.img.toString();
        }

        offers.push(aux);
    });

    return offers;
}


// Logic
const getOffers = async (req, res) => {
    const data = await pool.query(dbQueriesOffer.getOffers, [ new Date() ]);
    
    if(data) { 
        (data.rowCount > 0)
        ? res.json(newReponse('All offers', 'Success', dataToOffers(data.rows)))
        : res.json(newReponse('Offers not found', 'Success', []));
    
    } else {
        res.json(newReponse('Error searhing countries', 'Error', { }));
    }
}

const createOffer = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { tittle, description, price, dateExp, enterpriseId, jobId } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const arrAux = [ tittle, description, dateExp, price, jobId, enterpriseId ]; 
        const data = await pool.query(dbQueriesOffer.createOffer, arrAux);
        
        (data)
        ? res.json(newReponse('Offer created', 'Success', dataToOffers(data.rows)[0]))
        : res.json(newReponse('Error create offer', 'Error', { }));
    }
}

const updateOfferById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { tittle, description, price, dateExp, jobId, id } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const arrAux = [ tittle, description, dateExp, price, jobId, id ];
        const data = await pool.query(dbQueriesOffer.updateOfferById, arrAux);
        
        (data)
        ? res.json(newReponse('Offer updated', 'Success', { }))
        : res.json(newReponse('Error update offer', 'Error', { }));
    }
}
 
const deleteOfferById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { offerId } = req.params;

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));
    
    } else {
        const data = await pool.query(dbQueriesOffer.deleteOfferById, [ offerId ]);

        (data)
        ? res.json(newReponse('Detele offer successfully', 'Success', { }))
        : res.json(newReponse('Error on delete with id', 'Error', { }));
    }
}

// Export
module.exports = { 
    getOffers,
    createOffer,
    updateOfferById,
    deleteOfferById
}