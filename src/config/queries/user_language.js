const table = 'user_language';

module.exports = {
    // Insert
    createIdiom: `INSERT INTO ${ table } (language_ide, language_level_ide, user_ide) 
    VALUES ($1, $2, $3)`,
    

    // Select
    getIdiomsByUserId: `SELECT ul.*, l.language_des, ll.language_level_des  FROM ${ table } AS ul 
    JOIN language AS l ON l.language_ide = ul.language_ide 
	JOIN language_level AS ll ON ll.language_level_ide = ul.language_level_ide WHERE user_ide = $1`,
    
    
    // Update
    updateIdiomById: `UPDATE ${ table } SET language_level_ide = $2 WHERE (user_ide = $3 AND language_ide = $1)`, 


    // Delete
    deleteIdiomById: `DELETE FROM ${ table } WHERE (language_ide = $1 AND user_ide = $2)`
};