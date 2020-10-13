const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const User = require('./models/user')
const productRouter = require('./routes/product')
const cartRouter = require('./routes/cart')
const orderRouter = require('./routes/order')

const app = express()

app.set('views engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

app.use((req, res, next) => {
    User.findOne()
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => console.log(err))
})

app.get('/', (req, res) => {
    res.render('./index.ejs', {pageTitle: "Main Page"})
})

app.use('/product/', productRouter)
app.use('/cart/', cartRouter)
app.use('/order/', orderRouter)

app.use((req, res) => {
    res.status(400).render('./error.ejs', {pageTitle: "404", message: "Page Not Found"})
})

mongoose.connect('mongodb://localhost:27017/market', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        return User.findOne()
    })
    .then(user => {
        if (!user) {
            const user = new User()
            return user.save()
        }
        return user
    })
    .then(() => app.listen(1997))
    .catch(err => console.log(err))