
const express = require("express");
const app = module.exports = express();

const { validateRequest, jwtRequired, passUserFromJWT } = require("../../middlewares");
const { get_tasks, post_tasks, get_taskId, get_taskId_qa } = require("./validations");

const { findOne, findAll, createTask } = require("./tasks-dal");

const multer = require('multer')
const upload = multer();


app.get('/tasks', validateRequest(get_tasks), async (req, res) => {
    let tasks = await findAll(req.query);
    return res.json({
        message: "success",
        status: 200,
        data: tasks
    })
});

app.get('/tasks/:taskId', validateRequest(get_taskId), async (req, res) => {
    let tasks = await findOne(Number(req.params.taskId),req.query);
    return res.json({
        message: "success",
        status: 200,
        data: tasks
    })
});

app.post('/tasks',
    [
        validateRequest(post_tasks),
        upload.single("thumbnail"),
        jwtRequired,
        passUserFromJWT
    ], async (req, res) => {
        let task = await createTask({
            user_id: req.user.id,
            ...req.body,
            ...req.query
        });
        return res.json({
            message: "success",
            status: 201,
            data: task
        })
});


module.exports = app;
