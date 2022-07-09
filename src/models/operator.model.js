const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { facilityCategories, regions } = require('../config/enums');

const operatorSchema = mongoose.Schema(
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
      match: /\d/,
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
        message: '{VALUE} is not supported! Category is either: {values}',
      },
      required: [true, 'Please Provide the Facility Category'],
    },
    region: {
      type: String,
      enum: {
        values: regions,
        message: '{VALUE} is not supported! Region is either: {values}',
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
      required: [true, 'Please provide an email'],
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
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
operatorSchema.plugin(toJSON);
operatorSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The operator's email
 * @param {ObjectId} [excludeOperatorId] - The id of the operator to be excluded
 * @returns {Promise<boolean>}
 */
operatorSchema.statics.isEmailTaken = async function (email, excludeOperatorId) {
  const operator = await this.findOne({ email, _id: { $ne: excludeOperatorId } });
  return operator;
};

/**
 * Check if password matches the operator's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
operatorSchema.methods.isPasswordMatch = async function (password) {
  const operator = this;
  return bcrypt.compare(password, operator.password);
};

// Encrypt Password Using Bcrypt
operatorSchema.pre('save', async function (next) {
  const operator = this;
  if (operator.isModified('password')) {
    //   Hash the password with cost of 12
    operator.password = await bcrypt.hash(operator.password, 12);
  }

  next();
});

/**
 * @typedef Operator
 */
const Operator = mongoose.model('Operator', operatorSchema);
module.exports = Operator;
