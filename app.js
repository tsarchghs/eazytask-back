require('dotenv').config()

const express = require('express')
const compression = require("compression");

const app = express()
const PORT = process.env.PORT || 4000

app.use(compression())

app.get('/', (req, res) => res.send('Test'))

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))