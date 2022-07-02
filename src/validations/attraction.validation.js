const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAttraction = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    altName: Joi.string(),
    mainImage: Joi.string().required(),
    mainImageId: Joi.string(),
    images: Joi.array().items(Joi.string()),
    imagesId: Joi.string(),
    summary: Joi.string().required(),
    description: Joi.string(),
    activities: Joi.object().keys({
      name: Joi.string(),
      images: Joi.array().items(Joi.string().required()),
      booking: Joi.string(),
    }),
    keywords: Joi.array().items(Joi.string()),
    destination: Joi.string().custom(objectId),
    destinationLocation: Joi.object().keys({
      description: Joi.string(),
      type: Joi.string().required(),
      coordinates: Joi.array().items(Joi.number().precision(8)),
    }),
    openingHours: Joi.string(),
    highlightSpots: Joi.array().items(
      Joi.object().keys({
        type: Joi.string(),
        coordinates: Joi.array().items(Joi.number()),
        description: Joi.string,
      })
    ),
    isAccessibleForFree: Joi.boolean(),
    publicAccess: Joi.boolean(),
    slogan: Joi.string(),
    ratingsAverage: Joi.number(),
    ratingsQuantity: Joi.number(),
  }),
};

const getAttractions = {
  query: Joi.object().keys({
    name: Joi.string(),
    destination: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAttraction = {
  params: Joi.object().keys({
    attractionId: Joi.string().custom(objectId),
  }),
};

const updateAttraction = {
  params: Joi.object().keys({
    attractionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      altName: Joi.string(),
      mainImage: Joi.string(),
      mainImageId: Joi.string(),
      images: Joi.array().items(Joi.string()),
      imagesId: Joi.string(),
      summary: Joi.string(),
      description: Joi.string(),
      activities: Joi.object().keys({
        name: Joi.string(),
        images: Joi.array().items(Joi.string()),
      }),
      keywords: Joi.array().items(Joi.string()),
      destination: Joi.string().custom(objectId),
      destinationLocation: Joi.object().keys({
        description: Joi.string(),
        type: Joi.string(),
        coordinates: Joi.array().items(Joi.number().precision(8)),
      }),
      openingHours: Joi.string(),
      highlightSpots: Joi.array().items(
        Joi.object().keys({
          type: Joi.string(),
          coordinates: Joi.array().items(Joi.number()),
          description: Joi.string,
        })
      ),
      isAccessibleForFree: Joi.boolean(),
      publicAccess: Joi.boolean(),
      slogan: Joi.string(),
      ratingsAverage: Joi.number(),
      ratingsQuantity: Joi.number(),
    })
    .min(1),
};

const deleteAttraction = {
  params: Joi.object().keys({
    attractionId: Joi.string().custom(objectId),
  }),
};

module.exports = { createAttraction, getAttractions, getAttraction, updateAttraction, deleteAttraction };
