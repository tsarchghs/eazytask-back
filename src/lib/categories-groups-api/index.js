
const express = require("express");
const app = module.exports = express();

const { validateRequest, jwtRequired, passUserFromJWT, requireAdminAccess } = require("../../middlewares");
const { post_categories_groups } = require("./validations");

const { findAll, createCategoryGroup } = require("./categories-groups-dal");

app.get("/categories_groups", async (req, res) => {
    let categories_groups = await findAll()
    return res.json({
        message: "success",
        status: 200,
        data: categories_groups
    })
})

app.post("/categories_groups",[
    validateRequest(post_categories_groups),
    jwtRequired,
    passUserFromJWT,
    requireAdminAccess
], async (req, res) => {
    let categoryGroup = await createCategoryGroup({name: req.body.name})
    return res.json({
        message: "success",
        status: 200,
        data: categoryGroup
    })
})