'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Detail_Prescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Detail_Prescription.belongsTo(models.Medicine, { foreignKey: 'medicineId', targetKey: 'id',  as: 'medicineData'});
        Detail_Prescription.belongsTo(models.Prescription, { foreignKey: 'prescriptionId', targetKey: 'id',  as: 'prescriptionData'});

        Detail_Prescription.belongsTo(models.Allcode, { foreignKey: 'dosage', targetKey: 'keyMap', as: 'dosageData'});
        Detail_Prescription.belongsTo(models.Allcode, { foreignKey: 'frequency', targetKey: 'keyMap', as: 'frequencyData'});
      
        // define association here
    }
  };
  Detail_Prescription.init({
    
    dosage: DataTypes.TEXT,
    frequency : DataTypes.TEXT,
    medicineId: DataTypes.INTEGER,
    prescriptionId: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Detail_Prescription',
  });
  return Detail_Prescription;
};