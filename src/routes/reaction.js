const router = require('express').Router();
const reaction = require('../controllers/reaction_controller');


// Variables
const endPoint = '/reaction';

// Get
router.get(endPoint, reaction.getReactions);


// Post
router.post(`${ endPoint }/post`, reaction.createPostReaction);
router.post(`${ endPoint }/comment`, reaction.createCommentReaction);

// Put


// Delete
router.delete(`${ endPoint }/post/:postId/:reactionId`, reaction.deletePostReactionById);
router.delete(`${ endPoint }/comment/:commentId/:reactionId`, reaction.deleteCommentReactionById);

// Export
module.exports = router;