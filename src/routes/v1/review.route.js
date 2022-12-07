const express = require('express');
const { reviewController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { reviewValidation } = require('../../validations/index');
const auth = require('../../middlewares/auth');

const router = express.Router({ mergeParams: true });

const { createReview, getReviews, getReview, updateReview, deleteReview } = reviewController;

router
  .route('/')
  .post(auth('reviewAttraction'), validate(reviewValidation.createReview), createReview)
  .get(auth('getReviews'), validate(reviewValidation.getReviews), getReviews);

router
  .route('/:reviewId')
  .get(auth('getReview'), validate(reviewValidation.getReview), getReview)
  .patch(auth('updateReview'), validate(reviewValidation.updateReview), updateReview)
  .delete(auth('deleteReview'), validate(reviewValidation.deleteReview), deleteReview);

module.exports = router;
