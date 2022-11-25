const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const activitySchema = mongoose.schema(
  {
    name: String,
    description: String,
    images: String,
    booking: String,
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
activitySchema.plugin(toJSON);

/**
 * @typedef Activity
 */
const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
