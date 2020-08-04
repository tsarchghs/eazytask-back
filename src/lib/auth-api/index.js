const express = require("express");
const { allowCrossDomain, validateRequest, jwtRequired } = require("../../middlewares");
const app = module.exports = express();
const { post_auth } = require("./validations")
const createToken = require("../utils/createToken")
const validateCredentials = require("./validateCredentials")

const { findUserByPk } = require("../users-dal");

const { ErrorHandler } = require("../../utils/error")

const getResponse = user => ({
    status: "success",
    code: 200,
    message: "Authorized",
    data: {
        token: createToken(user.id),
        user
    }
})

app.use(allowCrossDomain)

app.get('/auth', jwtRequired, async (req, res) => {
    let user = await findUserByPk(req.auth.userId, !req.query.fields,undefined, req.query.fields);
    if (!user) throw new ErrorHandler(401, "Unauthorized")
    return res.json(getResponse(user))
});

app.post('/auth', validateRequest(post_auth), async (req, res) => {
    let user = await validateCredentials(req.body)
    console.log("TOKEN: " + createToken(user.id))
    if (!user.email_verified) throw new ErrorHandler(401, "Account not verified", [ "Please verify your email address."])
    return res.json(getResponse(user))
});

module.exports = app;
