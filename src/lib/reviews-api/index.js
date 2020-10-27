const express = require("express");
const app = module.exports = express();
const { Task, Offer } = require("../../models")

const { allowCrossDomain, validateRequest, jwtRequired, passUserFromJWT } = require("../../middlewares");
const { post_reviews } = require("./validations");

const { 
    findOne,
    createReview
} = require("./reviews-dal");

const { ErrorHandler } = require("../../utils/error");

require("./jobs")()

app.use(allowCrossDomain)

app.post("/reviews", [
    validateRequest(post_reviews), jwtRequired, passUserFromJWT
], async (req,res) => {
    let args = req.body;
    let review = await findOne({ UserId: args.UserId, TaskId: args.TaskId })
    if (review) throw new ErrorHandler(409, `This user has already reviewed for task -> ${args.TaskId}`)
    let user_is_tasker = (await Task.findOne({ where: { TaskId: args.TaskId }})).UserId === req.user.id
    let user_is_asker = await Offer.findOne({ where: { TaskId: args.TaskId, TaskerId: req.user.id, status: "ACCEPTED" }})
    if (!user_is_tasker && !user_is_asker) throw new ErrorHandler(401, "Unauthorized");
    let created_review = await createReview(req.body);
    return res.json({
        code: 201,
        message: "success",
        body: { review: created_review }
    })
})

app.get("/reviews/task/:task_id/info", [
    jwtRequired, passUserFromJWT
], async (req,res) => {
    let already_reviewed = await findOne({ UserId: req.user.id, TaskId: req.params.task_id })
    let task = await Task.scope("all").findOne({ where: { id: req.params.task_id }})
    if (!task) throw new ErrorHandler(404, "Task not found")
    let user_is_asker = task.UserId === req.user.id
    let user_is_tasker = await Offer.findOne({ where: { TaskId: req.params.task_id, TaskerId: req.user.id, status: "ACCEPTED" }})
    let reviewer_is;
    if (user_is_tasker) reviewer_is = "TASKER"
    else if (user_is_asker) reviewer_is ="ASKER"
    else throw new ErrorHandler(401, "Unauthorized") 
    return res.json({
        code: 200,
        message: "success",
        data: { already_reviewed: Boolean(already_reviewed), reviewer_is }
    })
})