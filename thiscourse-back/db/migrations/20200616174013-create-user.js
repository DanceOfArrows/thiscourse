'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING(32),
        unique: true,
      },
      display_name: {
        allowNull: false,
        type: Sequelize.STRING(32),
        unique: true,
      },
      hashed_password: {
        allowNull: false,
        type: Sequelize.STRING.BINARY
      },
      bio: {
        type: Sequelize.STRING(500)
      },
      profile_img: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};