const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesPost = require('../config/queries/post');


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

 

// Export
module.exports = { 
   
}