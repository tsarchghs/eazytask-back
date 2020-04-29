require('dotenv').config()

const express = require('express')
const compression = require("compression");
const models = require("./models");
const bodyParser = require("body-parser")

const app = express()
const PORT = process.env.PORT || 4000

// models.sequelize.drop() 
models.sequelize.sync({ force: true });
app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Test'))

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))