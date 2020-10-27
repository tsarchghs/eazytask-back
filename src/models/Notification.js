"use strict"

module.exports = (sequelize, DataTypes) => {
    let Notification = sequelize.define("Notification",{
        type: {
            type: DataTypes.ENUM(
                "NEW_CHAT_MESSAGE", "OFFER_RECEIVED", "OFFER_ACCEPTED", "AFTER_OFFER_ACCEPTED",
                "ASKER_TO_TASKER_REVIEW", "TASKER_TO_ASKER_REVIEW"
            ),
            allowNull: false
        },
        read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        sent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
    }, {
        defaultScope: { 
            where: { 
                type: { 
                    [sequelize.Sequelize.Op.not]: "AFTER_OFFER_ACCEPTED" 
                } 
            }
        }
    })
    Notification.associate = models => {
        Notification.belongsTo(models.User, {
            foreignKey: { name: "user_1_id" },
            as: "user_1"
        });
        Notification.belongsTo(models.User, {
            foreignKey: { name: "user_2_id" },
            as: "user_2"
        });
        Notification.belongsTo(models.Task, {
            foreignKey: { name: "task_id" },
            as: "task"
        });
    }
    return Notification
}
