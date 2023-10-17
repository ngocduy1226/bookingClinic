'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Medicine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Medicine.belongsTo(models.Formulary, { foreignKey: 'formularyId', targetKey: 'id',  as: 'formularyData'});
      // define association here
    }
  };
  Medicine.init({
    name: DataTypes.TEXT,
    description : DataTypes.TEXT,
    uses: DataTypes.TEXT,
    using: DataTypes.TEXT,
    ingredient: DataTypes.TEXT,
    producer: DataTypes.TEXT,
    formularyId: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Medicine',
  });
  return Medicine;
};