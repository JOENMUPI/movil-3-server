const table = 'user_qualification';

module.exports = {
    // Insert

    
    // Select
    getQualificationByUserId: `SELECT uq.*, u.*, q.* FROM ${ table } AS uq 
    JOIN university AS u ON u.university_ide = uq.university_ide 
    JOIN qualification AS q ON q.qualification_ide = uq.qualification_ide
    WHERE uq.user_ide = $1`,
    
    
    // Update
    

    // Delete

};