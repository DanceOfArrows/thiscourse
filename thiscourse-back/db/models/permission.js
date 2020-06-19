'use strict';
module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    name: DataTypes.STRING
  }, {});
  Permission.associate = function (models) {
    Permission.belongsToMany(models.Role, { through: models.RoleToPermission });
  };
  return Permission;
};