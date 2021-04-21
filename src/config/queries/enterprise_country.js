const table = 'enterprise_country';

module.exports = {
    // Insert
    createCountryEnterprise: `INSERT INTO ${ table } (enterprise_ide, country_ide) VALUES ($1, $2)`,    
   
    
    // Select
    getCountriesByEnterprise: `SELECT c.* FROM ${ table } AS ec 
    JOIN country AS c ON c.country_ide = ec.country_ide WHERE ec.enterprise_ide = $1`,

    
    // Update
    updateEnterpriseById: `UPDATE ${ table } SET enterprise_nam = $1, enterprise_des = $2, enterprise_img = $3  
    WHERE (enterprise_ide = $4 AND user_ide = $5)`,


    // Delete
    deleteCountryEnterpriseById: `DELETE FROM ${ table } WHERE enterprise_ide = $1 AND country_ide = $2`
};