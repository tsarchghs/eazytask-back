"use strict"

const { NonNullUniqueString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let Category = sequelize.define("Category",{
        name: NonNullUniqueString(DataTypes.STRING)
    })
    Category.associate = models => {
        Category.hasMany(models.Task);
    }
    return Category
}
