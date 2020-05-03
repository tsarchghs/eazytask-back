const validateRequest = require("../middlewares/validateRequest");
const post_auth = require("./validations/auth/post")
const { createToken } = require("../utils")
const bcrypt = require("bcrypt")
const router = require("express").Router();
const jwt =  require('jsonwebtoken');
const { JWT_SECRET } =  require('../configs.js');

const INVALID_CREDENTIALS_RESPONSE = {
    status: "error",
    code: 400,
    message: "Invalid credentials",
    data: null,
    errors: [
        "The email address or password is incorrect. Please try again."
    ]
}

module.exports = ({ database }) => {
    console.log({database})
    let { User } = require("../models")[database]
    // router.get("/auth", )
    router.post('', validateRequest(post_auth), async (req, res) => {
        let user = await User.findOne({ where: { email: req.body.email.toLowerCase() } })
        if (!user) return res.send(INVALID_CREDENTIALS_RESPONSE)
        const match = await bcrypt.compare(req.body.password, user.password);
        console.log({match})
        user.password = undefined
        if (match) return res.send({
            status: "success",
            code: 200,
            message: "Authorized",
            data: {
                token: createToken(user.id),
                user,
                expires_in: 10000
            }
        }) 
        else return res.send(INVALID_CREDENTIALS_RESPONSE)
    });
    return router;
};