const router = require('express').Router();
const reaction = require('../controllers/reaction_controller');


// Variables
const endPoint = '/reaction';

// Get
router.get(endPoint, reaction.getReactions);


// Post
router.post(`${ endPoint }/post`, reaction.createPostReaction);

// Put


// Delete
router.delete(`${ endPoint }/post/:postId/:reactionId`, reaction.deletePostReactionById);

// Export
module.exports = router;