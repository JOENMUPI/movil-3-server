const table = 'post';

module.exports = {
    // Insert
    createPost: `INSERT INTO ${ table } (post_dat_cre, post_tit, post_des, post_com, post_onl_con, post_img, user_ide) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    
    // Select
    getPostByUserId: `SELECT * FROM ${ table } WHERE user_ide = $1`,

    
    // Update
    

    // Delete

};