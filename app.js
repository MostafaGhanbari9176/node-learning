const express = require('express')
const bodyParser = require('body-parser')

const database = require('./utils/database')
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
    User.getUserSystem()
        .then(user => {
            //console.log("currentUser: ", user)
            req.user = new User(user)
            next()
        })
        .catch(err => console.log(err))
})

app.get('/', (req, res) => {
    res.render('./index.ejs', {pageTitle: "Main Page"})
})

app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/order', orderRouter)


app.use((req, res) => {
    res.status(400).render('./error.ejs', {pageTitle: "404", message: "Page Not Found"})
})

database.createConnection(() => {
    User.getUserSystem()
        .then(user => {
            if (!user) {
                const user = new User({
                    userName: "mostafa", email: "info@mostafa.com", cart: []
                })
                return user.save()
            }
            return user
        })
        .then(() => {
            app.listen(1997)
        })
        .catch(err => console.log(err))
})