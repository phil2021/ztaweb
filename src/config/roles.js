const allRoles = {
  user: ['getUser'],
  operator: ['getUser'],
  admin: ['getUser', 'getUsers', 'manageUser', 'manageUsers', 'getDestinations', 'manageDestinations', 'manageAttractions'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
