"use strict"

const { NonNullUniqueString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let Language = sequelize.define("Language",{
        name: NonNullUniqueString(DataTypes.STRING),
        createdByUser: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    })
    Language.associate = models => {
        Language.belongsToMany(models.Tasker,{ 
            through: models.Tasker_Language,
            foreignkey: "LanguageId"
        })
    }
    return Language
}