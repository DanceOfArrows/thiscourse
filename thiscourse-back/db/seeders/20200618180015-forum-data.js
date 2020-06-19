'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Forums', [
      { name: 'Novels', parent_forum: null, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fiction', parent_forum: 1, createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Forums', null, {});
  }
};
