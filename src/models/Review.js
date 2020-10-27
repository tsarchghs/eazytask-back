"use strict"

const { NonNullString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let options = { }
    let rating_field = {
        type: DataTypes.INTEGER,
        allowNull: true
    }
    let Review = sequelize.define("Review",{
        comment: NonNullString(DataTypes.STRING),
        reliability: { ...rating_field },
        punctuality: { ...rating_field },
        accuracy: { ...rating_field },
        quality: { ...rating_field },
        friendliness: { ...rating_field },
        cleanliness: { ...rating_field }
    },options)
    Review.associate = models => {
        Review.belongsTo(models.Task)
        Review.belongsTo(models.User)
    }
    return Review;
}