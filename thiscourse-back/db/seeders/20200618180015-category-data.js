'use strict';

const faker = require('faker');

let categories = [];

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


for (let i = 0; i < 10; i++) {
  let parent_category;

  if (i >= 5) {
    parent_category = getRandomInt(1, 5);
  } else {
    parent_category = null;
  }

  categories.push({
    name: faker.lorem.word(),
    description: faker.lorem.sentence(),
    parent_category,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Categories', categories, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
