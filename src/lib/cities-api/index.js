
const express = require("express");
const app = module.exports = express();

const { allowCrossDomain, validateRequest, jwtRequired, passUserFromJWT, requireAdminAccess } = require("../../middlewares");
const { post_cities } = require("./validations");

const { findAll } = require("./cities-dal");
const { createCity } = require("../cities-dal");

app.use(allowCrossDomain)

app.get("/cities", async (req, res) => {
    let cities = await findAll()
    return res.json({
        message: "success",
        status: 200,
        data: cities
    })
})


app.post("/cities",[
    validateRequest(post_cities),
    jwtRequired,
    passUserFromJWT,
    requireAdminAccess
], async (req, res) => {
    let city = await createCity({name: req.body.name, createdByUser: false })
    return res.json({
        message: "success",
        status: 200,
        data: city
    })
})