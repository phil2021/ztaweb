const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { Activity } = require('../models');
const { factoryService } = require('../services');

const setAttractionIds = (req, res, next) => {
  // allow nested routes
  if (!req.body.attraction) req.body.attraction = req.params.attractionId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

/**
 * @desc      Create New Activity Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body - Body object data
 * @returns   { JSON } - A JSON object representing the status and activity
 */
const createActivity = catchAsync(async (req, res) => {
  const activity = await factoryService.createOne(Activity, req.body);
  res.status(httpStatus.CREATED).json({ status: 'success', activity });
});

/**
 * @desc      Get All Activities Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } filter - Mongo filter to Select specific fields
 * @property  { Object } options - Query options
 * @property  { String } [options.sortBy] - Sort option in the format: sortField:(desc|asc) to Sort returned data
 * @property  { Number } [options.limit] - Maximum number of results per page (default = 10)
 * @property  { Number } [options.page] - Current page (default = 1)
 * @returns   { JSON } - A JSON object representing the status and activities
 */
const getActivities = catchAsync(async (req, res) => {
  let filter = {};
  if (req.params.attractionId) filter = pick(req.query, ['name'], { attraction: req.params.attractionId });

  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const activities = await factoryService.queryAll(Activity, filter, options);
  if (!activities) throw new ApiError(httpStatus.NOT_FOUND, 'Activity not found');

  res.status(httpStatus.OK).json({ status: 'success', activities });
});

/**
 * @desc      Get Activity Using It's ID Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.ActivityId - Activity ID
 * @returns   { JSON } - A JSON object representing the status, and Activity
 */
const getActivity = catchAsync(async (req, res) => {
  const activity = await factoryService.getDocById(Activity, req.params.activityId, { path: 'activities' });
  if (!activity) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Activity not found');
  }
  res.status(httpStatus.OK).json({ status: 'success', activity });
});

/**
 * @desc      Update Activity Details Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.activityId - Activity ID
 * @property  { Object } req.body - Body object data
 * @returns   { JSON } - A JSON object representing the status and the activity
 */
const updateActivity = catchAsync(async (req, res) => {
  const activity = await factoryService.updateDocById(Activity, req.params.activityId, req.body);
  res.send(activity);
});

/**
 * @desc      Delete Activity Using It's ID Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.activityId - Activity ID
 * @returns   { JSON } - An empty JSON object
 */
const deleteActivity = catchAsync(async (req, res) => {
  await factoryService.deleteDocById(Activity, req.params.activityId);
  res.status(httpStatus.NO_CONTENT).json();
});

module.exports = {
  setAttractionIds,
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity,
};
