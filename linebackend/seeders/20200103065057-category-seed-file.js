'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Categories',
      ['Grains', 'Vegetables', 'fruit']
        .map((item, index) =>
          ({
            //id: index + 1, 
            name: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('Categories', null, {});

  }
};
