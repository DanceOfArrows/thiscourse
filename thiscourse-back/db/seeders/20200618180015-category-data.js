'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Categories', [
      { name: 'Demo', description: 'A demo category', parent_category: null, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Demo Sub', description: 'A demo subcategory', parent_category: 1, createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
