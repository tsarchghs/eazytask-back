
const express = require("express");
const app = module.exports = express();

const { allowCrossDomain, validateRequest, jwtRequired, passUserFromJWT } = require("../../middlewares");
const { post_messages } = require("./validations");

const { findAll, createMessage } = require("./messages-dal");

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
    return res.json({
        message: "success",
        status: 200,
        data: message
    })
})

