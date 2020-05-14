"use strict"

const { NonNullString, NonNullStatusField } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let Offer = sequelize.define("Offer", {
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        description: DataTypes.TEXT,
        status: NonNullStatusField(DataTypes.ENUM)
    })

    Offer.associate = models => {
        Offer.belongsTo(models.Tasker, {
            foreignKey: {
                allowNull: false
            },
        })
        Offer.belongsTo(models.Task, {
            foreignKey: {
                allowNull: false
            },
        })
    }

    return Offer;
}