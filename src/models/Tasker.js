"use strict"

const { NonNullUniqueString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let Tasker = sequelize.define("Tasker",{
        area_of_activity: NonNullUniqueString(DataTypes.STRING)
    })
    Tasker.associate = models => {
        Tasker.belongsTo(models.User)
        Tasker.belongsToMany(models.Language, {
            through: models.Tasker_Language,
            foreignKey: "TaskerId"
        })
        Tasker.hasMany(models.Rating)
        Tasker.belongsToMany(
            models.Skill, 
            { 
                through: models.Tasker_Skill, 
                foreignKey: "TaskerId"
            }
        );
    }
    return Tasker
}