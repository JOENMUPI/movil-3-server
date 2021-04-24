const router = require('express').Router();
const experience = require('../controllers/experience_controller');


// Variables
const endPoint = '/experience';


// Get


// Post
router.post(`${endPoint}/user`, experience.createExperience);


// Put
router.put(`${endPoint}/user`, experience.updateExperienceById);


// Delete
router.delete(`${endPoint}/user/:experienceId`, experience.deleteExperienceById);


// Export
module.exports = router;