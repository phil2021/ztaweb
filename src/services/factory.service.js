const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

/**
 * Create a document
 * @param {Object} docBody
 * @returns {Promise<Model>}
 */

const createOne = async (Model, docBody) => {
  const doc = await Model.create(docBody);
  return doc;
};

/**
 * Query for documents
 * @param {Object} filter - Mongo filter
 * @param {object} options - Query options
 * @param {String} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>} - QueryResult
 */
const queryAll = async (Model, filter, options) => {
  const docs = await Model.paginate(filter, options);
  return docs;
};

/**
 * Get document by id
 * @param {ObjectId} id
 * @param {Object} popOptions - Populate options
 * @returns {Promise <Model>}
 */
const getDocById = async (Model, id, popOptions) => {
  let query = await Model.findById(id);
  if (popOptions) query = query.populate(popOptions);
  return query;
};

const getOne = async (Model, param, popOptions) => {
  let { query } = param === 'req.params.attractionId' ? Model.findById(param) : Model.findOne({ param });
  /* let query;
  if (param === 'req.params.attractionId') {
    query = Model.findById(param);
  } else {
    query = Model.findOne({ param });
  } */

  if (popOptions) query = query.populate(popOptions);
  return query;
};

/**
 * Get document by slug
 * @param {Object} slug
 * @param {Object} popOptions - Populate options
 * @returns {Promise <Model>}
 */
const getDocBySlug = async (Model, slug, popOptions) => {
  let query = await Model.findOne({ slug });
  if (popOptions) query = query.populate(popOptions);
  return query;
};
/**
 * Get document by email
 * @param {String} email
 * @returns {Promise <Model>}
 */
const getDocByEmail = async (Model, email) => {
  const doc = await Model.findOne({ email });
  return doc;
};

/**
 * Update document by id
 * @param {ObjectId} docId
 * @param {Object} updateBody
 * @returns {Promise<Model>}
 */
const updateDocById = async (Model, docId, updateBody) => {
  const doc = await getDocById(Model, docId);
  if (!doc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Document not found');
  }

  Object.assign(doc, updateBody);
  await doc.save();
  return doc;
};
/**
 * Delete document by id
 * @param {ObjectId} docId
 * @returns {Promise<Model> }
 */
const deleteDocById = async (Model, docId) => {
  const doc = await getDocById(Model, docId);
  if (!doc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Document not found');
  }
  await doc.remove();
  return doc;
};

module.exports = {
  createOne,
  queryAll,
  getDocById,
  getOne,
  getDocBySlug,
  getDocByEmail,
  updateDocById,
  deleteDocById,
};
