const table = 'job_offer';

module.exports = {
    // Insert
    createOffer: `INSERT INTO ${ table } (job_offer_tit, job_offer_des, job_offer_dat_exp, job_offer_pri, job_des, job_ide, enterprise_ide) 
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,    
   
    
    // Select
    getOffersByEnterpriseId: `SELECT * FROM ${ table } WHERE enterprise_ide = $1`,
    getOffers: `SELECT jo.*, e.enterprise_img, e.enterprise_nam FROM ${ table } AS jo 
    JOIN enterprise AS e ON e.enterprise_ide = jo.enterprise_ide ORDER BY jo.job_offer_ide DESC`,
    
    // Update
    updateOfferById: `UPDATE ${ table } SET job_offer_tit = $1, job_offer_des = $2, job_offer_dat_exp = $3, 
    job_offer = $4, job_ide = $5, enterprise_ide = $6 WHERE (job_offer_ide = $7)`,


    // Delete
    deleteOfferById: `DELETE FROM ${ table } WHERE job_offer_ide = $1`
};