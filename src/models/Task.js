"use strict"

const { NonNullString, NonNullStatusField } = require("./common")

let options = {
    opt1: { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
}

module.exports = (sequelize, DataTypes) => {
    let Task = sequelize.define("Task", {
        thumbnail: DataTypes.STRING,
        title: NonNullString(DataTypes.STRING),
        description: NonNullString(DataTypes.STRING),
        due_date_type: {
            type: DataTypes.ENUM("FIXED_DATE","UNTIL_DATE"),
            allowNull: false
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        location: NonNullString(DataTypes.STRING),
        expected_price: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        status: NonNullStatusField(DataTypes.ENUM)
    })
    Task.associate = models => {
        Task.belongsTo(models.Category, options.opt1)
        Task.belongsTo(models.User, options.opt1)
        Task.hasMany(models.Question)
        Task.hasMany(models.Offer)
    }
    return Task;
}