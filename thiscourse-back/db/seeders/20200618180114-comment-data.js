'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Comments', [
      {
        user_id: 1,
        thread_id: 1,
        content: 'This is a demo comment',
        is_locked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Comments', null, {});
  }
};
