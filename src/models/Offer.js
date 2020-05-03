"use strict"

const { NonNullString, NonNullStatusField } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let Offer = sequelize.define("Offer", {
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        description: NonNullString(DataTypes.STRING),
        status: NonNullStatusField(DataTypes.ENUM)
    })
    return Offer;
}