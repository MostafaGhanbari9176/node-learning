const express = require('express')
const bodyParser = require('body-parser')

const productRouter = require('./routes/product')
const cartRouter = require('./routes/cart')

const sequelize = require('./utils/database')

const User = require('./models/user')
const Product = require('./models/product')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')

const app = express()

app.set('views engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => console.log(err))
})

app.get('/', (req, res) => {
    res.render('./index.ejs', {pageTitle: "Main Page"})
})

app.use('/product', productRouter)
app.use('/cart', cartRouter)


app.use((req, res) => {
    res.status(400).render('./error.ejs', {pageTitle: "404", message: "Page Not Found"})
})

User.hasMany(Product)
Product.belongsTo(User)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, {through: CartItem})
Product.belongsToMany(Cart, {through: CartItem})

sequelize.sync({force: false})
    .then(result => {
        return User.findByPk(1)
            .then(user => {
                if (!user)
                    return User.create()
                return user
            })
            .catch(err => console.log(err))
    })
    .then(user => {
        return user.createCart()
    })
    .then(result => {
        //console.log(result)
        app.listen(1997)
    })
    .catch(err => {
        console.log(err)
    })
