
const express = require("express");
const app = module.exports = express();

const { allowCrossDomain, validateRequest, jwtRequired, passUserFromJWT } = require("../../middlewares");
const { 
    get_tasks, 
    post_tasks, 
    get_taskId, 
    get_taskId_qa, 
    post_tasks_requestBody,
    patch_tasks,
    patch_tasks_requestBody,
    delete_tasks
} = require("./validations");

const { findOne, findAll, createTask, countAll, patchTask } = require("./tasks-dal");

const { ErrorHandler } = require("../../utils/error")

const multer = require('multer')
const upload = multer();

// const uploadMiddleware = upload.fields([
//     { name: 'thumbnail', maxCount: 1 },
//     { name: 'gallery', maxCount: 4 }
// ])

const formatMulterAny = files => {
    console.log(files)
    let obj = {}
    for (let fileObj of files){
        let { fieldname } = fileObj;
        let isArray = fieldname.indexOf("[]") !== -1;
        if (isArray) {
            if (!obj[fieldname]) obj[fieldname] = []
            obj[fieldname].push(fileObj)
        } else {
            obj[fieldname] = fileObj
        }
    }
    console.log(obj,"objobj")
    return obj;
}

const uploadMiddleware = upload.any()

app.use(allowCrossDomain)

app.get("/tasks/count", async (req,res) => {
    let count = await countAll(req.query);
    return res.json({
        message: "success",
        status: 200,
        data: { count }
    })
})

app.get('/tasks', validateRequest(get_tasks,false), async (req, res) => {
    let tasks = await findAll(req.query);
    return res.json({
        message: "success",
        status: 200,
        data: tasks
    })
});

app.get('/tasks/:taskId', validateRequest(get_taskId,false), async (req, res) => {
    let tasks = await findOne(Number(req.params.taskId),req.query);
    return res.json({
        message: "success",
        status: 200,
        data: tasks
    })
});

app.patch('/tasks/:taskId',
    [
        validateRequest(patch_tasks,false),
        uploadMiddleware,
        jwtRequired,
        passUserFromJWT
    ], async (req, res) => {    
        await patch_tasks_requestBody.validate(req.body, { abortEarly: false })
            .catch(err => { throw new ErrorHandler(403, "Validation error", err.errors) })
        console.log(req.body,req.query,req.files,199)
        let files = req.files ? formatMulterAny(req.files) : undefined; 
        let task = await findOne(req.params.taskId)
        if (task.UserId !== req.user.id) throw new ErrorHandler(401,"Unauthorized")
        task = await patchTask(task,{
            ...req.body,
            ...req.query,
            thumbnail: files && files["thumbnail"],
            gallery: files &&files["gallery[]"]
        });
        return res.json({
            message: "success",
            status: 200,
            data: task
        })
});

app.delete('/tasks/:taskId',
    [
        validateRequest(delete_tasks,false),
        uploadMiddleware,
        jwtRequired,
        passUserFromJWT
    ], async (req, res) => {
        let task = await findOne(req.params.taskId)
        if (task.UserId !== req.user.id) throw new ErrorHandler(401, "Unauthorized")
        task = await patchTask(task, { status: "DELETED" })
        return res.json({
            message: "success",
            status: 200,
            data: task
        })
});


app.post('/tasks',
    [
        validateRequest(post_tasks,false),
        uploadMiddleware,
        jwtRequired,
        passUserFromJWT
    ], async (req, res) => {
        await post_tasks_requestBody.validate(req.body, { abortEarly: false })
            .catch(err => { throw new ErrorHandler(403, "Validation error", err.errors) })
        files = formatMulterAny(req.files); 
        let task = await createTask({
            user_id: req.user.id,
            ...req.body,
            ...req.query,
            thumbnail: files["thumbnail"],
            gallery: files["gallery[]"]
        });
        return res.json({
            message: "success",
            status: 201,
            data: task
        })
});


module.exports = app;
