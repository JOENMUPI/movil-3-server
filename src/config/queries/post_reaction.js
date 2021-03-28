const table = 'post_reaction';

module.exports = {
    // Insert

    
    // Select
    getReactionsByPostId: `Select * FROM ${ table } WHERE post_ide = $1`, 
    getNumReactionByPostAndReactionId: `SELECT Count(pr.*), r.reaction_des FROM ${ table } AS pr 
    JOIN reaction AS r ON ps.reaction_ide = r.reaction_ide WHERE pr.post_ide = $1 AND pr.reaction_ide = $2`,
    
    
    // Update
    

    // Delete

};