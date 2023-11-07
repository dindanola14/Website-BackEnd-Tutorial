'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.tutorial,{
        foreignKey: "id_category",
        as: "tutorial"
      })
    }
  }
  category.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    picture: DataTypes.STRING,
    detail: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    status: DataTypes.ENUM('Active' , 'Inactive'),
    category: DataTypes.ENUM('Dashboard' , 'Assistant')
  }, {
    sequelize,
    modelName: 'category',
    tableName: "category"
  });
  return category;
};