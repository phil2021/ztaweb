const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { User } = require('../models');
const { userService, factoryService } = require('../services');
const logger = require('../config/logger');

const createUser = catchAsync(async (req, res) => {
  const user = await factoryService.createOne(User, req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getMe = (req, res, user, next) => {
  req.params.userId = req.user.id;
  logger.info(req.params.userId);
  next();
};

// eslint-disable-next-line no-unused-vars
const getUser = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.userId);
  logger.info(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  res.send(user);
});

/* 

const getProfile = catchAsync( aync (req, res) => {

}) */
const getProfile = catchAsync(async (req, res) => {
  const profile = await userService.getUserProfile(req.query.token);
  res.status(httpStatus.ACCEPTED).send(profile);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getMe,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
};
