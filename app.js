const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const productRouter = require('./routes/product')

const app = express()

app.set('views engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('./index.ejs', {pageTitle: "Main Page"})
})

app.use('/product/', productRouter)

app.use((req, res) => {
    res.status(400).render('./error.ejs', {pageTitle: "404", message: "Page Not Found"})
})

mongoose.connect('mongodb://localhost:27017/market', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        app.listen(1997)
    })
    .catch(err => console.log(err))