"use strict"

const { NonNullUniqueString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define('User', {
        email: NonNullUniqueString(DataTypes.STRING),
        password: NonNullUniqueString(DataTypes.STRING),
        first_name: NonNullUniqueString(DataTypes.STRING),
        last_name: NonNullUniqueString(DataTypes.STRING),
        gender: DataTypes.STRING,
        date_of_birth: DataTypes.DATEONLY,
        short_biography: DataTypes.STRING,
        country: DataTypes.STRING,
        city: DataTypes.STRING,
        address: DataTypes.STRING,
        profile_image: DataTypes.STRING,
        notification_option: {
            type: DataTypes.ENUM("SMS", "EMAIL"),
            allowNull: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            default: false,
            allowNull: false
        }
    });
    User.associate = models => {
        User.hasOne(models.Tasker)
        User.hasMany(models.Task);
        User.hasMany(models.Rating)
    }
    
    return User;
};