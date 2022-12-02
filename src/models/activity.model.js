const mongoose = require('mongoose');
const slugify = require('slugify');

const { toJSON, paginate } = require('./plugins');

const activitySchema = mongoose.schema(
  {
    name: String,
    description: String,
    images: [String],
    booking: String,
    attraction: {
      type: mongoose.Types.ObjectId,
      ref: 'Attraction',
      required: [true, 'Activity must belong to an Attraction'],
    },
    slug: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
activitySchema.plugin(toJSON);
activitySchema.plugin(paginate);

activitySchema.index({ attraction: 1, name: 1 }, { unique: true });

// DOCUMENT MIDDLEWARE: runs before .save() and .create() !.update()
activitySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
/**
 * @typedef Activity
 */
const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
