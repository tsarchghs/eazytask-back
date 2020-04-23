"use strict"

const { NonNullString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let Skill = sequelize.define("Skill", {
        name: NonNullString(DataTypes.STRING)
    })
    return Skill;
}