const Joi = require('joi');

const createDestination = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    summary: Joi.string().required(),
    keywords: Joi.array().items(Joi.string()),
    touristType: Joi.string(),
    destinationLocation: Joi.object().keys({
      description: Joi.string(),
      type: Joi.string().required(),
      coordinates: Joi.array().items(Joi.number().precision(8)),
    }),
  }),
};

module.exports = { createDestination };
