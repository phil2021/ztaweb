const express = require('express');
const { reviewController } = require('../../controllers');

const router = express.Router({ mergeParams: true });

const { setAttractionIds, createReview, getReviews, getReview, getReviewBySlug, updateReview, deleteReview } =
  reviewController;

router.route('/').post(setAttractionIds, createReview).get(getReviews);

router.route('/:reviewId').get(getReview).patch(updateReview).delete(deleteReview);

router.get('/review/:slug', getReviewBySlug);

module.exports = router;
