"use strict"

const { NonNullString, NonNullStatusField } = require("./common")
const { Op } = require("sequelize");

const moment = require("moment")

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
        status: {
            type: DataTypes.ENUM("ACTIVE", "DEACTIVATED", "DELETED"),
            default: "ACTIVE",
            allowNull: false
        },
        sent_review_links: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    },{
        defaultScope: {
            where: {
                status: {
                    [Op.and]: [
                        {
                            [Op.not]: "DELETED"
                        },
                        {
                            [Op.not]: "DEACTIVATED"
                        }
                    ]
                },
                due_date: {
                    [Op.gte]: moment()
                }
            }
        },
        scopes: {
            all: {
                where: {}
            },
            history: {
                where: {
                    [Op.or]: [
                        {
                            status: { [Op.not]: "ACTIVE" },
                        },
                        {
                            due_date: {
                                [Op.lte]: moment()
                            }
                        }
                    ]
                }
            },
            allNonDeleted: {
                where: { status: { [Op.not]: "DELETED" } }
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