const fs = require('fs')
const path = require('path')

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
                orders: orders
            })
        })
        .catch(err => console.log(err))
}

exports.releasePdf = (req, res, next) => {
    const orderId = req.params.orderId
    Order.findById(orderId)
        .then(order => {
            if (!order)
                throw new Error('not order found!')
            if (order.user.toString() === req.user._id.toString()) {
                const docPath = path.join('data', 'order_docs', 'order-' + orderId + '.pdf')

                fs.readFile(docPath, ((err, data) => {
                    if (err)
                        console.log(err)
                    res.setHeader('Content-Type', 'application/pdf')
                    res.setHeader('Content-Disposition', ' attachment; filename="order-' + orderId + '.pdf"')
                    res.send(data)
                }))
            } else
                throw new Error('access denied ❌')
        })
        .catch(err => next(err))
}