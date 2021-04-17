const table = 'university';

module.exports = {
    // Insert

    
    // Select
    getUniversityByName: `SELECT * FROM ${ table } WHERE UPPER(university_nam) LIKE $1`,
    getQualificationByUniversity: `SELECT q.* FROM university_qualification AS uq 
    JOIN qualification AS q ON q.qualification_ide = uq.qualification_ide WHERE uq.university_ide = $1`,

    // Update
    

    // Delete

    
};