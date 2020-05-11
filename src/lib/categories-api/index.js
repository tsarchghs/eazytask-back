
const express = require("express");
const app = module.exports = express();

const { validateRequest, jwtRequired, passUserFromJWT, requireAdminAccess } = require("../../middlewares");
const { post_categories } = require("./validations");

const { findAll, createCategory } = require("./categories-dal");


app.get("/categories", async (req, res) => {
    let categories = await findAll()
    return res.json({
        message: "success",
        status: 200,
        data: categories
    })
})


app.post("/categories",[
    validateRequest(post_categories),
    jwtRequired,
    passUserFromJWT,
    requireAdminAccess
], async (req, res) => {
    let category = await createCategory({name: req.body.name, createdByUser: false})
    return res.json({
        message: "success",
        status: 200,
        data: category
    })
})