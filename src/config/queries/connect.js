const table = 'connect';

module.exports = {
    // Insert
    createConnect: `INSERT INTO ${ table } (user_ide, user_user_ide, connect_pet_flg) VALUES ($1, $2, $3)`,  
    
    
    // Select
    getConnectsByUserId: `SELECT c.*, u.* FROM ${ table } AS c 
    JOIN user_1 AS u ON (u.user_ide = c.user_ide OR u.user_ide = c.user_user_ide) 
    where (c.user_ide = $1 OR c.user_user_ide = $1)`,
    getNumConnectsByUserId: `SELECT COUNT(*) FROM ${ table } WHERE (user_ide = $1 OR user_user_ide = $1) AND connect_pet_flg = true`,
    checkMyconnect: `SELECT * FROM ${ table } WHERE (user_ide = $1 AND user_user_ide = $2) OR (user_ide = $2 AND user_user_ide = $1)`,
    
    
    // Update
    updateConnectsById: `UPDATE ${ table } SET connect_pet_flg = true 
    WHERE (user_ide = $1 AND user_user_ide = $2)`,
    

    // Delete
    deleteConnectById: `DELETE FROM ${ table } WHERE (user_ide = $1 AND user_user_ide = $2) OR (user_ide = $2 AND user_user_ide = $1)`

};