"use strict"

const { NonNullUniqueString, NonNullString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let options = {
        defaultScope: {
            attributes: { exclude: ['password'] },
        },
        scopes: {
            withPassword: {
                attributes: {},
            }
        }
    }
    let User = sequelize.define('User', {
        email: NonNullUniqueString(DataTypes.STRING),
        password: {
            ...NonNullString(DataTypes.STRING),
        },
        first_name: NonNullString(DataTypes.STRING),
        last_name: NonNullString(DataTypes.STRING),
        gender: DataTypes.STRING,
        date_of_birth: DataTypes.DATEONLY,
        short_biography: DataTypes.STRING,
        city: DataTypes.STRING,
        zipCode: DataTypes.STRING,
        address: DataTypes.STRING,
        profile_image: DataTypes.STRING,
        cover_image: DataTypes.STRING,
        setupCompleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        notification_option: {
            type: DataTypes.ENUM("SMS", "EMAIL"),
            allowNull: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    }, options);
    User.associate = models => {
        User.hasOne(models.Tasker)
        User.hasMany(models.Task);
        User.hasMany(models.Rating)
    }
    
    return User;
};