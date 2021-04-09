const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesCommentary = require('../config/queries/comment');
const dbQueriesCommentaryReaction = require('../config/queries/commentary_reaction');
const dbQueriesReaction = require('../config/queries/reaction');
const jwt = require('jsonwebtoken');
const timeAgo = require('timeago.js');


// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToComment = (element, responses, reactions) => {
    let comment = {
            name: element.user_nam,
            lastName: element.user_las_nam,
            userId: element.user_ide,
            img: element.user_img,
            id: element.commentary_ide,
            text: element.commentary_txt,
            parentId: element.Parent_commentary_ide,
            postId: element.post_ide,
            userId: element.user_ide,
            dateCreation: timeAgo.format(element.commentary_dat_cre),
            dateEdit: element.commentary_dat_edi,
            responses,
            reactions
        }

        if(comment.img != null) {
            comment.img = comment.img.toString();
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
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        let commentaries = [];

        if(data) { 
            const allReactions = await pool.query(dbQueriesReaction.getAllReactions);
            let allReactionsAux  = [];

            if (allReactions) {
                allReactions.rows.forEach(reaction => {
                    allReactionsAux.push({ description: reaction.reaction_des, id: reaction.reaction_ide , num: 0, me: false });
                });
            } 
                
            for(let i = 0; i < data.rowCount; i ++) { 
                const arrAux = [ data.rows[i].commentary_ide ];
                const reactionComment = await pool.query(dbQueriesCommentaryReaction.getReactionsByCommentaryId, arrAux);
                const responsesNum = await pool.query(dbQueriesCommentary.getNumResponsesByCommentId, [ data.rows[i].commentary_ide ]);  
                let reactions = allReactionsAux;

                if(reactionComment) {
                    reactionComment.rows.forEach(item => {
                        reactions = reactions.map(reaction => { 
                            let aux = reaction; 
                            
                            if(reaction.id == item.reaction_ide) { 
                                (item.user_ide == tokenDecoded.id)  
                                ? aux = { ...aux, num: reaction.num + 1, me: true }
                                : aux = { ...aux, num: reaction.num + 1, me: false }
                            }

                            return aux;
                        });
                    });
                }

                let commentary = dataToComment(data.rows[i], 0, reactions);
                
                if(responsesNum) {
                    commentary.responses = responsesNum.rows[0].count;
                }

                commentaries.push(commentary);
            }
             
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
        ? res.json(newReponse('Comment created', 'Success', dataToComment(data.rows[0], 0, [])))
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