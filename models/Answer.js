"use strict"

const { NonNullString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let Answer = sequelize.define("Answer", {
        name: NonNullString(DataTypes.STRING)
    })
    Answer.associate = models => {
        Answer.belongsTo(models.Question);
    }
    return Answer;
}