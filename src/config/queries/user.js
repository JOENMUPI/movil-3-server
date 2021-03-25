const table = 'user_1';

module.exports = {
    // Insert
    createUsers: `INSERT INTO ${ table } (user_nam, user_ema, user_pas) VALUES ($1, $2, $3) 
    RETURNING user_ide`,
    
    
    // Select 
    getAllUsers: `SELECT * FROM ${ table }`,
    getUserById: `SELECT * FROM ${ table }  WHERE user_ide = $1`,
    getUserByEmail: `SELECT * FROM ${ table } WHERE user_ema = $1`,
    getUserByNumber: `SELECT * FROM ${ table } WHERE user_num = $1`,
    getUsersByEmailAndPassword: `SELECT * FROM ${ table }  WHERE user_email = $1 AND user_pas = $2`,


    // Update
    updateUserById: `UPDATE ${ table } SET user_nam = $1, user_ema = $2, WHERE user_ide = $3`,
    updatePassById: `UPDATE ${ table } SET user_pas = $1 WHERE user_ide = $2`,


    // Delete
    deleteUserById: `DELETE FROM ${ table } WHERE user_ide = $1`
};