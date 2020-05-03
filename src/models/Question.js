"use strict"

const { NonNullString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let Question = sequelize.define("Question", {
        value: NonNullString(DataTypes.STRING)
    })
    Question.associate = models => {
        Question.belongsTo(models.Task);
    }
    return Question;
}