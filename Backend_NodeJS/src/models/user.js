'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Allcode, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData'});
      User.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData'});
      User.belongsTo(models.Allcode, { foreignKey: 'roleId', targetKey: 'keyMap', as: 'roleData'});


      User.hasOne(models.Markdown, { foreignKey: 'doctorId'});
      User.hasOne(models.Doctor_Info, { foreignKey: 'doctorId'});

      User.hasMany(models.Schedule, { foreignKey: 'doctorId', as: 'doctorData'});
      User.hasMany(models.Booking, { foreignKey: 'patientId', as: 'userData'});
  
      User.hasMany(models.Booking, { foreignKey: 'doctorId', as: 'bookingDoctorData'});
      User.hasMany(models.Comment, { foreignKey: 'patientId', as: 'userCommentData'});
      // define association here
    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    statusUser: DataTypes.BOOLEAN,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    gender: DataTypes.STRING,
    birthday: DataTypes.STRING,
    image: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};