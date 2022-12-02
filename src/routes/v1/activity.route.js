const express = require('express');
const auth = require('../../middlewares/auth');

const { activityController } = require('../../controllers');

const router = express.Router({ mergeParams: true });

const { setAttractionIds, createActivity, getActivities, getActivity, getActivityBySlug, updateActivity, deleteActivity } =
  activityController;

router.route('/').post(auth(), setAttractionIds, createActivity).get(getActivities);

router.route('/:activityId').get(getActivity).patch(updateActivity).delete(deleteActivity);

router.get('/activity/:slug', getActivityBySlug);

module.exports = router;
