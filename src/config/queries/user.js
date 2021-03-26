const table = 'user_1';

module.exports = {
    // Insert
    createUser: `INSERT INTO ${ table } (user_dat_cre, user_nam, user_las_nam, user_ema, user_pas, user_num, country_ide) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    createUserWithImg: `INSERT INTO ${ table } (user_dat_cre, user_nam, user_las_nam, user_ema, user_pas, user_num, country_ide, user_img) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,    
    

    // Select 
    getAllUsers: `SELECT * FROM ${ table }`,
    getUserById: `SELECT * FROM ${ table }  WHERE user_ide = $1`,
    getUserByEmail:`SELECT u.*, c.country_nam FROM ${ table } AS u 
    JOIN country AS c ON c.country_ide = u.country_ide WHERE user_ema = $1`,


    // Update
    updateUserById: `UPDATE ${ table } SET user_nam = $1, user_ema = $2, WHERE user_ide = $3`,
    updatePassById: `UPDATE ${ table } SET user_pas = $1 WHERE user_ide = $2`,


    // Delete
    deleteUserById: `DELETE FROM ${ table } WHERE user_ide = $1`
};