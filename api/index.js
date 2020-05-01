const MainRouter = require("express").Router();



module.exports = ({database}) => {
    MainRouter.get("/",(req,res) => res.send("API v1"))
    MainRouter.use("/auth", require("./auth")({database}))
    MainRouter.use("/users", require("./users")({database}))
    return MainRouter
}