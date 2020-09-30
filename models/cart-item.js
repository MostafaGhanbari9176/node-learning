const Sequelize = require('sequelize')

const sequelize = require('../utils/database')

module.exports = sequelize.define("cartItem",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        count: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        }
    })