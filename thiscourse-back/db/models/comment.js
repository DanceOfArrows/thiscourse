'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    user_id: DataTypes.INTEGER,
    thread_id: DataTypes.INTEGER,
    content: DataTypes.STRING(3000),
    is_locked: DataTypes.BOOLEAN,
  }, {});
  Comment.associate = function (models) {
    Comment.belongsTo(models.Thread, { foreignKey: 'thread_id' });
    Comment.belongsTo(models.User, { foreignKey: 'user_id' });
  };
  return Comment;
};