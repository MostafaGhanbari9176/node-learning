const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')

const User = require('./models/user')
const productRouter = require('./routes/product')
const cartRouter = require('./routes/cart')
const orderRouter = require('./routes/order')
const authRouter = require('./routes/auth')
const flashMessage = require('./middlewares/flash-message')

const MongoDb_URI = 'mongodb://localhost:27017/market'

const app = express()
const store = new MongoDBStore({
    uri: MongoDb_URI
})

app.set('views engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(session({
    secret: "Hash sign",
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use(csrf())
app.use(flashMessage)

app.use((req, res, next) => {
    if (req.session.user) {
        User.findOne({_id: req.session.user})
            .then(user => {
                req.user = user
                next()
            })
            .catch(err => console.log(err))
    } else
        next()
})

app.use((req, res, next) => {
    res.locals = {
        loggedIn: req.session.user != null,
        csrfToken: req.csrfToken()
    }
    next()
})

app.get('/', (req, res) => {
    res.render('./index.ejs', {pageTitle: "Main Page", user: req.user})
})

app.use('/product/', productRouter)
app.use('/cart/', cartRouter)
app.use('/order/', orderRouter)
app.use('/auth/', authRouter)

app.use((req, res) => {
    res.status(400).render('./error.ejs', {pageTitle: "404", message: "Page Not Found"})
})

mongoose.connect(MongoDb_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => app.listen(1997))
    .catch(err => console.log(err))


