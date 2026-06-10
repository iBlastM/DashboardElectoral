const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'admins',
  timestamps: true,
  underscored: true
});

module.exports = Admin;
