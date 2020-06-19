'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Categories', [
      { name: 'Novels', description: 'For discussing your favorite novels!', parent_category: null, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fiction', description: 'Novels relating to the fiction genre', parent_category: 1, createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
