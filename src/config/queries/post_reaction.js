const table = 'post_reaction';

module.exports = {
    // Insert
    createPostReaction: `INSERT INTO ${ table } (post_ide, reaction_ide, user_ide) VALUES ($1, $2, $3)`,
   
    
    // Select
    getReactionsByPostId: `Select * FROM ${ table } WHERE post_ide = $1`, 
    getNumReactionByPostAndReactionId: `SELECT COUNT(pr.*) FROM ${ table } AS pr 
    JOIN reaction AS r ON ps.reaction_ide = r.reaction_ide WHERE pr.post_ide = $1 AND pr.reaction_ide = $2`,
    
    
    // Update
    

    // Delete

};