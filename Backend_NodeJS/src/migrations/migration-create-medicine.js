'use strict';
module.exports = {

  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('medicines', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.TEXT,
       
      },
      description: {
        type: Sequelize.TEXT,
       
      },
      uses: {
        type: Sequelize.TEXT,
       
      },
      using: {
        type: Sequelize.TEXT,
       
      },
      using: {
        type: Sequelize.BOOLEAN,
       
      },
      ingredient: {
        type: Sequelize.TEXT,
       
      },  
      producer: {
        type: Sequelize.TEXT,
       
      },
    
      formularyId: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('medicines');
  }
};