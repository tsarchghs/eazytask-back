
const express = require("express");
const app = module.exports = express();

const validateRequest = require("../../middlewares/validateRequest");

const { post_users } = require("./validations")
const { createUser } = require("../users-dal")

app.post("/users", validateRequest(post_users), async (req,res) => {
    let user = await createUser(req.body);
    return res.json({
        message: "success",
        code: 201,
        data: user
    })
})