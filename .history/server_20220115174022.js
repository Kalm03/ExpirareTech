const path = require('path')
const fs = require('fs')
const express = require('express')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const Recipe = require('./models/Recipe')
const Ingredient = require('./models/Ingredients')

// app.use( express.static( "views" ) );

function logRequest(req, res, next) {
  console.log(`${new Date()}  ${req.ip} : ${req.method} ${req.path}`)
  next()
}

const host = 'localhost'
const port = 3000
const clientApp = path.join(__dirname, 'client')

mongoose.connect('mongodb://localhost:27017/expirare', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

// express app
let app = express()

app.use(express.json()) // to parse application/json
app.use(
  express.urlencoded({
    extended: true,
  })
) // to parse application/x-www-form-urlencoded
app.use(logRequest) // logging for debug

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port, () => {
  console.log(
    `${new Date()}  App Started. Listening on ${host}:${port}, serving ${clientApp}`
  )
})
