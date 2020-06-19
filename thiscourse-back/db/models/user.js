'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    username: DataTypes.STRING(32),
    display_name: DataTypes.STRING(32),
    hashed_password: DataTypes.STRING.BINARY,
    bio: DataTypes.STRING(500),
    profile_img: DataTypes.TEXT,
  }, {});
  User.associate = function (models) {
    User.belongsToMany(models.Role, { through: models.UserToRole });
    User.hasMany(models.Thread, { foreignKey: 'user_id' });
    User.hasMany(models.Comment, { foreignKey: 'user_id' });
  };
  return User;
};