const Sequelize = require('sequelize')

const sequelize = require('../utils/database')

module.exports = sequelize.define('product',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            allowNull: false,
            type: Sequelize.STRING
        },
        price: {
            allowNull: false,
            type: Sequelize.FLOAT
        }
    })