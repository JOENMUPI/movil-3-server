const router = require('express').Router();
const post = require('../controllers/post_controller');


// Variables
const endPoint = '/post';


// Get


// Post
router.post(endPoint, post.createPost);


// Put


// Delete


// Export
module.exports = router;