"use strict"

const { NonNullString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let Skill = sequelize.define("Skill",{
        name: NonNullString(DataTypes.STRING),
        createdByUser: { 
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
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