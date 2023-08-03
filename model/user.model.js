const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/database.util')

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nickname: {
        type: DataTypes.STRING    
    },
    password: {
        type: DataTypes.TEXT
    },
    email: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    birth: {
        type: DataTypes.STRING
    },
    provider: {
        type: DataTypes.STRING
    },
    createdAt: {
        type: DataTypes.DATE
    }, 
    updatedAt: {
        type: DataTypes.DATE
    }


}, {freezeTableName: true}) // table 이름 고정 (변형위험있음)

module.exports = User