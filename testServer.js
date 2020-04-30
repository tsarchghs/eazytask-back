require('dotenv').config()
const app = require("express")()

require("./app")({
    app,
    database: "eazytask_test",
    port: 5124,
    resetDb: true,
})