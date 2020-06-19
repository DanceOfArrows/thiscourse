'use strict';
module.exports = (sequelize, DataTypes) => {
  const RoleToPermission = sequelize.define('RoleToPermission', {
    role_id: DataTypes.INTEGER,
    permission_id: DataTypes.INTEGER
  }, {});
  RoleToPermission.associate = function(models) {
    // associations can be defined here
  };
  return RoleToPermission;
};