'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, { foreignKey: 'patientId', targetKey: 'id',  as: 'userCommentData'});
      Comment.belongsTo(models.Doctor_Info, { foreignKey: 'infoDoctorId', targetKey: 'doctorId',  as: 'infoDoctorData'});
     
    }
  };
  Comment.init({
    statusId: DataTypes.STRING,
    content: DataTypes.TEXT,
    date: DataTypes.STRING,
    time: DataTypes.STRING,
    infoDoctorId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};

