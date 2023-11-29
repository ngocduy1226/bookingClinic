'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Detail_Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Detail_Room.belongsTo(models.Room, { foreignKey: 'roomId', targetKey: 'id',  as: 'DetailRoomData'});
    }
  };
  Detail_Room.init({
    timeType: DataTypes.STRING,
    date: DataTypes.STRING,
    statusId: DataTypes.STRING,
    roomId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Detail_Room',
  });
  return Detail_Room;
};

