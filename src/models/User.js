"use strict"

const { NonNullUniqueString, NonNullString } = require("./common")

module.exports = (sequelize, DataTypes) => {
    let options = {
        defaultScope: {
            attributes: { exclude: ['password', "verification_token", "phone_verification_token"] },
        },
        scopes: {
            activeOnly: {
                where: {
                    deleted: false
                }
            },
            withPassword: {
                attributes: {},
            },
            withVerificationCode: {
                attributes: { exclude: ["password", "phone_verification_token" ] }
            },
            withPhoneVerificationCode: {
                attributes: { exclude: ["password", "verification_token"]}
            }
        }
    }
    let User = sequelize.define('User', {
        email: NonNullUniqueString(DataTypes.STRING),
        email_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
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
        profile_image: DataTypes.TEXT,
        cover_image: DataTypes.TEXT,
        language: {
            type: DataTypes.STRING,
            defaultValue: "de",
            allowNull: false
        },
        setupCompleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        notification_option: {
            type: DataTypes.ENUM("SMS", "EMAIL"),
            allowNull: false
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        isTasker: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        reason: DataTypes.TEXT,
        verification_token: DataTypes.TEXT,
        phone_number: DataTypes.TEXT,
        phone_verification_token: DataTypes.TEXT
    }, options);
    User.associate = models => {
        User.hasOne(models.Tasker)
        User.hasMany(models.Task);
        User.hasMany(models.Rating)
    }
    
    return User;
};