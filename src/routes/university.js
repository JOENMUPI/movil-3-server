const router = require('express').Router();
const university = require('../controllers/university_controller');


// Variables
const endPoint = '/university';


// Get
router.get(`${ endPoint }/search/:name`, university.getUniversitiesByName);
router.get(`${ endPoint }/qualification/:universityId`, university.getQualificationByUniversity);


// Post


// Put


// Delete


// Export
module.exports = router;