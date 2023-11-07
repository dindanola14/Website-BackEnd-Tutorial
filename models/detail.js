'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.tutorial,{
        foreignKey: "id_tutorial",
        as: "tutorial"
      })
    }
  }
  detail.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_tutorial: DataTypes.INTEGER,
    urutan: DataTypes.STRING,
    deskripsi: DataTypes.STRING,
    picture: DataTypes.STRING,
    video: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'detail',
    tableName: "detail"
  });
  return detail;
};