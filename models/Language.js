"use strict"

const { NonNullUniqueString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let Language = sequelize.define("Language",{
        name: NonNullUniqueString(DataTypes.STRING)
    })
    Language.associate = models => {
        Language.belongsToMany(models.Tasker,{ 
            through: models.Tasker_Language,
            foreignkey: "LanguageId"
        })
    }
    return Language
}