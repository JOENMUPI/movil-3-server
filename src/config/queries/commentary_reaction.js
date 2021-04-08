const table = 'commentary_reaction';

module.exports = {
    // Insert
    createCommentaryReaction: `INSERT INTO ${ table } (commentary_ide, reaction_ide, user_ide) VALUES ($1, $2, $3)`,
   
    
    // Select
    getReactionsByCommentaryId: `Select * FROM ${ table } WHERE commentary_ide = $1`,
    getNumReactionByCommentaryAndReactionId: `SELECT COUNT(cr.*) FROM ${ table } AS cr 
    JOIN reaction AS r ON cr.reaction_ide = r.reaction_ide WHERE cr.commentary_ide = $1 AND cr.reaction_ide = $2`,
    
    
    // Update
    

    // Delete
    deleteCommentaryReactionById: `DELETE FROM ${ table } WHERE commentary_ide = $1 AND reaction_ide = $2 AND user_ide = $3`
};