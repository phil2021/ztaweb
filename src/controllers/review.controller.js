const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { Review } = require('../models');
const { factoryService, reviewService } = require('../services');

/**
 * @desc      Create New Review Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body - Body object data
 * @returns   { JSON } - A JSON object representing the status and review
 */
const createReview = catchAsync(async (req, res) => {
  // const review = await factoryService.createOne(Review, req.body);
  const review = await reviewService.createReview(req.params.attractionId, req.user.id, req.body);
  res.status(httpStatus.CREATED).json({ status: 'success', review });
});

/**
 * @desc      Get All Reviews Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } filter - Mongo filter to Select specific fields
 * @property  { Object } options - Query options
 * @property  { String } [options.sortBy] - Sort option in the format: sortField:(desc|asc) to Sort returned data
 * @property  { Number } [options.limit] - Maximum number of results per page (default = 10)
 * @property  { Number } [options.page] - Current page (default = 1)
 * @returns   { JSON } - A JSON object representing the message and reviews
 */
const getReviews = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['rating', 'user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const review = await factoryService.queryAll(Review, filter, options);
  if (review.results.length === 0) throw new ApiError(httpStatus.NOT_FOUND, 'No Reviews Found');
  res.status(httpStatus.OK).json({ message: 'success', review });
});

/**
 * @desc      Get Review Using It's ID Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.ReviewId - Review ID
 * @returns   { JSON } - A JSON object representing the status, and Review
 */
const getReview = catchAsync(async (req, res) => {
  const review = await factoryService.getDocById(Review, req.params.reviewId, { path: 'reviews' });
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  res.status(httpStatus.OK).json({ status: 'success', review });
});

/**
 * @desc      Update Review Details Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.reviewId - Review ID
 * @property  { Object } req.body - Body object data
 * @returns   { JSON } - A JSON object representing the message and the updated review
 */
const updateReview = catchAsync(async (req, res) => {
  const review = await reviewService.updateReview(req.user.id, req.params.reviewId, req.body);
  res.status(httpStatus.OK).json({ message: 'success', review });
});

/**
 * @desc      Delete Review Using It's ID Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.reviewId - Review ID
 * @returns   { JSON } - An empty JSON object
 */
const deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReview(req.user.id, req.params.reviewId);
  res.status(httpStatus.OK).json({ message: 'review deleted successfully' });
});

module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};
