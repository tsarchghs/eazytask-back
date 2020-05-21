"use strict"

const { NonNullUniqueString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let CategoryGroup = sequelize.define("CategoryGroup",{
        name: NonNullUniqueString(DataTypes.STRING)
    })
    CategoryGroup.associate = models => {
        CategoryGroup.hasMany(models.Category);
    }
    return CategoryGroup
}
