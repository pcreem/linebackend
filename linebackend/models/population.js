'use strict';
module.exports = (sequelize, DataTypes) => {
  const Population = sequelize.define('Population', {
    name: DataTypes.STRING
  }, {});
  Population.associate = function (models) {
    // associations can be defined here
    Population.hasMany(models.Product)
  };
  return Population;
};