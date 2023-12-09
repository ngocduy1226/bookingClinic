'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Formulary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Formulary.hasMany(models.Medicine, { foreignKey: 'formularyId', as: 'formularyData'});
      // define association here
    }
  };
  Formulary.init({
    name: DataTypes.STRING,
    description : DataTypes.TEXT,
    status : DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Formulary',
  });
  return Formulary;
};