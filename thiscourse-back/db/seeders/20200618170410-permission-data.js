'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Permissions', [
      { name: 'crudThread', createdAt: new Date(), updatedAt: new Date() },
      { name: 'crudComment', createdAt: new Date(), updatedAt: new Date() },
      { name: 'crudCategory', createdAt: new Date(), updatedAt: new Date() },
      { name: 'banUsers', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Permissions', null, {});
  }
};
