'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: DataTypes.STRING
  }, {});
  Role.associate = function (models) {
    Role.belongsToMany(models.User, { through: models.UserToRole, foreignKey: 'user_id' });
    Role.belongsToMany(models.Permission, { through: models.RoleToPermission });
  };
  return Role;
};