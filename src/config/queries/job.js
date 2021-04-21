const table = 'job';

module.exports = {
    // Insert
    createJob: `INSERT INTO ${ table } (job_des, enterprise_ide) VALUES ($1, $2) RETURNING *`,    
   
    
    // Select
    getJobsByEnterpriseId: `SELECT * FROM ${ table } WHERE enterprise_ide = $1`,
    
    
    // Update
    updateJobById: `UPDATE ${ table } SET job_des = $1 WHERE (job_ide = $2)`,


    // Delete
    deleteJobById: `DELETE FROM ${ table } WHERE job_ide = $1`
};