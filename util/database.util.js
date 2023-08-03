const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('baker', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
  });

  module.exports = { sequelize }