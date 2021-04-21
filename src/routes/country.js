const router = require('express').Router();
const country = require('../controllers/country_controller');


// Variables
const endPoint = '/country';

// Get
router.get(endPoint, country.getCountries);


// Post
router.post(`${endPoint}/enterprise`, country.createCountryEnterprise);

// Put


// Delete
router.delete(`${endPoint}/enterprise/:enterpriseId/:countryId`, country.deleteCountryEnterpriseById);

// Export
module.exports = router;