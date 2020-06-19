'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'demo@user.com',
        username: 'demo_user',
        display_name: 'Demo',
        hashed_password: '$2a$10$pzFK8ZRHYZ725vEYW5zUguRNy6M1gTlHS9St35Mp0pq3i9ueXCnfy',
        bio: 'This is a demo user!',
        profile_img: 'https://res.cloudinary.com/lullofthesea/image/upload/v1592425468/Thiscourse/smc58cote4vfnokjtgs7.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'demo@admin.com',
        username: 'demo_admin',
        display_name: 'Demo Admin',
        hashed_password: '$2a$10$pzFK8ZRHYZ725vEYW5zUguRNy6M1gTlHS9St35Mp0pq3i9ueXCnfy',
        bio: 'This is a demo admin!',
        profile_img: 'https://res.cloudinary.com/lullofthesea/image/upload/v1592425468/Thiscourse/smc58cote4vfnokjtgs7.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
