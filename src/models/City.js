"use strict"

const { NonNullUniqueString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let City = sequelize.define("City",{
        name: NonNullUniqueString(DataTypes.STRING),
        createdByUser: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    })
    City.associate = models => {
        City.belongsToMany(models.Tasker,{ 
            through: models.Tasker_City,
            foreignkey: "CityId"
        })
    }
    return City
}