'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@gmail.com',
      password: '111111',
      firstName: 'Lam',
      lastName: 'Duy',
      phoneNumber: '0923456789',
      address: 'ca mau',
      gender: 0,
      roleId: 'R1',
      positionId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
