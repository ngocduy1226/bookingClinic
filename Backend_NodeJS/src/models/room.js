'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Room.hasMany(models.Detail_Room, { foreignKey: 'roomId', as: 'DetailRoomData'});
      Room.hasMany(models.Schedule, { foreignKey: 'roomId', as: 'RoomScheduleData'});
     
      // define association here
      Room.belongsTo(models.Clinic, { foreignKey: 'clinicId', targetKey: 'id',  as: 'roomClinicData'});
    }
  };
  Room.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    delete: DataTypes.BOOLEAN,
    clinicId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};