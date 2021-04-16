const router = require('express').Router();
const language = require('../controllers/language_controller');


// Variables
const endPoint = '/language';

// Get
router.get(endPoint, language.getLanguages);


// Post
router.post(endPoint, language.createLanguage);

// Put


// Delete


// Export
module.exports = router;