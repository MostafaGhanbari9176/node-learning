exports.getCart = (req, res) => {
    req.user.getCart()
        .then(products => {
            res.render('./cart.ejs', {pageTitle: "cart", products: products})
        })
        .catch(err => console.log(err))
}

exports.postAdd = (req, res) => {
    let productId = req.body.id
    req.user.addToCart(productId)
        .then(() => {
            res.redirect('/cart/')
        })
        .catch(err => console.log(err))
}

exports.remove = (req, res) => {
    let productId = req.params.id
    req.user.removeFromCart(productId)
        .then(() => res.redirect('/cart/'))
        .catch(err => console.log(err))
}