const router = require('express').Router();
const enterprise = require('../controllers/enterprise_controller');


// Variables
const endPoint = '/enterprise';


// Get
router.get(endPoint, enterprise.getEnterprise);
router.get(`${ endPoint }/:enterpriseId`, enterprise.getEnterpriseById);
router.get(`${ endPoint }/search/:name`, enterprise.getCompaniesByName);


// Post
router.post(endPoint, enterprise.createEnterprise);


// Put
router.put(endPoint, enterprise.updateEnterpriseById);


// Delete
router.delete(`${ endPoint }/:enterpriseId`, enterprise.deleteEnterpriseById);


// Export
module.exports = router;