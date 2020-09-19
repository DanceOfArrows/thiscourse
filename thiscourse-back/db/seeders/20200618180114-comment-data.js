'use strict';

const faker = require('faker');

let comments = [];

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

for (let i = 0; i < 1000; i++) {
  comments.push({
    user_id: 1,
    thread_id: getRandomInt(1, 201),
    content: faker.lorem.sentences(),
    is_locked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Comments', comments, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Comments', null, {});
  }
};
