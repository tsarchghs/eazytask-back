require('dotenv').config()

const express = require('express')
const compression = require("compression");
const models = require("./models");
const bodyParser = require("body-parser")

const app = express()
const PORT = process.env.PORT || 4000
const MainRouter = require("./api");

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// models.sequelize.drop() 
models.sequelize.sync({ force: true });
app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    if (req.body.email) req.body.email = req.body.email.toLowerCase()
    next();
})

app.use("/api/v1",MainRouter)

app.get('/', (req, res) => res.send('Test'))

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))