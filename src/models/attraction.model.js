const mongoose = require('mongoose');
const slugify = require('slugify');

const { Schema } = mongoose;
const { toJSON, paginate } = require('./plugins');

const attractionSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the Tourist Attraction!'],
      unique: true,
    },
    altName: {
      type: String,
    },
    slug: String,
    mainImage: {
      type: String,
      default: 'default-cover.jpg',
    },
    mainImageId: String,
    images: {
      type: [String],
      default: 'default.jpg',
      required: [true, 'A Tourist Attraction must have sub images'],
    },
    imagesId: [String],
    summary: {
      type: String,
      trim: true,
      required: [true, 'An Attraction must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    activities: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Activity',
      },
    ],
    destination: {
      type: mongoose.Schema.ObjectId,
      ref: 'Destination',
    },
    attractionLocation: {
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
    openingHours: String,
    highlightSpots: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        description: String,
      },
    ],
    isAccessibleForFree: {
      type: Boolean,
      default: false,
    },
    publicAccess: { type: Boolean, default: true },
    slogan: String,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
attractionSchema.plugin(toJSON);
attractionSchema.plugin(paginate);

attractionSchema.index({ name: 1, destination: 1, keywords: 1, activities: 1 }, { unique: true });
attractionSchema.index({ slug: 1 });
attractionSchema.index({ destinationLocation: '2dsphere' });

// Virtual populate
attractionSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'attraction',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() !.update()
attractionSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE:
attractionSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: 'destination attractions',
    select: 'name',
    options: { _recused: true },
  });
  next();
});
/**
 * @typedef Attraction
 */
const Attraction = mongoose.model('Attraction', attractionSchema);
module.exports = Attraction;
