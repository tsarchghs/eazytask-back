"use strict"

const { NonNullString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let Category = sequelize.define("Category",{
        name: NonNullString(DataTypes.STRING),
        createdByUser: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }    
    })
    Category.associate = models => {
        Category.hasMany(models.Task);
    }
    return Category
}
