const allRoles = {
  user: [
    'getUser',
    'manageUser',
    'deleteUser',
    'reviewAttraction',
    'getReviews',
    'getReview',
    'updateReview',
    'deleteReview',
  ],
  operator: ['getUser', 'manageUser', 'deleteUser'],
  admin: [
    'getUser',
    'getUsers',
    'manageUser',
    'manageUsers',
    'getDestinations',
    'manageDestinations',
    'manageAttractions',
    'getReviews',
    'getReview',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
