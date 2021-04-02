const table = 'commentary';

module.exports = {
    // Insert
    createComment: `INSERT INTO ${ table } (commentary_dat_cre, commentary_txt, Parent_commentary_ide, post_ide, user_ide) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    
    // Select
    getCommentByPostId: `SELECT * FROM ${ table } WHERE post_ide = $1`,
    
    // Update
    updateCommentById: `UPDATE ${ table } SET commentary_dat_edi = $1, commentary_txt = $2,  
    WHERE commentary_ide = $3 AND user_ide = $4`,

    // Delete
    deleteCommentById: `DELETE FROM ${ table } WHERE commentary_ide = $1 AND user_ide = $2` 
};