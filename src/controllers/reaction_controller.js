const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesReaction = require('../config/queries/reaction');
const dbQueriesPostReaction = require('../config/queries/post_reaction');

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

const createReactionComment = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { postId, reactionId } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ postId, reactionId, tokenDecoded.id ];
        const data = await pool.query(dbQueriesPostReaction.createPostReaction, arrAux);
        
        (data)
        ? res.json(newReponse('Post created', 'Success', { }))
        : res.json(newReponse('Error create post', 'Error', { }));
    }
}
 

// Export
module.exports = { 
    getReactions,
    createReactionComment
}