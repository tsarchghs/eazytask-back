const MainRouter = require("express").Router();

// MainRouter.use("/auth", require("./auth"))
MainRouter.get("/",(req,res) => res.send("API v1"))
MainRouter.use("/users", require("./users"))

module.exports = MainRouter