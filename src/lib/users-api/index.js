
const express = require("express");
const app = module.exports = express();

const { allowCrossDomain, validateRequest, jwtRequired, passUserFromJWT } = require("../../middlewares");

const { post_users, patch_users, post_send_verification_code, post_reset_password } = require("./validations")
const { createUser, patchUser, findOne, findUserByEmail } = require("./users-dal")
const createToken = require("../utils/createToken")
const { ErrorHandler } = require("../../utils/error")
const { JWT_SECRET } = require("../../configs")

const multer = require('multer')
const upload = multer();

const jwt = require("jsonwebtoken");
const { useResourceEdit } = require("admin-bro");

const uploadMiddleware = upload.fields([
    { name: 'profile_image', maxCount: 1 }, 
    { name: 'cover_image', maxCount: 1 }
])

app.use(allowCrossDomain)

app.post("/users/send_verification_code", validateRequest(post_send_verification_code), async (req,res) => {
    let { email } = req.body;
    let code = Math.floor(100000 + Math.random() * 900000);
    let token = createToken(null, { code, email  }, "5h")
    try {
        await patchUser(email, { verification_token: token })
    } catch (err) {
        if (err.message === "The resource you tried to update does not exist") {
            console.log("PASSING: The resource you tried to update does not exist")
        }
        else throw err
    }
    console.log("Valid for 5 hours, Your code is: ", code)
    console.log("DEV: token is: ", token)
    return res.json({
        message: "success",
        code: 201
    })
})

app.post("/users/reset_password", validateRequest(post_reset_password), async (req, res) => {
    let { email, code, new_password } = req.body;
    let user = await findUserByEmail(email,"withVerificationCode")
    if (!user) throw new ErrorHandler(404, "User not found"); 
    let decoded;
    try {
        decoded = jwt.verify(user.verification_token, JWT_SECRET)
    } catch (err) {
        if (err.name === "TokenExpiredError") 
            throw new ErrorHandler(401, "Code has expired", [ "Verification code has expired."])
    }
    if (decoded.code !== code) throw new ErrorHandler(401,"Code is invalid");
    await patchUser(user.id, { password: new_password })
    return res.json({
        message: "success",
        code: 201
    }) 
})

app.get("/users/:userId", async (req, res) => {
    console.log("req.params.userId", req.params.userId)
    let user = await findOne(Number(req.params.userId),req.query);
    return res.json({
        message: "success",
        code: 201,
        data: user
    })
})

app.post("/users", validateRequest(post_users), async (req, res) => {
    let user = await createUser(req.body);
    return res.json({
        message: "success",
        code: 201,
        data: { user, token: createToken(user.id) }
    })
})

app.patch("/users/:userId", 
    [
        validateRequest(patch_users), 
        uploadMiddleware,
        jwtRequired,
        passUserFromJWT
    ], async (req,res) => {
        let files = {};
        if (req.files) {
            if (req.files["profile_image"] && req.files["profile_image"].length) files["profile_image"] = req.files["profile_image"][0];
            if (req.files["cover_image"] && req.files["cover_image"].length) files["cover_image"] = req.files["cover_image"][0];
        }
        if (req.user.id != req.params.userId) throw new ErrorHandler(401, "Unauthorized")
        let user = await patchUser(req.params.userId, { ...req.body, ...files });
        return res.json({
            message: "success",
            code: 200,
            data: user
        })
})