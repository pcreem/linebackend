module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Populations',
      ["Atayal", "Bunun", "Tsou", "Rukai", "Paiwan", "Amis", "Pinuyumayan", "Truku", "Sediq", "Tao"]
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

    return queryInterface.bulkDelete('Populations', null, {});

  }
};
