const table = 'user_language';

module.exports = {
    // Insert
    createIdiom: `INSERT INTO ${ table } (language_ide, language_level_ide, user_ide) 
    VALUES ($1, $2, $3)`,
    
    // Select
    getIdiomsByUserId: `SELECT ul.* FROM ${ table } AS ul 
    JOIN language AS l ON l.language_ide = ul.language_ide WHERE user_ide = $1`,
    
    
    // Update
    

    // Delete

};