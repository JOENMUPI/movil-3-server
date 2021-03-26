const router = require('express').Router();
const country = require('../controllers/country_controller');


// Variables
const endPoint = '/country';

// Get
router.get(endPoint, country.getCountries);


// Post


// Put


// Delete


// Export
module.exports = router;