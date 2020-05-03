"use strict"

const { NonNullString, NonNullStatusField } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let Task = sequelize.define("Task", {
        thumbnail: NonNullString(DataTypes.STRING),
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
            allowNull: false
        },
        status: NonNullStatusField(DataTypes.ENUM)
    })
    Task.associate = models => {
        Task.belongsTo(models.User)
        Task.hasMany(models.Question)
    }
    return Task;
}