const router = require('express').Router();
const comment = require('../controllers/comment_controller');


// Variables
const endPoint = '/comment';

// Get
router.get(`${endPoint}/post/:postId`, comment.getCommentByPostId);


// Post
router.post(endPoint, comment.createComment);


// Put
router.put(endPoint, comment.updateCommentById);


// Delete
router.delete(`${endPoint}/:commentId`, comment.deleteCommentById);


// Export
module.exports = router;