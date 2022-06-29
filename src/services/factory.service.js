const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

/**
 * Create a document
 * @param {Object} docBody
 * @returns {Promise<Model>}
 */

const createOne = async (Model, docBody) => {
  // if (await Model.isEmailTaken(docBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  return Model.create(docBody);
};

/**
 * Query for documents
 * @param {Object} filter - Mongo filter
 * @param {object} options - Query options
 * @param {String} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
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
  let query = Model.findById(id);
  if (popOptions) query = query.populate(popOptions);
  return query;
};
/**
 * Get document by email
 * @param {String} email
 * @returns {Promise <Model>}
 */
const getDocByEmail = async (Model, email) => {
  return Model.findOne({ email });
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
  if (updateBody.email && (await Model.isEmailTaken(updateBody.email, docId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(doc, updateBody);
  await doc.save();
  return doc;
};
/**
 * Delete document by id
 * @param {ObjectId} docId
 * @returns {Promise<Model>}
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
  getDocByEmail,
  updateDocById,
  deleteDocById,
};
