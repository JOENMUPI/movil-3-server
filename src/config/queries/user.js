const table = 'user_1';

module.exports = {
    // Insert
    createUser: `INSERT INTO ${ table } (user_dat_cre, user_nam, user_las_nam, user_ema, user_pas, user_num, country_ide, user_img) 
    VALUES ($1, $2, $3, $4, $5, PGP_SYM_ENCRYPT($6,'AES_KEY'), $7, $8)`,    
    

    // Select 
    getAllUsers: `SELECT * FROM ${ table }`, 
    getUserById: `SELECT u.*, c.country_nam FROM ${ table } AS u
    JOIN country AS c ON c.country_ide = u.country_ide WHERE user_ide = $1`,
    getUserByNumber: `SELECT * FROM ${ table } where pgp_sym_decrypt(user_num, 'AES_KEY')::varchar = $1`,
    getUserByEmail:`SELECT u.*, c.country_nam FROM ${ table } AS u 
    JOIN country AS c ON c.country_ide = u.country_ide WHERE user_ema = $1`,


    // Update
    updateUserWithCountryById: `UPDATE ${ table } SET user_nam = $1, user_las_nam = $2, user_ema = $3, 
    user_des = $4, user_img = $5, country_ide = $7
    WHERE user_ide = $6 RETURNING *`,
    updateUserWithoutCountryById: `UPDATE ${ table } SET user_nam = $1, user_las_nam = $2, user_ema = $3, user_des = $4, user_img = $5
    WHERE user_ide = $6 RETURNING *`,
    updatePassById: `UPDATE ${ table } SET user_pas = $1 WHERE user_ide = $2`,
    updateSkillById: `UPDATE ${ table } SET user_ski_jso = $1 WHERE user_ide = $2`,
    updateInterestById: `UPDATE ${ table } SET user_int_jso = $1 WHERE user_ide = $2`,
    updateAwardById: `UPDATE ${ table } SET user_awa_jso = $1 WHERE user_ide = $2`,


    // Delete
    deleteUserById: `DELETE FROM ${ table } WHERE user_ide = $1`
};