const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const destinationRoute = require('./destination.route');
const attractionRoute = require('./attraction.route');
const reviewRoute = require('./review.route');
const activityRoute = require('./activity.route');
const docsRoute = require('./docs.route');

const config = require('../../config/config');

const router = express.Router();
const defaultRoutes = [
  { path: '/auth', route: authRoute },
  { path: '/users', route: userRoute },
  { path: '/destinations', route: destinationRoute },
  { path: '/attractions', route: attractionRoute },
  { path: '/reviews', route: reviewRoute },
  { path: '/activities', route: activityRoute },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
