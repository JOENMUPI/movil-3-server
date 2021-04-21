const table = 'enterprise';

module.exports = {
    // Insert
    createEnterprise: `INSERT INTO ${ table } (enterprise_nam, enterprise_des, enterprise_img, user_ide) VALUES ($1, $2, $3, $4)
    RETURNING *`,    
   
    
    // Select
    getEnterpriseByUserId: `SELECT * FROM ${ table } WHERE (user_ide = $1 AND enterprise_sts = true)`,
    getEnterpriseById: `SELECT e.* FROM ${ table } AS e 
    WHERE e.enterprise_ide = $1`,
    
    
    // Update
    updateEnterpriseById: `UPDATE ${ table } SET enterprise_nam = $1, enterprise_des = $2, enterprise_img = $3  
    WHERE (enterprise_ide = $4 AND user_ide = $5)`,


    // Delete
    deleteEnterpriseById: `UPDATE ${ table } SET enterprise_sts = false WHERE (enterprise_ide = $1 AND user_ide = $2)`
};