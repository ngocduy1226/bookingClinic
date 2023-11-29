'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Business_Hours extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Business_Hours.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeData'});
  
      // Business_Hours.belongsTo(models.User, { foreignKey: 'doctorId', targetKey: 'id',  as: 'doctorData'});
  
      Business_Hours.belongsTo(models.Clinic, { foreignKey: 'clinicId', targetKey: 'id',  as: 'clinicHoursData'});
      Business_Hours.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeHourData'});

    }
  };
  Business_Hours.init({
    date: DataTypes.STRING,
    timeType: DataTypes.STRING,
    clinicId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Business_Hours',
  });
  return Business_Hours;
};