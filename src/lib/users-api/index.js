
const express = require("express");
const app = module.exports = express();

const { allowCrossDomain, validateRequest, jwtRequired, passUserFromJWT } = require("../../middlewares");

const { 
    post_users, 
    patch_users, 
    post_send_verification_code, 
    post_reset_password, 
    post_validate_verification_code,
    post_send_phone_verification_code,
    post_validate_phone_verification_code
} = require("./validations")
const { createUser, patchUser, findOne, findUserByEmail, verifyAccount } = require("./users-dal")
const createToken = require("../utils/createToken")
const { ErrorHandler } = require("../../utils/error")
const { JWT_SECRET } = require("../../configs")

const multer = require('multer')
const upload = multer();

const jwt = require("jsonwebtoken");

const email_manager = require("../email-manager");
const phone_manager = require("../phone-manager");
const emailManager = require("../email-manager");

const uploadMiddleware = upload.fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 }
])

app.use(allowCrossDomain)

app.post("/users/send_phone_verification_code", [
    validateRequest(post_send_phone_verification_code),
    jwtRequired,
    passUserFromJWT
], async (req, res) => {
    let { phone_number } = req.body;
    let code = Math.floor(100000 + Math.random() * 900000);
    let token = createToken(null, { code, phone_number }, "5h",process.env.PHONE_JWT_SECRET)
    try {
        await patchUser(req.user.email, { phone_verification_token: token })
    } catch (err) {
        if (err.message === "The resource you tried to update does not exist") {
            console.log("PASSING: The resource you tried to update does not exist")
        }
        else throw err
    }
    phone_manager.sendPhoneVerificationCodeSMS({ to: phone_number, code })
    console.log(`[${phone_number}] Valid for 5 hours, Your code is: `, code)
    console.log("DEV: token is: ", token)
    return res.json({
        message: "success",
        code: 201
    })
})

app.post("/users/validate_phone_verification_code", [
    validateRequest(post_validate_phone_verification_code),
    jwtRequired,
    passUserFromJWT
], async (req,res) => {
    let { code } = req.body;
    let user = await findUserByEmail(req.user.email, "withPhoneVerificationCode")
    let decoded;
    try {
        decoded = jwt.verify(user.phone_verification_token, process.env.PHONE_JWT_SECRET)
    } catch (err) {
        if (err.name === "TokenExpiredError")
            throw new ErrorHandler(401, "Code has expired", ["Verification code has expired."])
    }
    if (decoded.code !== code) throw new ErrorHandler(401, "Code is not correct", ["Verification code is not correct."])
    try {
        await patchUser(req.user.email, { phone_number: decoded.phone_number })
    } catch (err) {
        if (err.message === "The resource you tried to update does not exist") {
            console.log("PASSING: The resource you tried to update does not exist")
        }
        else throw err
    }
    return res.json({
        message: "success",
        code: 200
    })
})


app.post("/users/send_verification_code", validateRequest(post_send_verification_code), async (req, res) => {
    let { email } = req.body;
    let code = Math.floor(100000 + Math.random() * 900000);
    let token = createToken(null, { code, email }, "5h",process.env.FORGET_PASSWORD_JWT_SECRET)
    try {
        await patchUser(email, { verification_token: token })
    } catch (err) {
        if (err.message === "The resource you tried to update does not exist") {
            console.log("PASSING: The resource you tried to update does not exist")
        }
        else throw err
    }
    let emailData = email_manager.createForgetPasswordEmail({ to: email, code })
    email_manager.sendEmail(emailData);
    console.log("Valid for 5 hours, Your code is: ", code)
    console.log("DEV: token is: ", token)
    return res.json({
        message: "success",
        code: 201
    })
})

app.post("/users/reset_password", validateRequest(post_reset_password), async (req, res) => {
    let { email, code, new_password } = req.body;
    let user = await findUserByEmail(email, "withVerificationCode")
    if (!user) throw new ErrorHandler(404, "User not found");
    let decoded;
    try {
        decoded = jwt.verify(user.verification_token, process.env.FORGET_PASSWORD_JWT_SECRET)
    } catch (err) {
        if (err.name === "TokenExpiredError")
            throw new ErrorHandler(401, "Code has expired", ["Verification code has expired."])
    }
    if (decoded.code !== code) throw new ErrorHandler(401, "Code is invalid");
    await patchUser(user.id, { password: new_password })
    return res.json({
        message: "success",
        code: 201
    })
})

app.post("/users/validate_verification_code", validateRequest(post_validate_verification_code), async (req,res) => {
    let { email, code } = req.body;
    let user = await findUserByEmail(email, "withVerificationCode")
    let decoded;
    if (!user || !user.verification_token) throw new ErrorHandler(401, "Code is not correct", ["2 Verification code is not correct."])
    try {
        decoded = jwt.verify(user.verification_token, process.env.FORGET_PASSWORD_JWT_SECRET)
    } catch (err) {
        if (err.name === "TokenExpiredError")
            throw new ErrorHandler(401, "Code has expired", ["Verification code has expired."])
    }
    if (decoded.code !== code) throw new ErrorHandler(401, "Code is not correct", ["Verification code is not correct."])
    return res.json({
        message: "success",
        code: 200
    })
})

app.get("/users/:userId", async (req, res) => {
    console.log("req.params.userId", req.params.userId)
    let user = await findOne(Number(req.params.userId), req.query);
    return res.json({
        message: "success",
        code: 201,
        data: user
    })
})

app.post("/verify_account/:token", async (req,res) => {
    let decoded = jwt.decode(req.params.token);
    let user = await verifyAccount(decoded.userId)
    return res.json({ code: 200, message: "success" })
})

app.post("/users", validateRequest(post_users), async (req, res) => {
    let user = await createUser(req.body);
    let email = { to: user.email, subject: "Eazytask: Account Verification" };
    let token = createToken(user.id)
    let url = `${process.env.BASE_URL}/verify_account/${token}`
    let text = `Klicke auf diesen Link, um dein Konto zu verifizieren (1 Stunde gültig): ${url}`
    email.text = text; email.html = text;
    console.log(email)
    emailManager.sendEmail(email)
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
    ], async (req, res) => {
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