"use strict"

const { NonNullUniqueString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let Skill = sequelize.define("Skill",{
        name: NonNullUniqueString(DataTypes.STRING)
    })
    Skill.associate = models => {
    Skill.belongsToMany(
            models.Tasker, 
            { 
                through: models.Tasker_Skill, 
                foreignKey: "SkillId"
            }
        );
    }
    return Skill;
}