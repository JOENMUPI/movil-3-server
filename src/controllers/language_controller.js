const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesLanguage = require('../config/queries/language');
const dbQueriesLanguageLvl = require('../config/queries/language_level');
const dbQueriesUserLanguage = require('../config/queries/user_language');
const jwt = require('jsonwebtoken');


// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToLanguage = (rows) => {
    const languages = [];
        
    rows.forEach(element => {
        languages.push({  
            id: element.language_ide,
            description: element.language_des
        });
    });

    return languages;
}

const dataToLanguageLvl = (rows) => {
    const languagesLvl = [];
        
    rows.forEach(element => {
        languagesLvl.push({  
            id: element.language_level_ide,
            description: element.language_level_des
        });
    });

    return languagesLvl;
}


// Logic
const getLanguages = async (req, res) => {
    const token = req.headers['x-access-token'];

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const idiomsData = await pool.query(dbQueriesLanguage.getAllLanguages);
        const idiomsLvlData = await pool.query(dbQueriesLanguageLvl.getAllLanguagesLvl);
        let response = { data: [], lvl: [] }
    
        if(idiomsData.rowCount > 0) {
            response.data = dataToLanguage(idiomsData.rows);
        }
    
        if(idiomsLvlData.rowCount > 0) {
            response.lvl = dataToLanguageLvl(idiomsLvlData.rows);
        }
        
        res.json(newReponse('All idioms', 'Success', response));
    }
}

const createLanguage = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { languageId, levelId } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ languageId, levelId, tokenDecoded.id ];
        const data = await pool.query(dbQueriesUserLanguage.createIdiom, arrAux);
        
        (data)
        ? res.json(newReponse('Post-reaction created', 'Success', { }))
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
    getLanguages,
    createLanguage,
}