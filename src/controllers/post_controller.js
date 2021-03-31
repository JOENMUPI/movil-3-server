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
    const countries = [];
        
    rows.forEach(element => {
        countries.push({  
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

    return countries;
}


// Logic
const createPost = async (req, res) => {   
    const token = req.headers['x-access-token'];
    const { description, tittle, img, commentFalg, connectFlag } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ new Date(), tittle, description, commentFalg, connectFlag, img, tokenDecoded.id ];
        const data = await pool.query(dbQueriesPost.createPost, arrAux);
        
        (data)
        ? res.json(newReponse('Post created', 'Success', { }))
        : res.json(newReponse('Error create post', 'Error', { }));
    }
}
 

// Export
module.exports = { 
    createPost
}