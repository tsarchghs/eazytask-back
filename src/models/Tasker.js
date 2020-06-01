"use strict"

const { NonNullUniqueString, NonNullString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let Tasker = sequelize.define("Tasker",{
    })
    Tasker.associate = models => {
        Tasker.belongsTo(models.User)
        Tasker.belongsToMany(models.Language, {
            through: models.Tasker_Language,
            foreignKey: "TaskerId"
        })
        Tasker.belongsToMany(models.City, {
            through: models.Tasker_City,
            foreignKey: "TaskerId"
        })
        Tasker.belongsToMany(
            models.Skill, 
            { 
                through: models.Tasker_Skill, 
                foreignKey: "TaskerId"
            }
        );
        Tasker.hasMany(models.Rating)
        Tasker.hasMany(models.Offer);
    }
    return Tasker
}