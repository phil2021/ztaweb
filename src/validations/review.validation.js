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

module.exports = { createReview };
