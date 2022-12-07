const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    review: Joi.string().required(),
    rating: Joi.number().required(),
    attraction: Joi.string().custom(objectId).required(),
    user: Joi.string().custom(objectId).required(),
  }),
};

const getReviews = {
  query: Joi.object().keys({
    rating: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
};

const updateReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    review: Joi.string(),
    rating: Joi.number(),
  }),
};

const deleteReview = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    reviewId: Joi.string().custom(objectId),
  }),
};

module.exports = { createReview, getReviews, getReview, updateReview, deleteReview };
