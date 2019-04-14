const Sequelize = require('sequelize')


const HeroiSchemma = {
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: Sequelize.STRING,
            required: true
        },
        poder: {
            type: Sequelize.STRING,
            required: true
        }
    },
    options: {
        tableName: 'TB_HEROIS',
        feezeTableName: false,
        timestamps: false
    }
}

module.exports = HeroiSchemma