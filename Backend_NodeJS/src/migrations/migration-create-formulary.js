'use strict';
module.exports = {


  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('formularies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
       
      },
      description: {
        type: Sequelize.TEXT,
       
      },
       status: {
        type: Sequelize.BOOLEAN,
       
      },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('formularies');
  }
};