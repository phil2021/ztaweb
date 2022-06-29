const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { Destination } = require('../models');
const { factoryService, distanceService } = require('../services');

const createDestination = catchAsync(async (req, res) => {
  const destination = await factoryService.createOne(Destination, req.body);
  res.status(httpStatus.CREATED).send(destination);
});

const getDestinations = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await factoryService.queryAll(Destination, filter, options);
  res.send(result);
});

const getDestination = catchAsync(async (req, res) => {
  const destination = await factoryService.getDocById(Destination, req.params.destinationId);
  if (!destination) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Destination not found');
  }
  res.send(destination);
});

const updateDestination = catchAsync(async (req, res) => {
  const destination = await factoryService.updateDocById(Destination, req.params.destinationId, req.body);
  res.send(destination);
});

const deleteDestination = catchAsync(async (req, res) => {
  await factoryService.deleteDocById(Destination, req.params.destinationId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getDestinationsWithin = catchAsync(async (req, res) => {
  const destination = await distanceService.getPlacesWithin(Destination, req.params);
  res.send({ status: 'success', results: destination.length, destination });
});

const getDestinationDistances = catchAsync(async (req, res) => {
  const distance = await distanceService.getDistances(Destination, req.params);
  res.send({ results: distance.length, distance });
});

module.exports = {
  createDestination,
  getDestinations,
  getDestination,
  updateDestination,
  deleteDestination,
  getDestinationsWithin,
  getDestinationDistances,
};
