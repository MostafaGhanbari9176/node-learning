exports.postAddProduct = (req, res) => {
    const productId = req.body.id
    req.user.addToCart(productId)
        .then(result => {
            res.redirect('/cart/')
        })
        .catch(err => console.log(err))
}

exports.getCart = (req, res) => {
    req.user
        .populate('cart.items.product')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return {...(i.product._doc), count: i.count}
            })
            res.render('./cart.ejs', {pageTitle: "Cart", products: products})
        })
        .catch(err => console.log(err))
}

exports.getRemoveProduct = (req, res) => {
    const productId = req.params.productId
    req.user.removeFromCart(productId)
        .then(() => {
            res.redirect('/cart/')
        })
        .catch(err => console.log(err))
}

exports.getIncreaseCount = (req, res) => {
    const productId = req.params.productId
    req.user.increaseCount(productId)
        .then(() => {
            res.redirect('/cart/')
        })
        .catch(err => console.log(err))
}

exports.getDecreaseCount = (req, res) => {
    const productId = req.params.productId
    const item = req.user.getProduct(productId)
    if (item.count <= 1)
        req.user.removeFromCart(productId)
            .then(() => {
                res.redirect('/cart/')
            })
            .catch(err => console.log(err))
    else {
        item.count = item.count - 1
        req.user.save()
            .then(() => {
                res.redirect('/cart/')
            })
            .catch(err => console.log(err))
    }
}