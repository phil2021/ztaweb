const mongoose = require('mongoose');
const slugify = require('slugify');

const { Schema } = mongoose;
const { toJSON, paginate } = require('./plugins');

const activitySchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'An activity must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'An activity name must be less than or equal to 40 characters'],
      minlength: [10, 'An activity name must not be less than 10 characters'],
    },
    price: {
      type: Number,
      required: [true, 'An activity must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'An activity must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'An activity must have a cover image'],
    },
    images: [String],
    duration: {
      type: Number,
      required: [true, 'An activity must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'An activity must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'An activity must have a difficulty.'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: '{VALUE} is not supported! Difficulty is either: easy, medium, or hard',
      },
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    attraction: {
      type: mongoose.Types.ObjectId,
      ref: 'Attraction',
      required: [true, 'Activity must belong to an Attraction'],
    },
    booking: String,
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
activitySchema.index({ price: 1 });
activitySchema.index({ slug: 1 });
activitySchema.index({ startLocation: '2dsphere' });

// DOCUMENT MIDDLEWARE: runs before .save() and .create() !.update()
activitySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE:
// findByIdAndUpdate
// findByIdAndDelete
activitySchema.pre(/^findByIdAnd/, async function (next) {
  this.act = await this.findOne();
  next();
});
/**
 * @typedef Activity
 */
const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
