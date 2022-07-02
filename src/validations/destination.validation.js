const Joi = require('joi');
const { objectId } = require('./custom.validation');

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

const getDestinations = {
  query: Joi.object().keys({
    name: Joi.string(),
    destination: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getDestination = {
  params: Joi.object().keys({
    destinationId: Joi.string().custom(objectId),
  }),
};

const updateDestination = {
  params: Joi.object().keys({
    destinationId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      summary: Joi.string(),
      keywords: Joi.array().items(Joi.string()),
      touristType: Joi.string(),
      destinationLocation: Joi.object().keys({
        description: Joi.string(),
        type: Joi.string(),
        coordinates: Joi.array().items(Joi.number().precision(8)),
      }),
    })
    .min(1),
};

const deleteDestination = {
  params: Joi.object().keys({
    destinationId: Joi.string().custom(objectId),
  }),
};

module.exports = { createDestination, getDestinations, getDestination, updateDestination, deleteDestination };
