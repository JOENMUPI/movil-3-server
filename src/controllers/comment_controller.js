const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesCommentary = require('../config/queries/comment');
const jwt = require('jsonwebtoken');
const timeAgo = require('timeago.js');


// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToComment = (element, responses) => {
    let comment = {  
            id: element.commentary_ide,
            text: element.commentary_txt,
            parentId: element.Parent_commentary_ide,
            postId: element.post_ide,
            userId: element.user_ide,
            dateCreation: timeAgo.format(element.commentary_dat_cre),
            dateEdit: element.commentary_dat_edi,
            responses
        }

        if(comment.dateEdit != null) { 
            comment.dateEdit = timeAgo.format(comment.dateEdit);
        } 

    return comment;
}


// Logic
const getCommentByPostId = async (req, res) => { 
    const token = req.headers['x-access-token'];
    const { postId } = req.params;

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const data = await pool.query(dbQueriesCommentary.getCommentByPostId, [ postId ]);
        let commentaries = [];

        if(data) { 
            if (data.rowCount > 0) {
                for(let i = 0; i < data.rowCount; i ++) {
                    const responsesNum = await pool.query(dbQueriesCommentary.getNumResponsesByCommentId, [ data.rows[i].commentary_ide ]);
                    
                    commentaries.push(dataToComment(data.rows[i], 0));
                    if(responsesNum) {
                        commentaries.responses = responsesNum.rows[0].count;
                    }
                }
            } 

            //////////aqui flata tareme al usuario del comentariooooo
            
            res.json(newReponse('Commentaries', 'Success', commentaries))
        
        } else {
            res.json(newReponse('Error searhing Comment', 'Error', { }));
        }

        
        

        
    }
}

const createComment = async (req, res) => {   
    const token = req.headers['x-access-token'];
    const { text, parentId, postId } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ new Date(), text, parentId, postId, tokenDecoded.id ];
        const data = await pool.query(dbQueriesCommentary.createComment, arrAux);
        
        (data)
        ? res.json(newReponse('Comment created', 'Success', dataToComment(data.rows[0], 0)))
        : res.json(newReponse('Error create comment', 'Error', { }));
    }
}

const updateCommentById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { text, id } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ new Date(), text, id, tokenDecoded.id ];
        const data = await pool.query(dbQueriesCommentary.updateCommentById, arrAux);
        
        (data)
        ? res.json(newReponse('Comment updated', 'Success', { }))
        : res.json(newReponse('Error update comment', 'Error', { }));
    }
}

const deleteCommentById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { commentId } = req.params; 

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));
    
    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const data = await pool.query(dbQueriesCommentary.deleteCommentById, [ commentId, tokenDecoded.id ]);

        (data)
        ? res.json(newReponse('Comment deleted successfully', 'Success', { }))
        : res.json(newReponse('Error on delete with id', 'Error', { }));
    }
}
 

// Export
module.exports = { 
    createComment,
    getCommentByPostId,
    updateCommentById,
    deleteCommentById 
}