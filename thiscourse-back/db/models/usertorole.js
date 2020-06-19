'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserToRole = sequelize.define('UserToRole', {
    user_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER
  }, {});
  UserToRole.associate = function(models) {
    // associations can be defined here
  };
  return UserToRole;
};