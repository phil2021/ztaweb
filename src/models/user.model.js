const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { facilityCategories, regions } = require('../config/enums');

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please Provide Applicant's Full Name"],
    },
    designation: {
      type: String,
      required: [true, 'Please provide us your designation (e.g. Managing Director)'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
    },
    // Company Details
    companyName: {
      type: String,
      required: [true, 'Please Provide Trading Name of Tourist Facility'],
    },
    facilityCategory: {
      type: String,
      enum: {
        values: facilityCategories,
        message: `{VALUE} is not supported! Category is either: ${facilityCategories}`,
      },
      required: [true, 'Please Provide the Facility Category'],
    },
    region: {
      type: String,
      enum: {
        values: regions,
        message: `{VALUE} is not supported! Region is either: ${regions}`,
      },
      required: [true, 'Please Select your Region!'],
    },
    address: {
      type: String,
      required: [true, 'Please provide Physical Address'],
    },
    // Account Details
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'operator',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    active: { type: Boolean, default: true, select: false },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 12);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
