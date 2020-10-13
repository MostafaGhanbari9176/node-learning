const Order = require('../models/order')

exports.postCreateOrder = (req, res) => {
    const address = req.body.address
    req.user
        .populate('cart.items.product')
        .execPopulate()
        .then(user => {
            const order = new Order({
                address: address,
                user: req.user,
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
    Order.find({user:req.user})
        .then(orders => {
            res.render('./order.ejs', {pageTitle:"Orders", orders:orders})
        })
        .catch(err => console.log(err))
}