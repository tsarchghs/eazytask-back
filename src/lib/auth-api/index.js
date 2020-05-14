const express = require("express");
const app = module.exports = express();

const { validateRequest, jwtRequired } = require("../../middlewares");
const { post_auth } = require("./validations")
const createToken = require("./createToken");
const validateCredentials = require("./validateCredentials")

const { findUserByPk } = require("../users-dal");

const getResponse = user => ({
    status: "success",
    code: 200,
    message: "Authorized",
    data: {
        token: createToken(user.id),
        user,
        expires_in: 10000
    }
})

app.get('/auth', jwtRequired, async (req, res) => {
    let user = await findUserByPk(req.auth.userId)
    if (!user) throw new ErrorHandler(401, "Unauthorized")
    return res.json(getResponse(user))
});

app.post('/auth', validateRequest(post_auth), async (req, res) => {
    let user = await validateCredentials(req.body)
    return res.json(getResponse(user))
});

module.exports = app;
