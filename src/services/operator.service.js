const httpStatus = require('http-status');
const { Operator } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a operator
 * @param {Object} operatorBody
 * @returns {Promise<Operator>}
 */
const createOperator = async (operatorBody) => {
  if (await Operator.isEmailTaken(operatorBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return Operator.create(operatorBody);
};

module.exports = {
  createOperator,
};
