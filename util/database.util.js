const { Sequelize } = require('sequelize');
const { databaseConfig } = require('../config/database.config');

const sequelize = new Sequelize(
  databaseConfig.databaseName,
  databaseConfig.userName,
  databaseConfig.password,
  {
  host:databaseConfig.host,
  dialect: databaseConfig.type
  });

  

  module.exports = { sequelize }