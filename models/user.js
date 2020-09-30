const Sequelize = require('sequelize')

const sequelize = require('../utils/database')

module.exports = sequelize.define('user',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }
    })