const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesOffer = require('../config/queries/offer');
const jwt = require('jsonwebtoken');


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
const getReactions = async (req, res) => {
    const data = await pool.query(dbQueriesReaction.getAllReactions);
    
    if(data) { 
        (data.rowCount > 0)
        ? res.json(newReponse('All Reactions', 'Success', dataToCountries(data.rows)))
        : res.json(newReponse('Countries not found', 'Success', []));
    
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
        ? res.json(newReponse('Offer created', 'Success', { }))
        : res.json(newReponse('Error create offer', 'Error', { }));
    }
}

const createCommentReaction = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { commentId, reactionId } = req.body; 
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else { 
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ commentId, reactionId, tokenDecoded.id ]; 
        const data = await pool.query(dbQueriesCommentReaction.createCommentaryReaction, arrAux);
        
        (data)
        ? res.json(newReponse('Comment-reaction created', 'Success', { }))
        : res.json(newReponse('Error create post', 'Error', { }));
    }
}
 
const deletePostReactionById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { postId, reactionId } = req.params;

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));
    
    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ postId, reactionId, tokenDecoded.id ];
        const data = await pool.query(dbQueriesPostReaction.deletePostReactionById, arrAux);

        (data)
        ? res.json(newReponse('Detele post-reaction successfully', 'Success', { }))
        : res.json(newReponse('Error on delete with id', 'Error', { }));
    }
}

const deleteCommentReactionById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { commentId, reactionId } = req.params;

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));
    
    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ commentId, reactionId, tokenDecoded.id ];
        const data = await pool.query(dbQueriesCommentReaction.deleteCommentaryReactionById, arrAux);

        (data)
        ? res.json(newReponse('Detele comment-reaction successfully', 'Success', { }))
        : res.json(newReponse('Error on delete with id', 'Error', { }));
    }
}

// Export
module.exports = { 
    
}