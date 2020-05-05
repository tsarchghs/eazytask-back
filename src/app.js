if (!process.env.CUSTOM_ENV_PATH) require('dotenv').config()

require('express-async-errors');

const models = require("./models")
// if (process.env.DROP_TABLES) models.sequelize.drop()
models.sequelize.sync({ force: false });

const express = require('express')
const cors = require("cors")
const compression = require("compression");
const bodyParser = require("body-parser")
const logger = require("morgan")("dev")
const { errorHandler, caseInsensitiveEmail } = require("./middlewares")

const api_docs = require("./lib/api-docs")
const users_api = require("./lib/users-api")
const auth_api = require("./lib/auth-api")

const app = express();

app.use(cors())
app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(logger)
app.use(caseInsensitiveEmail)

app.use("/api/v1",api_docs)
app.use("/api/v1", users_api)
app.use("/api/v1", auth_api)

// app.use("/api/v1",MainRouter)
app.get('/', (req, res) => res.json({test:true}))

app.use(errorHandler)

if (require.main === module) {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT,() => console.log("Running on port: ",PORT))
}

module.exports = app