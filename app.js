require('dotenv').config()

const express = require('express')
const compression = require("compression");

const app = express()
const port = 3000

app.use(compression())

app.get('/', (req, res) => res.send('Test'))

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))