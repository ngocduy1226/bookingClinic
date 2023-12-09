'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Clinic.hasMany(models.Business_Hours, { foreignKey: 'clinicId', as: 'clinicHoursData'});
      Clinic.hasMany(models.Room, { foreignKey: 'clinicId', as: 'roomClinicData'});
    }
  };
  Clinic.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    descriptionMarkdown: DataTypes.TEXT,
    descriptionHTML: DataTypes.TEXT,
    image: DataTypes.TEXT,
    imageSub: DataTypes.TEXT,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Clinic',
  });
  return Clinic;
};