'use strict';
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      role: 'root',
      name: 'root',
      tel: '',
      address: '',
      image: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'mae21@ethereal.email',
      password: bcrypt.hashSync('f6aGSHNg8u6CfubYH8', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user1',
      tel: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
      image: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'elyse.hilpert@ethereal.email',
      password: bcrypt.hashSync('qkr7ndukr4zSGhcmrN', bcrypt.genSaltSync(10), null),
      role: 'user',
      name: 'user2',
      tel: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
      image: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
