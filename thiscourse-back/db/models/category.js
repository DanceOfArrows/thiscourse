'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING(32),
    category_img: DataTypes.TEXT,
    description: DataTypes.STRING(500),
    parent_category: DataTypes.INTEGER
  }, {});
  Category.associate = function (models) {
    Category.hasMany(models.Thread, { foreignKey: 'category_id' });
    Category.hasMany(Category, { as: 'SubCategories', foreignKey: 'parent_category' });
  };
  return Category;
};