'use strict';
module.exports = {
      up: async (queryInterface, Sequelize) => {
            await queryInterface.createTable('comments', {
                  id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER
                  },
                  statusId: {
                        type: Sequelize.STRING,
                        allowNull: false,
                  },
                  content: {
                        type: Sequelize.TEXT,
                  },
                  date: {
                        type: Sequelize.STRING,
                        allowNull: false,
                  },
                  time: {
                        type: Sequelize.STRING,
                        allowNull: false,
                  },
                  infoDoctorId: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                  },
                  patientId: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
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
            await queryInterface.dropTable('comments');
      }
};