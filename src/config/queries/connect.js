const table = 'connect';

module.exports = {
    // Insert
    createConnect: `INSERT INTO ${ table } (user_ide, user_user_ide, connect_pet_flg) VALUES ($1, $2, $3)`,  
    
    
    // Select
    getConnectsByUserId: `SELECT c.*, u.* FROM connect AS c 
    JOIN user_1 AS u ON (u.user_ide = c.user_ide OR u.user_ide = c.user_user_ide) 
    where (c.user_ide = $1 OR c.user_user_ide = $1)`,
    
    
    // Update
    updateConnectsByUserId: `SELECT c.*, u.* FROM connect AS c 
    JOIN user_1 AS u ON (u.user_ide = c.user_ide OR u.user_ide = c.user_user_ide) 
    where (c.user_ide = $1 OR c.user_user_ide = $1)`,
    

    // Delete


};