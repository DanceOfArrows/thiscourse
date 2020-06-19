'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('RoleToPermissions', [
      { role_id: 1, permission_id: 1, createdAt: new Date(), updatedAt: new Date() },
      { role_id: 1, permission_id: 2, createdAt: new Date(), updatedAt: new Date() },
      { role_id: 2, permission_id: 1, createdAt: new Date(), updatedAt: new Date() },
      { role_id: 2, permission_id: 2, createdAt: new Date(), updatedAt: new Date() },
      { role_id: 2, permission_id: 3, createdAt: new Date(), updatedAt: new Date() },
      { role_id: 2, permission_id: 4, createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('RoleToPermissions', null, {});
  }
};
