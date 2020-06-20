'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Categories', [
      { name: 'Novels', category_img: 'https://res.cloudinary.com/lullofthesea/image/upload/v1592596598/Thiscourse/axfsejoky6a2jc0gpxoq.png', description: 'For discussing your favorite novels!', parent_category: null, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fiction', description: 'Novels relating to the fiction genre', parent_category: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Video Games', description: 'For all things related to video games!', parent_category: null, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sports', description: 'For all sports related topics!', parent_category: null, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Programming', description: 'For all things coding!', parent_category: null, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
