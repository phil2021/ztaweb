const allRoles = {
  user: ['getUser', 'manageUser', 'deleteUser'],
  operator: ['getUser', 'manageUser', 'deleteUser'],
  admin: ['getUser', 'getUsers', 'manageUser', 'manageUsers', 'getDestinations', 'manageDestinations', 'manageAttractions'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
