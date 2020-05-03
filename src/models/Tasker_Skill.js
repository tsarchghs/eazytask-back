
"use strict"

module.exports = (sequelize, DataTypes) => {
    let Tasker_Skill = sequelize.define('Tasker_Skill', {
        // role: DataTypes.STRING
    });
    return Tasker_Skill;
}