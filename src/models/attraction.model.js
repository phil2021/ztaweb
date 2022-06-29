const mongoose = require('mongoose');
const slugify = require('slugify');
const { toJSON, paginate } = require('./plugins');

const attractionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the Tourist Attraction!'],
      trim: true,
    },
    altName: {
      type: String,
      trim: true,
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
    imagesId: Array,
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
    destination: { type: mongoose.Schema.ObjectId, ref: 'Destination' },
    keywords: [String],
    location: {
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

// DOCUMENT MIDDLEWARE: runs before .save() and .create() !.update()
attractionSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
/**
 * @typedef Attraction
 */
const Attraction = mongoose.model('Attraction', attractionSchema);
module.exports = Attraction;
