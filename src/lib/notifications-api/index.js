
const express = require("express");
const app = module.exports = express();

const { allowCrossDomain, validateRequest, jwtRequired, passUserFromJWT } = require("../../middlewares");
const { 
    get_latest_offer_received_notification_validation
} = require("./validations");

const { 
    findLatestOfferReceivedNotification,
    findLatestOfferReceivedNotificationGeneral 
} = require("./notifications-dal");

app.use(allowCrossDomain)

app.get("/get_latest_offer_received_notification/:task_id", [
    validateRequest(get_latest_offer_received_notification_validation, false),
], async (req, res) => {
    let { task_id } = req.params;
    let notification = await findLatestOfferReceivedNotification({ task_id });
    return res.json({
        message: "success",
        status: 200,
        data: notification
    })
})

app.get("/get_latest_offer_received_notification_general", [
    jwtRequired, passUserFromJWT
], async (req, res) => {
    let user_id = req.user.id;
    let notification = await findLatestOfferReceivedNotificationGeneral({ user_id });
    return res.json({
        message: "success",
        status: 200,
        data: notification
    })
})
