'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, { foreignKey: 'patientId', targetKey: 'id',  as: 'userData'});
      Booking.belongsTo(models.User, { foreignKey: 'doctorId', targetKey: 'id',  as: 'bookingDoctorData'});
      Booking.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypePatient'});
      Booking.belongsTo(models.Allcode, { foreignKey: 'statusId', targetKey: 'keyMap', as: 'statusData'});
      Booking.hasOne(models.Prescription, { foreignKey: 'bookingId'});
    }
  };
  Booking.init({
    statusId: DataTypes.STRING,
    doctorId: DataTypes.INTEGER,
    patientId: DataTypes.STRING,
    date: DataTypes.STRING,
    timeType:DataTypes.STRING,
    token:DataTypes.STRING,
    reason: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};

