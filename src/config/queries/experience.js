const table = '_experience';

module.exports = {
    // Insert
    createExperience: `INSERT INTO ${ table } 
    (experience_dat_sta, experience_dat_end, experience_job, experience_typ_job, enterprise_ide, user_ide) 
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,    
    
    
    // Select
    getExperienceById: `SELECT * FROM ${ table } WHERE (user_ide = $1 AND experience_ide = $2)`,
    getExperienceByUserId: `SELECT ex.*, en.* FROM ${ table } AS ex 
    JOIN enterprise AS en ON en.enterprise_ide = ex.enterprise_ide 
    WHERE ex.user_ide = $1`,

    
    // Update
    updatetExperienceById: `UPDATE ${ table } SET experience_dat_sta = $1, experience_dat_end = $2, experience_job = $3, 
    experience_typ_job = $4, enterprise_ide = $5 
    WHERE (user_ide = $6 AND experience_ide = $7)`, 


    // Delete
    deleteExperienceById: `DELETE FROM ${ table } WHERE (user_ide = $1 AND experience_ide = $2)`
};