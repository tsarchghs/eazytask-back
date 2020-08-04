
const { Notification, Task, User } = require("../../models");
const { ErrorHandler } = require("../../utils/error")

let includeAllRelations = [
    {
        model: User,
        as: "user_1"
    },
    {
        model: User,
        as: "user_2"
    },
    {
        model: Task,
        as: "task"
    }
]
module.exports = {
    findAll: async ({ user_id }) =>  {
        return Notification.findAll({ 
            where: { user_1_id: user_id },
            order: [
                ['createdAt', 'DESC']
            ],
            include: includeAllRelations
        })
    },
    getDashboardNotifications: async ({ user_id }) => {
        let notifications = await Notification.findAll({
            where: { user_1_id: user_id },
            limit: 5,
            order: [ 
                ['createdAt', 'DESC']
            ],
            include: includeAllRelations

        })
        return notifications;
    },
    findLatestOfferReceivedNotification: async ({ task_id }) => {
        let notification = await Notification.findOne({
            where: {
                type: "OFFER_RECEIVED",
                task_id
            }
        })
        if (!notification)
            throw new ErrorHandler(404, "Not found", [`Notification not found`])
        return notification;
    },
    findLatestOfferReceivedNotificationGeneral: async ({ user_id }) => {
        let notification = await Notification.findOne({
            where: {
                type: "OFFER_RECEIVED",
                user_1_id: user_id
            },
            order: [
                ['createdAt', 'DESC']
            ],
            include: [ 
                { 
                    model: Task,
                    as: "task"
                } 
            ]
        })
        if (!notification)
            throw new ErrorHandler(404, "Not found", [`Notification not found`])
        return notification;
    },
    patchNotification: async (notification_id, patchFields) => {
        let notification = await Notification.findOne({ where: { id: notification_id }});
        notification = await notification.update(patchFields);
        return notification;
    }
}