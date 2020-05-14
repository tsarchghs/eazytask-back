
const express = require("express");
const app = module.exports = express();

const { allowCrossDomain, validateRequest, jwtRequired, passUserFromJWT, requireAdminAccess } = require("../../middlewares");
const { post_languages } = require("./validations");

const { findAll } = require("./languages-dal");
const { createLanguage } = require("../languages-dal");

app.use(allowCrossDomain)

app.get("/languages", async (req, res) => {
    let languages = await findAll()
    return res.json({
        message: "success",
        status: 200,
        data: languages
    })
})


app.post("/languages",[
    validateRequest(post_languages),
    jwtRequired,
    passUserFromJWT,
    requireAdminAccess
], async (req, res) => {
    let language = await createLanguage({name: req.body.name, createdByUser: false })
    return res.json({
        message: "success",
        status: 200,
        data: language
    })
})