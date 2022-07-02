const mongoose = require('mongoose');
const slugify = require('slugify');
const { toJSON, paginate } = require('./plugins');

const attractionSchema = mongoose.Schema(
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
      required: [true, 'A Tourist Attraction must have a main image'],
    },
    mainImageId: String,
    images: {
      type: [String],
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
    activities: {
      name: { type: String },
      images: {
        type: [String],
        required: [true, 'An Activity must have sub images'],
      },
      booking: String,
    },
    keywords: [String],
    destination: {
      type: mongoose.Schema.ObjectId,
      ref: 'Destination',
    },
    destinationLocation: {
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
  this.populate({
    path: 'destination',
    select: 'name',
  });
  next();
});
/**
 * @typedef Attraction
 */
const Attraction = mongoose.model('Attraction', attractionSchema);
module.exports = Attraction;
