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

module.exports = router;
