
const express = require("express");
const app = module.exports = express();

const { allowCrossDomain, validateRequest, jwtRequired, passUserFromJWT, requireAdminAccess } = require("../../middlewares");
const { post_categories } = require("./validations");

const { findAll } = require("./categories-dal");
const { createCategory } = require("../categories-dal");

app.use(allowCrossDomain)

app.get("/categories", async (req, res) => {
    let categories = await findAll({ categoryGroupId: req.query.categoryGroupId })
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