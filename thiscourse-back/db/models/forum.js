'use strict';
module.exports = (sequelize, DataTypes) => {
  const Forum = sequelize.define('Forum', {
    name: DataTypes.STRING,
    parent_forum: DataTypes.INTEGER
  }, {});
  Forum.associate = function (models) {
    Forum.hasMany(models.Thread, { foreignKey: 'forum_id' });
  };
  return Forum;
};