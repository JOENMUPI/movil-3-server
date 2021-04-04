const table = 'post';

module.exports = {
    // Insert
    createPost: `INSERT INTO ${ table } (post_dat_cre, post_tit, post_des, post_com, post_onl_con, post_img, user_ide) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    

    // Select
    getPostByUserId: `SELECT p.*, u.* FROM ${ table } AS p 
    JOIN user_1 AS u ON u.user_ide = p.user_ide WHERE p.user_ide = $1`,
    getPostByUserIdOnUser: `SELECT * FROM ${ table } WHERE user_ide = $1`,

    
    // Update
    updatePostById: `UPDATE ${ table } SET post_dat_edi = $1, post_tit = $2, post_des = $3, post_com = $4, post_onl_con = $5,  
    post_img = $6 WHERE post_ide = $7 AND user_ide = $8`,


    // Delete
    deletePostById: `DELETE FROM ${ table } WHERE post_ide = $1 AND user_ide = $2`
};