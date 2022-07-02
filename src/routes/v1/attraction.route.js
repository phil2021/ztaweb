const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { attractionValidation } = require('../../validations');
const { attractionController } = require('../../controllers');

const router = express.Router();

const {
  createAttraction,
  getAttractions,
  getAttraction,
  getAttractionBySlug,
  updateAttraction,
  deleteAttraction,
  getAttractionsWithin,
  getAttractionDistances,
} = attractionController;

router
  .route('/')
  .post(auth('manageAttractions'), validate(attractionValidation.createAttraction), createAttraction)
  .get(validate(attractionValidation.getAttractions), getAttractions);

router
  .route('/:attractionId')
  .get(validate(attractionValidation.getAttraction), getAttraction)
  .patch(auth('manageAttractions'), validate(attractionValidation.updateAttraction), updateAttraction)
  .delete(auth('manageAttractions'), validate(attractionValidation.deleteAttraction), deleteAttraction);

router.get('/attraction/:slug', getAttractionBySlug);
router.route('/attractions-within/:distance/center/:latLng/unit/:unit').get(getAttractionsWithin);

router.route('/distances/:latLng/unit/:unit').get(getAttractionDistances);
module.exports = router;
