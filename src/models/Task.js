"use strict"

const { NonNullString, NonNullStatusField } = require("./common")
const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    let Task = sequelize.define("Task", {
        thumbnail: DataTypes.TEXT,
        gallery: DataTypes.TEXT,
        title: NonNullString(DataTypes.STRING),
        description: NonNullString(DataTypes.STRING),
        due_date_type: {
            type: DataTypes.ENUM("FIXED_DATE","UNTIL_DATE"),
            allowNull: true
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        address: NonNullString(DataTypes.STRING),
        zipCode: NonNullString(DataTypes.STRING),
        city: NonNullString(DataTypes.STRING),
        expected_price: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        status: NonNullStatusField(DataTypes.ENUM)
    },{
        defaultScope: {
            where: {
                status: {
                    [Op.not]: "DELETED"
                }
            }
        },
        getterMethods: {
            formattedGallery() {
                if (!this.gallery) return undefined;
                return this.gallery.split(",")
            }
        }
    })
    Task.associate = models => {
        Task.belongsTo(models.Category, { 
            foreignKey: { 
                allowNull: false 
            },
        })
        Task.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
        Task.hasMany(models.Question)
        Task.hasMany(models.Offer)
    }
    return Task;
}