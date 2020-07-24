
const express = require("express");
const app = module.exports = express();

const { allowCrossDomain, validateRequest, jwtRequired, passUserFromJWT } = require("../../middlewares");
const { post_messages } = require("./validations");

const { findAll, createMessage } = require("./messages-dal");
const notificationsManager = require("../notifications-manager");

app.use(allowCrossDomain)

app.get("/messages", async (req, res) => {
    let { taskId } = req.query
    let messages = await findAll({ taskId });
    return res.json({
        message: "success",
        status: 200,
        data: messages
    })
})

app.post("/messages", [
    validateRequest(post_messages),
    jwtRequired,
    passUserFromJWT
], async (req, res) => {
    let { taskId, content, client_createdAt } = req.body
    let message = await createMessage({ TaskId: taskId, content, client_createdAt },req.user.id);
    notificationsManager.sendNotification({
        type: "NEW_CHAT_MESSAGE",
        user_2_id: req.user.id,
        task_id: taskId
    })
    return res.json({
        message: "success",
        status: 200,
        data: message
    })
})

