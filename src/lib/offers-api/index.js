
const express = require("express");
const app = module.exports = express();

const { 
    validateRequest, 
    jwtRequired, 
    passUserFromJWT,
    passTaskerFromUser 
} = require("../../middlewares");

const { post_offers } = require("./validations");

const { createOffer, findByTaskerAndTask } = require("./offers-dal");

const { ErrorHandler } = require("../../utils/error")

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
            ...req.body
        })
        return res.json({
            message: "success",
            status: 200,
            data: offer
        })
})