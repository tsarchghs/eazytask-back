const express = require("express");
const app = module.exports = express();

const { validateRequest, jwtRequired, passUserFromJWT } = require("../../middlewares");
const { get_taskerId, post_taskers } = require("./validations");

const { findOne, createTasker } = require("./taskers-dal");

const { ErrorHandler } = require("../../utils/error");

app.get("/taskers/:taskerId", [
    validateRequest(get_taskerId),
    jwtRequired,
    passUserFromJWT
], async (req, res) => {
    let tasker = await findOne(req.user.id);
    if (!tasker) 
        throw new ErrorHandler(404, "Not found", [`Task not found`])
    return res.json({
        status: 200,
        message: "success",
        data: tasker
    })
})

app.post("/taskers",[
    validateRequest(post_taskers),
    jwtRequired,
    passUserFromJWT
], async (req,res) => {
    console.log({body:req.body})
    let exists = await findOne(req.user.id)
    if (exists) throw new ErrorHandler(409,"Cannot create resource because it conflicts with the current state of the server.",[
        "taskers.UserId must be unique (there is already a tasker assigned to this user"
    ])
    let tasker = await createTasker({ userId: req.user.id, ...req.body })
    return res.json({
        status: 200,
        message: "success",
        data: tasker
    })
})