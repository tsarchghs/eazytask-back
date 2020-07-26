"use strict"

const { NonNullString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let options = {
        // defaultScope: {
        //     where: {
        //         createdByUser: false
        //     }
        // }
    }
    let Skill = sequelize.define("Skill",{
        name: NonNullString(DataTypes.STRING),
        createdByUser: { 
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },options)
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