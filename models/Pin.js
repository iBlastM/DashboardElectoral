const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Pin = sequelize.define('Pin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'admins',
      key: 'id'
    }
  },
  usado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  expiracion: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'pins',
  timestamps: true,
  underscored: true
});

module.exports = Pin;
