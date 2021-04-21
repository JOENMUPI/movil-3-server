const router = require('express').Router();
const job = require('../controllers/job_controller');


// Variables
const endPoint = '/job';

// Get


// Post
router.post(endPoint, job.createJob);


// Put
router.put(endPoint, job.updatejobById);


// Delete
router.delete(`${ endPoint }/:jobId`, job.deleteJobById);

// Export
module.exports = router;