const router = require('express').Router();
const experience = require('../controllers/experience_controller');


// Variables
const endPoint = '/experience';


// Get


// Post
router.post(endPoint, experience.createExperience);


// Put
router.put(endPoint, experience.updateExperienceById);


// Delete
router.delete(`${endPoint}/:experienceId`, experience.deleteExperienceById);


// Export
module.exports = router;