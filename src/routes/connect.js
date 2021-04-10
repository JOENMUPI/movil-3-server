const router = require('express').Router();
const connect = require('../controllers/connect_controller');


// Variables
const endPoint = '/connect';

// Get
router.get(endPoint, connect.getConnects);


// Post
router.post(endPoint, connect.createConnect);


// Put
router.put(endPoint, connect.ConfirmConnect);


// Delete
router.delete(`${endPoint}/:userObjId`, connect.deleteConnect);


// Export
module.exports = router;