const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    designation: Joi.string().required(),
    phone: Joi.string().required(),
    companyName: Joi.string().required(),
    facilityCategory: Joi.string().required(),
    region: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      fullName: Joi.string(),
      designation: Joi.string(),
      phone: Joi.string(),
      companyName: Joi.string(),
      facilityCategory: Joi.string(),
      region: Joi.string(),
      address: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().custom(password),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
