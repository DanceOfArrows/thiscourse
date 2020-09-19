'use strict';

const faker = require('faker');

let threads = [];

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

for (let i = 0; i < 200; i++) {
  threads.push({
    category_id: getRandomInt(1, 11),
    user_id: 1,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    is_locked: false,
    is_stickied: getRandomInt(1, 11) === 7 || getRandomInt(1, 11) === 9 ? true : false,
    bump_time: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Threads', threads, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Threads', null, {});
  }
};
