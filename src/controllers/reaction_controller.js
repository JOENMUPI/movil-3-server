const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesReaction = require('../config/queries/reaction');
const dbQueriesPostReaction = require('../config/queries/post_reaction');
const dbQueriesCommentReaction = require('../config/queries/commentary_reaction');
const jwt = require('jsonwebtoken');


// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToCountries = (rows) => {
    const reactions = [];
        
    rows.forEach(element => {
        reactions.push({  
            id: element.reaction_ide,
            description: element.reaction_des,
        });
    });

    return reactions;
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

const createPostReaction = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { postId, reactionId } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ postId, reactionId, tokenDecoded.id ];
        const data = await pool.query(dbQueriesPostReaction.createPostReaction, arrAux);
        
        (data)
        ? res.json(newReponse('Post-reaction created', 'Success', { }))
        : res.json(newReponse('Error create post', 'Error', { }));
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
    getReactions,
    createPostReaction,
    createCommentReaction,
    deletePostReactionById,
    deleteCommentReactionById
}