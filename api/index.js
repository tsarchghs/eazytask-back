const MainRouter = require("express").Router();


// MainRouter.use("/auth", require("./auth"))

module.exports = ({database}) => {
    MainRouter.get("/",(req,res) => res.send("API v1"))
    MainRouter.use("/users", require("./users")({database}))
    return MainRouter
}