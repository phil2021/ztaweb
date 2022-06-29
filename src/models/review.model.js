/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const Attraction = require('./attraction.model');
// Plugins
const { toJSON } = require('./plugins');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    attraction: {
      type: mongoose.Types.ObjectId,
      ref: 'Attraction',
      required: [true, 'Review must belong to an Attraction'],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
reviewSchema.plugin(toJSON);

reviewSchema.index({ attraction: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAverageRatings = async function (attractionId) {
  const stats = await this.aggregate([
    {
      $match: { attraction: attractionId },
    },
    {
      $group: {
        _id: '$attraction',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Attraction.findByIdAndUpdate(attractionId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Attraction.findByIdAndUpdate(attractionId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.attraction);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findByIdAnd/, async function (next) {
  this.rev = await this.findOne();
  next();
});

reviewSchema.post(/^findByIdAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.rev.constructor.calcAverageRatings(this.rev.attraction);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
