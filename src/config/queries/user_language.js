const table = 'user_language';

module.exports = {
    // Insert

    
    // Select
    getIdiomsByUserId: `SELECT ul.* FROM ${ table } AS ul 
    JOIN language AS l ON l.language_ide = ul.language_ide WHERE user_ide = $1`,
    
    
    // Update
    

    // Delete

};