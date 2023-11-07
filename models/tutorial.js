'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tutorial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.category,{
        foreignKey: "id",
        as: "category"
      }),
      this.hasMany(models.detail,{
        foreignKey: "id_tutorial",
        as: "detail"
      })
    }
  }
  tutorial.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_category: DataTypes.INTEGER,
    title: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tutorial',
    tableName: 'tutorial'
  });
  return tutorial;
};