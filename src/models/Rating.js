"use strict"

let ratingIntType = intType => ({
    type: intType,
    validate: {
        min: 1,
        max: 5
    }
})

module.exports = (sequelize, DataTypes) => {
    let Rating = sequelize.define("Rating", {
        rating_type: {
            type: DataTypes.ENUM("ASKER_TO_TASKER","TASKER_TO_ASKER"),
            allowNull: false
        },
        punctuality: ratingIntType(DataTypes.INTEGER),
        accuracy: ratingIntType(DataTypes.INTEGER),
        quality: ratingIntType(DataTypes.INTEGER),
        friendliness: ratingIntType(DataTypes.INTEGER),
        cleanliness: ratingIntType(DataTypes.INTEGER),
        review: DataTypes.STRING
    })
    Rating.associate = models => {
        Rating.belongsTo(
            models.User,
            { 
                foreignKey: {
                    field: "UserId",
                    allowNull: false
                },
                onDelete: "cascade"
            }
        )
        Rating.belongsTo(
            models.Tasker,
            {
                foreignKey: {
                    field: "TaskerId",
                    allowNull: false
                },
                onDelete: "cascade"
            }
        )
    }
    return Rating;
}