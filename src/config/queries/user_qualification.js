const table = 'user_qualification';

module.exports = {
    // Insert
    createUserQualification: `INSERT INTO ${ table } 
    (qualification_ide, university_ide, user_qualification_not, user_qualification_dat_cre, user_qualification_dat_end, user_ide) 
    VALUES ($1, $2, $3, $4, $5, $6)`,    
    
    // Select
    getQualificationByUserId: `SELECT uq.*, u.*, q.* FROM ${ table } AS uq 
    JOIN university AS u ON u.university_ide = uq.university_ide 
    JOIN qualification AS q ON q.qualification_ide = uq.qualification_ide
    WHERE uq.user_ide = $1`,
    
    
    // Update
    updatetQualificationById: `UPDATE ${ table } SET qualification_ide = $1, university_ide = $2, user_qualification_not = $3, 
    user_qualification_dat_cre = $4, user_qualification_dat_end = $5 
    WHERE (user_ide = $6 AND qualification_ide = $7 AND university_ide = $8)`, 

    // Delete
    deleteQualificationById: `DELETE FROM ${ table } WHERE (user_ide = $1 AND qualification_ide = $2 AND university_ide = $3)`
};