'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Threads', [
      {
        category_id: 1,
        user_id: 1,
        title: 'Demo Post',
        content: 'This is a demo post',
        is_locked: false,
        is_stickied: true,
        bump_time: null,
        tags: ['novel', 'favorite'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Threads', null, {});
  }
};
