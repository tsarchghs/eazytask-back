
const { User, Notification, Task, Message } = require("../../models")

const emailManager = require("../email-manager");
const phoneManager = require("../phone-manager");

const emailNotifications = require("./email-notifications")
const smsNotifications = require("./sms-notifications")

const sendNotificationSMS = async ({ type, ...params }) => {
    let smsContent = smsNotifications[type](params)
    console.log("SENDING", smsContent)
    phoneManager.sendSMS(smsContent)
}

const sendNotificationEmail = async ({ type, ...params}) => {
    let emailContent = emailNotifications[type](params)
    console.log("SENDING",emailContent)
    await emailManager.sendEmail(emailContent)
}

const _sendNotification = async (params,notification) => {
    let { notification_option } = params.user_1;
    if (notification_option === "SMS") 
        await sendNotificationSMS(params);
    else if (notification_option === "EMAIL")
        await sendNotificationEmail(params);
    notification.update({ sent: true })
}

const handleNewChatMessageNotifications = async params => {
    let chat_watchers = [params.user_2_id];
    let task = await Task.findByPk(params.task_id)
    if (task.UserId !== params.user_1_id) chat_watchers.push(task.UserId)
    let messages = await Message.findAll({ where: { TaskId: task.id }})
    for (let msg of messages) 
        if (chat_watchers.indexOf(msg.UserId) === -1)
            chat_watchers.push(msg.UserId)
    let user_2 = await User.findByPk(params.user_2_id) 
    for (let user_id of chat_watchers.filter((v,i) => chat_watchers.indexOf(v) === i)) {
        let notification = await Notification.create({
            type: "NEW_CHAT_MESSAGE",
            user_1_id: user_id,
            user_2_id: params.user_2_id,
            task_id: params.task_id
        })
        let contentParams = { }
        contentParams.type = params.type;
        contentParams.user_1 = await User.findByPk(user_id) 
        contentParams.user_2 = user_2
        contentParams.task = task;
        if (contentParams.user_1.id !== contentParams.user_2.id)
            _sendNotification(contentParams,notification)
    }
}

const handleOfferReceivedNotification = async ({ type, ...params }) => {
    let task = await Task.findByPk(params.task_id)
    params.user_1_id = task.UserId;
    let notification = await Notification.create({
        type: "OFFER_RECEIVED",
        user_1_id: params.user_1_id,
        user_2_id: params.user_2_id,
        task_id: params.task_id
    })
    let contentParams = { }
    contentParams.type = type;
    contentParams.user_1 = await User.findByPk(params.user_1_id) 
    contentParams.user_2 = await User.findByPk(params.user_2_id) 
    contentParams.task = await Task.findByPk(params.task_id) 
    _sendNotification(contentParams,notification)
}

const handleOfferAcceptedNotification = async params => {
    let notification = await Notification.create({
        type: "OFFER_ACCEPTED",
        user_1_id: params.user_1_id,
        user_2_id: params.user_2_id,
        task_id: params.task_id
    })
    let contentParams = { }
    contentParams.type = params.type;
    contentParams.user_1 = await User.findByPk(params.user_1_id) 
    contentParams.user_2 = await User.findByPk(params.user_2_id) 
    contentParams.task = await Task.findByPk(params.task_id) 
    _sendNotification(contentParams,notification)

}

const handleNotification = async params => {
    switch (params.type){
        case "NEW_CHAT_MESSAGE": return await handleNewChatMessageNotifications(params);
        case "OFFER_RECEIVED": return await handleOfferReceivedNotification(params)
        case "OFFER_ACCEPTED": return await handleOfferAcceptedNotification(params);
    }
}

const sendNotification = async ({ type, user_1_id, user_2_id, task_id }) => {
    let params = { type, user_1_id, user_2_id, task_id }
    return await handleNotification(params);
}

module.exports = {
    sendNotification
}