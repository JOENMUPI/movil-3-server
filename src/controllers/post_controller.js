const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesPost = require('../config/queries/post');
const jwt = require('jsonwebtoken');


// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToPost = (rows) => {
    const posts = [];
        
    rows.forEach(element => {
        posts.push({  
            id: element.post_ide,
            tittle: element.post_tit,
            description: element.post_des,
            img: element.post_img,
            dateCreation: element.post_dat_cre,
            dateEdit: element.post_dat_edi,
            connectFlag: element.post_onl_con,
            commentaryFlag: element.post_com,
            userName: element.user_nam,
            userLastName: element.user_las_nam,
            userIde: element.user_ide,
            userImg: element.user_img
        });
    });

    return posts;
}


// Logic
const getpostByUserId = async (req, res) => { //modificar
    const data = await pool.query(dbQueriesPost.getAllCountries);
    
    if(data) { 
        (data.rowCount > 0)
        ? res.json(newReponse('All countries', 'Success', dataToCountries(data.rows)))
        : res.json(newReponse('Countries not found', 'Success', []));
    
    } else {
        res.json(newReponse('Error searhing posts', 'Error', { }));
    }
}

const getpostById = async (req, res) => { //modificar
    const data = await pool.query(dbQueriesPost.getAllCountries);
    
    if(data) { 
        (data.rowCount > 0)
        ? res.json(newReponse('All countries', 'Success', dataToCountries(data.rows)))
        : res.json(newReponse('Countries not found', 'Success', []));
    
    } else {
        res.json(newReponse('Error searhing post', 'Error', { }));
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
        
        (data)
        ? res.json(newReponse('Post created', 'Success', { }))
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
    createPost,
    updatePostById,
    deletePostById
}