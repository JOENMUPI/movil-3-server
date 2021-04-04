const router = require('express').Router();
const reaction = require('../controllers/reaction_controller');


// Variables
const endPoint = '/reaction';

// Get
router.get(endPoint, reaction.getReactions);


// Post
router.post(`endPoint/post`, reaction.createReactionComment);

// Put


// Delete


// Export
module.exports = router;