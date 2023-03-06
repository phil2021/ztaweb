const express = require('express');
const auth = require('../../middlewares/auth');

const { activityController } = require('../../controllers');

const router = express.Router({ mergeParams: true });

const { createActivity, getActivities, getActivity, updateActivity, deleteActivity } = activityController;

router.route('/').post(auth(), createActivity).get(getActivities);

router.route('/:activityId').get(auth(), getActivity).patch(auth(), updateActivity).delete(auth(), deleteActivity);

module.exports = router;
