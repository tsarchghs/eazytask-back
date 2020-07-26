const express = require("express");
const app = module.exports = express();

const { allowCrossDomain, validateRequest, jwtRequired, passUserFromJWT } = require("../../middlewares");
const { get_taskerId, post_taskers, patch_taskers } = require("./validations");

const { 
    findTaskerByPk, 
    findOne, 
    createTasker,
    updateTaskerSkills,
    updateTaskerLanguages,
    updateTaskerCities,
    findTaskerByUserPk
} = require("./taskers-dal");

const { ErrorHandler } = require("../../utils/error");

const cloneDeep = require("../utils/cloneDeep")

app.use(allowCrossDomain)

app.get("/taskers/:taskerId", [
    validateRequest(get_taskerId,false)
], async (req, res) => {
    let tasker = await findTaskerByPk(req.params.taskerId);
    if (!tasker) 
        throw new ErrorHandler(404, "Not found", [`Tasker not found`])
    tasker = cloneDeep(tasker)
    return res.json({
        status: 200,
        message: "success",
        data: tasker
    })
})

app.patch("/taskers/:taskerId",[
    validateRequest(patch_taskers),
    jwtRequired,
    passUserFromJWT
], async (req,res) => {
    let { cities, languages, skills } = req.body
    console.log("ON_REQ_BODY",req.body)
    let tasker = await findTaskerByPk(req.params.taskerId)
    if (!tasker) throw new Error("Failed findTaskerByUserPk")
    if (languages) tasker = await updateTaskerLanguages({ taskerId: tasker.id, languages})
    if (skills) tasker = await updateTaskerSkills({ taskerId: tasker.id, skills})
    if (cities) tasker = await updateTaskerCities({ taskerId: tasker.id, cities})
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