const router = require('express').Router();
const qualification = require('../controllers/qualification_controller');


// Variables
const endPoint = '/qualification';


// Get


// Post
router.post(`${endPoint}/user`, qualification.createQualification);


// Put


// Delete


// Export
module.exports = router;