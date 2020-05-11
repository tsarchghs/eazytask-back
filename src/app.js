if (!process.env.CUSTOM_ENV_PATH) require('dotenv').config()

require('express-async-errors');

const models = require("./models")
if (process.env.DROP_TABLES_HEROKU) models.sequelize.drop()
models.sequelize.sync({ force: false || process.env.DROP_TABLES_HEROKU });

const express = require('express')
const cors = require("cors")
const compression = require("compression");
const bodyParser = require("body-parser")
const logger = require("morgan")("dev")
const { errorHandler, caseInsensitiveEmail, allowCrossDomain } = require("./middlewares")

const api_docs = require("./lib/api-docs")
const auth_api = require("./lib/auth-api")
const users_api = require("./lib/users-api")
const tasks_api = require("./lib/tasks-api")
const categories_api = require("./lib/categories-api")
const languages_api = require("./lib/languages-api")
const skills_api = require("./lib/skills-api")
const taskers_api = require("./lib/taskers-api");

const app = express();

app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(logger)
app.use(caseInsensitiveEmail)
app.use(allowCrossDomain)

let appInstances = [app, api_docs, auth_api, users_api, tasks_api, categories_api, languages_api, skills_api, taskers_api];
appInstances.forEach(a => a.use(allowCrossDomain))

app.use("/api/v1", api_docs)
app.use("/api/v1", auth_api)
app.use("/api/v1", users_api)
app.use("/api/v1", tasks_api)
app.use("/api/v1", taskers_api)
app.use("/api/v1", categories_api)
app.use("/api/v1", languages_api)
app.use("/api/v1", skills_api)


// app.use("/api/v1",MainRouter)
app.get('/', (req, res) => res.json({test:true}))

app.use(errorHandler)

if (require.main === module) {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT,() => console.log("Running on port: ",PORT))
}

module.exports = app