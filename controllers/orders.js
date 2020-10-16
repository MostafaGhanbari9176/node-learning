const Order = require('../models/order')

exports.postCreateOrder = (req, res) => {
    const address = req.body.address
    req.user
        .populate('cart.items.product')
        .execPopulate()
        .then(user => {
            const order = new Order({
                date: new Date(),
                address: address,
                user: req.user,
                total: Math.floor(user.cart.items.reduce((t, o) => {
                    return t + (o.product.price * o.count)
                }, 0)),
                products: user.cart.items
            })
            return order.save()
        })
        .then(() => {
            return req.user.clearCart()
        })
        .then(() => {
            res.redirect('/order/')
        })
        .catch(err => console.log(err))

}

exports.getOrderList = (req, res) => {
    Order.find({user: req.user})
        .then(orders => {
            console.log(orders)
            res.render('./order.ejs', {
                pageTitle: "Orders",
                orders: orders,
                loggedIn:req.loggedIn
            })
        })
        .catch(err => console.log(err))
}