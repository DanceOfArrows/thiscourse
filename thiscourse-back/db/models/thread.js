'use strict';
module.exports = (sequelize, DataTypes) => {
  const Thread = sequelize.define('Thread', {
    forum_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING(5000),
    is_locked: DataTypes.BOOLEAN,
    is_stickied: DataTypes.BOOLEAN,
    bump_time: DataTypes.TIME,
    tags: DataTypes.ARRAY(DataTypes.STRING(64))
  }, {});
  Thread.associate = function (models) {
    Thread.hasMany(models.Comment, { foreignKey: 'thread_id' });
    Thread.belongsTo(models.Forum, { foreignKey: 'forum_id' });
    Thread.belongsTo(models.User, { foreignKey: 'user_id' });
  };
  return Thread;
};