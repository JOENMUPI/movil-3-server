const router = require('express').Router();
const post = require('../controllers/post_controller');


// Variables
const endPoint = '/post';


// Get


// Post
router.post(endPoint, post.createPost);


// Put
router.put(endPoint, post.updatePostById);

// Delete
router.delete(`${endPoint}/:postId`, post.deletePostById);

// Export
module.exports = router;