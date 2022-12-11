const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filter');
const { User, Review } = require('../models');
const logger = require('../config/logger');
const { userService, factoryService } = require('../services');

/**
 * @desc      Create New User
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body - Body object data
 * @returns   { JSON } - A JSON object representing the status and user
 */
const createUser = catchAsync(async (req, res) => {
  const user = await factoryService.createOne(User, req.body);
  res.status(httpStatus.CREATED).json({ status: 'success', user });
});

/**
 * @desc      Get All Users
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } filter - Mongo filter to Select specific fields
 * @property  { Object } options - Query options
 * @property  { String } [options.sortBy] - Sort option in the format: sortField:(desc|asc) to Sort returned data
 * @property  { Number } [options.limit] - Maximum number of results per page (default = 10)
 * @property  { Number } [options.page] - Current page (default = 1)
 * @returns   { JSON } - A JSON object representing the status and users
 */
const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const users = await userService.queryUsers(filter, options);
  res.status(httpStatus.OK).json({ status: 'success', users });
});

/**
 * @desc      Get All User Reviews Controller
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
  if (!req.query.user) req.query.user = req.user.id;
  const filter = pick(req.query, ['rating', 'user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const review = await factoryService.queryAll(Review, filter, options);
  if (review.results.length === 0) throw new ApiError(httpStatus.NOT_FOUND, 'No Reviews Found');
  res.status(httpStatus.OK).json({ message: 'success', review });
});

/**
 * @desc      Get User Data Using It's ID Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.userId - User ID
 * @returns   { JSON } - A JSON object representing the status, and User data
 */
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  res.status(httpStatus.FOUND).json({ status: 'success', user });
});

/**
 * @desc      Get Current logged in User
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.user.id - Current User ID
 * @returns   { JSON } - A JSON object representing the status, and User data
 */
const getProfile = catchAsync(async (req, res) => {
  const profile = await userService.getUserById(req.user.id);
  res.status(httpStatus.OK).json({ status: 'success', profile });
});

/**
 * @desc      Update User Details
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.userId - User ID
 * @property  { Object } req.body - Body object data
 * @returns   { JSON } - A JSON object representing the status and the user
 */
const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

/**
 * @desc      Update LoggedIn User Details Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body - Body object data
 * @property  { Object } req.user.id - An object contains logged in user data
 * @returns   { JSON } - A JSON object representing the status, and user data
 */
const updateMyAccount = catchAsync(async (req, res) => {
  // 1) Create an error if user tries to update password data
  if (req.body.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This route is not for password updates! Please use auth/reset-password');
  }

  // 2) Filter out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'address');
  if (req.file) filteredBody.photo = req.file.filename;
  logger.info(req.file.filename);
  // 3) Update user document
  const updatedUser = await userService.updateUserById(req.user.id, filteredBody);

  res.status(httpStatus.OK).json({ status: 'success', data: { user: updatedUser } });
});

/**
 * @desc      Delete User Using It's ID Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.userId - User ID
 * @returns   { JSON } - An empty JSON object
 */
const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * @desc      Delete LoggedIn User's Data Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.user.id - An object contains logged in user data
 * @returns   { JSON } - A JSON object representing the status and message
 */
const deleteMyAccount = catchAsync(async (req, res) => {
  // Find user document and deactivate it
  const user = await userService.updateUserById(req.user.id, { active: 'false' });
  if (!user.active === true) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account does not exist');
  }
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateMyAccount,
  deleteUser,
  deleteMyAccount,
  getProfile,
  getReviews,
};
