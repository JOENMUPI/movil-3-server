const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesPost = require('../config/queries/post');
const dbQueriesPostReaction = require('../config/queries/post_reaction');
const dbQueriesReaction = require('../config/queries/reaction');
const dbQueriesComment = require('../config/queries/comment');
const jwt = require('jsonwebtoken');
const timeAgo = require('timeago.js');


// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToPost = (element, reactions, comentaries) => {    
    let postAux = {  
        id: element.post_ide,
        tittle: element.post_tit,
        description: element.post_des,
        img: element.post_img,
        dateCreation: timeAgo.format(element.post_dat_cre),
        dateEdit: element.post_dat_edi,
        connectFlag: element.post_onl_con,
        commentFlag: element.post_com,
        userName: element.user_nam,
        userLastName: element.user_las_nam,
        userId: element.user_ide,
        userEmail: element.user_ema,
        userImg: element.user_img,
        reactions,
        comentaries
    }

    if (postAux.dateEdit != null) {
        postAux.dateEdit = timeAgo.format(postAux.dateEdit);
    }

    if(postAux.userImg != null) {
        postAux.userImg = postAux.userImg.toString();
    }
    
    if(postAux.img != null) {
        postAux.img = postAux.img.toString();
    }

    return postAux;
}

const getAllReactions = async () => {
    const allReactions = await pool.query(dbQueriesReaction.getAllReactions);
    let allReactionsAux  = [];

    if (allReactions) {
        allReactions.rows.forEach(reaction => {
            allReactionsAux.push({ description: reaction.reaction_des, id: reaction.reaction_ide , num: 0, me: false });
        });
    } 

    return allReactionsAux;
}


// Logic
const getPostForHome = async (req, res) => {
    const token = req.headers['x-access-token'];

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));
    
    } else { 
        const dataPost = await pool.query(dbQueriesPost.getPosts);
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
    
        if(!dataPost) {
            res.json(newReponse('Error searching post', 'Error', {})); 

        } else { 
            const allReactions = await getAllReactions();
            let postsAux = [];

            for(let i = 0; i < dataPost.rowCount; i++) { 
                const reactionPost = await pool.query(dbQueriesPostReaction.getReactionsByPostId, [ dataPost.rows[i].post_ide ]);
                const comentaries = await pool.query(dbQueriesComment.getNumCommentByPostId, [ dataPost.rows[i].post_ide ]);
                let reactions = allReactions;

                if(reactionPost) {
                    reactionPost.rows.forEach(item => {
                        reactions = reactions.map(reaction => { 
                            let aux = reaction; 
                            
                            if(reaction.id == item.reaction_ide) { 
                                if (item.user_ide == tokenDecoded.id) {
                                    aux = { ...aux, num: reaction.num + 1, me: true }
                                
                                } else {
                                    aux = { ...aux, num: reaction.num + 1 }
                                } 
                            }

                            return aux;
                        });
                    });
                }
                                                            
                postsAux.push(dataToPost(dataPost.rows[i], reactions, comentaries.rows[0].count)); 
            }

            res.json(newReponse('Posts', 'Success', postsAux)); 
        }
    }
}

const createPost = async (req, res) => {   
    const token = req.headers['x-access-token'];
    const { description, tittle, img, commentFlag, connectFlag } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ new Date(), tittle, description, commentFlag, connectFlag, img, tokenDecoded.id ];
        const data = await pool.query(dbQueriesPost.createPost, arrAux);
        const allReactions = await getAllReactions();
        
        (data)
        ? res.json(newReponse('Post created', 'Success', dataToPost(data.rows[0], allReactions, 0)))
        : res.json(newReponse('Error create post', 'Error', { }));
    }
}

const updatePostById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { description, tittle, img, commentFlag, connectFlag, id } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ new Date(), tittle, description, commentFlag, connectFlag, img, id, tokenDecoded.id ];
        const data = await pool.query(dbQueriesPost.updatePostById, arrAux);
        
        (data)
        ? res.json(newReponse('Post updated', 'Success', { }))
        : res.json(newReponse('Error update post', 'Error', { }));
    }
}

const deletePostById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { postId } = req.params;

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));
    
    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const data = await pool.query(dbQueriesPost.deletePostById, [ postId, tokenDecoded.id ]);

        (data)
        ? res.json(newReponse('Post deleted successfully', 'Success', { }))
        : res.json(newReponse('Error on delete with id', 'Error', { }));
    }
}
 

// Export
module.exports = { 
    getPostForHome,
    createPost,
    updatePostById,
    deletePostById
}