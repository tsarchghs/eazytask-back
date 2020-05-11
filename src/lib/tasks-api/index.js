
const express = require("express");
const app = module.exports = express();

const { validateRequest, jwtRequired, passUserFromJWT } = require("../../middlewares");
const { get_tasks, post_tasks, get_taskId, get_taskId_qa, post_tasks_requestBody } = require("./validations");

const { findOne, findAll, createTask } = require("./tasks-dal");

const { ErrorHandler } = require("../../utils/error")

const multer = require('multer')
const upload = multer();

const uploadMiddleware = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'gallery', maxCount: 8 }
])

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
        validateRequest(post_tasks,false),
        uploadMiddleware,
        jwtRequired,
        passUserFromJWT
    ], async (req, res) => {
        console.log("BODY: ", req.body)
        await post_tasks_requestBody.validate(req.body, { abortEarly: false })
            .catch(err => { throw new ErrorHandler(403, "Validation error", err.errors) })
        console.log("PASSED",req.files.gallery.length)
        let files = {};
        if (req.files) {
            if (req.files["thumbnail"] && req.files["thumbnail"].length) files["thumbnail"] = req.files["thumbnail"][0];
            if (req.files["gallery"] && req.files["gallery"].length) files["gallery"] = req.files["gallery"];
        }
        let task = await createTask({
            user_id: req.user.id,
            ...req.body,
            ...req.query,
            ...files
        });
        return res.json({
            message: "success",
            status: 201,
            data: task
        })
});


module.exports = app;
