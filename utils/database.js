const Sequelize = require('sequelize')

module.exports = new Sequelize('market', 'root', '',
    {
        host: "localhost",
        dialect: 'mysql'
    }
)