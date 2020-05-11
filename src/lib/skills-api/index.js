
const express = require("express");
const app = module.exports = express();

const { validateRequest, jwtRequired, passUserFromJWT, requireAdminAccess } = require("../../middlewares");
const { post_skills } = require("./validations");

const { findAll } = require("./skills-dal");
const { createSkill } = require("../skills-dal");

app.get("/skills", async (req, res) => {
    let skills = await findAll()
    return res.json({
        message: "success",
        status: 200,
        data: skills
    })
})

app.post("/skills",[
    validateRequest(post_skills),
    jwtRequired,
    passUserFromJWT,
    requireAdminAccess
], async (req, res) => {
    let skill = await createSkill(req.body.name,false)
    return res.json({
        message: "success",
        status: 200,
        data: skill
    })
})