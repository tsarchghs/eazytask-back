const express = require("express");
const app = module.exports = express();

const validateRequest = require("../../middlewares/validateRequest");
const { post_auth } = require("./validations")
const createToken = require("./createToken");
const validateCredentials = require("./validateCredentials")

app.post('/auth', validateRequest(post_auth), async (req, res) => {
    let user = await validateCredentials(req.body)
    return res.send({
        status: "success",
        code: 200,
        message: "Authorized",
        data: {
            token: createToken(user.id),
            user,
            expires_in: 10000
        }
    })
});

module.exports = app;
