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
    let City = sequelize.define("City",{
        name: NonNullString(DataTypes.STRING),
        createdByUser: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },options)
    City.associate = models => {
        City.belongsToMany(models.Tasker,{ 
            through: models.Tasker_City,
            foreignkey: "CityId"
        })
    }
    return City
}