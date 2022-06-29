const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const destinationValidation = require('../../validations/destination.validation');
const destinationController = require('../../controllers/destination.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageDestinations'),
    validate(destinationValidation.createDestination),
    destinationController.createDestination
  )
  .get(destinationController.getDestinations);

router
  .route('/:destinationId')
  .get(destinationController.getDestination)
  .patch(auth('manageDestinations'), destinationController.updateDestination)
  .delete(auth('manageDestinations'), destinationController.deleteDestination);

router.route('/destinations-within/:distance/center/:latLng/unit/:unit').get(destinationController.getDestinationsWithin);

router.route('/distances/:latLng/unit/:unit').get(destinationController.getDestinationDistances);
module.exports = router;
