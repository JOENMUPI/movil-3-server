const router = require('express').Router();
const offer = require('../controllers/offer_controller');


// Variables
const endPoint = '/offer';


// Get
router.get(endPoint, offer.getOffers);


// Post
router.post(endPoint, offer.createOffer);


// Put
router.put(endPoint, offer.updateOfferById);


// Delete
router.delete(`${ endPoint }/enterprise/:offerId`, offer.deleteOfferById);


// Export
module.exports = router;