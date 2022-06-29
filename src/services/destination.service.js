const httpStatus = require('http-status');
const { Destination } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Query for destinations within a certain radius
 * @param {Object} destinationParams
 * @returns {Promise<Destination>}  */

const getDestinationsWithin = async (destinationParams) => {
  // "/destinations-within/233/center/34.111745,-118.113491/unit/mi",
  const { distance, latLng, unit } = destinationParams;
  const [lat, lng] = latLng.split(',');

  if (!lat || !lng) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide latitude and longitude in the format lat, lng');
  }

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  return Destination.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
};

const getDistances = async (destinationParams) => {
  // "/tours-within/233/center/34.111745,-118.113491/unit/mi",
  const { latLng, unit } = destinationParams;
  const [lat, lng] = latLng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide latitude and longitude in the format lat, lng');
  }

  return Destination.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [lng * 1, lat * 1] },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
};

module.exports = {
  getDestinationsWithin,
  getDistances,
};
