require('dotenv').config()
const express = require('express')
const compression = require("compression");
const bodyParser = require("body-parser")
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const logger = require("morgan")("dev")

const run = async ({ app, port, resetDb, database}) => {
    let models = require("./models")[database];
    console.log(999,{models})
    const PORT = port || process.env.PORT || 4000
    const MainRouter = require("./api");

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    if (resetDb){
        models.sequelize.drop() 
    }
    models.sequelize.sync({ force: false || resetDb });
    app.use(compression())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(logger)

    app.use((req, res, next) => {
        if (req.body.email) req.body.email = req.body.email.toLowerCase()
        next();
    })
    
    app.use("/api/v1",MainRouter({database}))
    app.get('/', (req, res) => res.send('Test'))
    
    app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))
}


if (require.main === module) run({ 
    app: express(), 
    database: "eazytask", 
})

module.exports = run