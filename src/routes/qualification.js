const router = require('express').Router();
const qualification = require('../controllers/qualification_controller');


// Variables
const endPoint = '/qualification';


// Get


// Post
router.post(`${endPoint}/user`, qualification.createQualification);


// Put
router.put(`${endPoint}/user`, qualification.updateQualificationById);


// Delete
router.delete(`${endPoint}/user/:qualificationId/:universityId`, qualification.deleteQualificationById);


// Export
module.exports = router;