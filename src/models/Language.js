"use strict"

const { NonNullString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let options = {
        defaultScope: {
            where: {
                createdByUser: false
            }
        }
    }
    let Language = sequelize.define("Language",{
        name: NonNullString(DataTypes.STRING),
        createdByUser: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },options)
    Language.associate = models => {
        Language.belongsToMany(models.Tasker,{ 
            through: models.Tasker_Language,
            foreignkey: "LanguageId"
        })
    }
    return Language
}