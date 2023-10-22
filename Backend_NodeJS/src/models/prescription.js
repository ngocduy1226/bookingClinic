'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     //   Prescription.belongsTo(models.Formulary, { foreignKey: 'formularyId', targetKey: 'id',  as: 'formularyData'});
      // define association here
      Prescription.hasMany(models.Detail_Prescription, { foreignKey: 'prescriptionId', as: 'prescriptionData'});
      Prescription.belongsTo(models.Booking, { foreignKey: 'bookingId'});
    }
  };
  Prescription.init({
    
    symptoms: DataTypes.TEXT,
    diagnosis: DataTypes.TEXT,
    bookingId: DataTypes.INTEGER,


  }, {
    sequelize,
    modelName: 'Prescription',
  });
  return Prescription;
};