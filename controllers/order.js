exports.postCreateOrder = (req, res) => {
    let address = req.body.address
    req.user.createOrder(address)
        .then(() => {
            res.redirect('/order/')
        })
        .catch(err => console.log(err))
}

exports.getOrderList = (req, res) => {
    req.user.getOrders()
        .then(orders => {
            res.render('./order.ejs', {pageTitle: "orders", orders: orders})
        })
        .catch(err => console.log(err))
}