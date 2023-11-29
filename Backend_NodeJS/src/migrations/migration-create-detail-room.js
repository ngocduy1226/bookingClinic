'use strict';
module.exports = {
      up: async (queryInterface, Sequelize) => {
            await queryInterface.createTable('detail_rooms', {
                  id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER
                  },

                  date: {
                        type: Sequelize.STRING
                  },
                  timeType: {
                        type: Sequelize.STRING
                  },
                  statusId: {
                        type: Sequelize.STRING
                  },
                  roomId: {
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
            await queryInterface.dropTable('detail_rooms');
      }
};