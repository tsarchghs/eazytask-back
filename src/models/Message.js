"use strict"

const { NonNullString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let Message = sequelize.define("Message", {
        content: NonNullString(DataTypes.STRING),
        client_createdAt: {
            type: "TIMESTAMP",
            allowNull: false
        }
    })
    Message.associate = models => {
        Message.belongsTo(models.Task, { foreignKey: { allowNull: false } });
        Message.belongsTo(models.User, { foreignKey: { allowNull: false } });
    }
    return Message
}