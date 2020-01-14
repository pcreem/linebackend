'use strict';
module.exports = (sequelize, DataTypes) => {
  const Line = sequelize.define('Line', {
    usersn: DataTypes.STRING,
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Line.associate = function(models) {
    // associations can be defined here
  };
  return Line;
};