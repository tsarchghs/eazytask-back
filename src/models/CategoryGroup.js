"use strict"

const { NonNullString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let CategoryGroup = sequelize.define("CategoryGroup",{
        name: NonNullString(DataTypes.STRING)
    })
    CategoryGroup.associate = models => {
        CategoryGroup.hasMany(models.Category, { allowNull: true});
    }
    return CategoryGroup
}
