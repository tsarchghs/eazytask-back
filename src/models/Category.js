"use strict"

const { NonNullUniqueString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let Category = sequelize.define("Category",{
        name: NonNullUniqueString(DataTypes.STRING),
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
