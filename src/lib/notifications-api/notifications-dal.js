
const { Notification, Task } = require("../../models");
const { ErrorHandler } = require("../../utils/error")

module.exports = {
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
    }
}