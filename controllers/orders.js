const fs = require('fs')
const path = require('path')
const PdfDocument = require('pdfkit')

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
                createPdfDoc(req, res, order)
            } else
                throw new Error('access denied ❌')
        })
        .catch(err => next(err))
}

const createPdfDoc = (req, res, order) => {
    const orderId = req.params.orderId

    const orderName = 'order-' + orderId + '.pdf'
    const docPath = path.join('data', 'order_docs', orderName)

    const doc = new PdfDocument()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'filename="'+orderName+'"')
    doc.pipe(fs.createWriteStream(docPath))
    doc.pipe(res)

    createPdfContent(doc, order)

    doc.end()
}

const createPdfContent = (doc, order) =>{
    doc.fontSize(20).fillColor('#2e8b57').text(order._id)
    doc.fillColor("#999").text('-------------------------------------------')
    order.products.forEach((item, index) => {
        doc.fontSize(10).fillColor("#000").text((index+1)+") "+item.product.title+" : "+item.count+"*"+item.product.price)
    })
    doc.fillColor("#999").fontSize(20).text('---')
    doc.fillColor('#2e8b57').fontSize(15).text("$"+order.total)
}