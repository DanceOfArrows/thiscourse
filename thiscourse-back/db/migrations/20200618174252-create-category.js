'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(32),
        unique: true,
      },
      category_img: {
        type: Sequelize.TEXT,
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING(500),
      },
      parent_category: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'id',
        }
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
    return queryInterface.dropTable('Categories');
  }
};