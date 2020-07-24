
const express = require("express");
const app = module.exports = express();

const { 
    allowCrossDomain,
    validateRequest, 
    jwtRequired, 
    passUserFromJWT,
    passTaskerFromUser 
} = require("../../middlewares");

const { get_offers, get_offers_id, post_offers, accept_offer } = require("./validations");

const { findAll, createOffer, findByTaskerAndTask, findOne, acceptOffer } = require("./offers-dal");

const { ErrorHandler } = require("../../utils/error");
const notificationsManager = require("../notifications-manager");

const { Offer, Tasker } = require("../../models")

app.use(allowCrossDomain)

app.get('/offers', validateRequest(get_offers, false), async (req, res) => {
    let offers = await findAll(req.query);
    return res.json({
        message: "success",
        status: 200,
        data: offers
    })
});
app.get('/offers/:offerId', validateRequest(get_offers_id, false), async (req, res) => {
    let tasks = await findOne(Number(req.params.offerId), req.query);
    return res.json({
        message: "success",
        status: 200,
        data: tasks
    })
});

app.post('/tasks/:taskId/offers/:offerId/accept', [
    validateRequest(accept_offer, false),
    jwtRequired,
    passUserFromJWT,
], async (req, res) => {
    let { taskId, offerId } = req.params;
    taskId = Number(taskId);
    offerId = Number(offerId);
    let offer = await acceptOffer({ 
        taskId: taskId, 
        offerId: offerId, 
        currentUser: req.user
    })
    let user_2_id = req.user.id;
    Offer.findByPk(offerId).then(offer => {
        Tasker.findByPk(offer.TaskerId).then(tasker => {
            notificationsManager.sendNotification({
                type: "OFFER_ACCEPTED",
                user_1_id: tasker.UserId,
                user_2_id: user_2_id,
                task_id: taskId
            })
        })
    })
    return res.json({
        message: "success",
        status: 200,
        data: offer
    })
});

app.post("/offers",[
        validateRequest(post_offers),
        jwtRequired,
        passUserFromJWT,
        passTaskerFromUser
    ],async (req,res) => {
        let alreadyExists = await findByTaskerAndTask(req.user.tasker.id,req.body.taskId);
        if (alreadyExists) throw new ErrorHandler(409,"Offer with this tasker already exists")
        let offer = await createOffer({
            TaskerId: req.user.tasker.id,
            TaskId: req.body.taskId,
            fields: req.query.fields,
            ...req.body,
        })
        notificationsManager.sendNotification({
            type: "OFFER_RECEIVED",
            user_2_id: req.user.id,
            task_id: req.body.taskId
        })
        return res.json({
            message: "success",
            status: 200,
            data: offer
        })
})