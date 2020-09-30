const Product = require('../models/product')


exports.getCart = (req, res) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
        })
        .then(products => {
            res.render('./cart.ejs', {pageTitle: "cart", products: products})
        })
        .catch(err => console.log(err))
}

exports.postAdd = (req, res) => {
    let productId = req.body.id
    let userCart
    let newCount = 1
    req.user.getCart()
        .then(cart => {
            userCart = cart
            return cart.getProducts({where: {id: productId}})
        })
        .then(([product]) => {
            if (product) {
                let oldCount = product.cartItem.count
                newCount = oldCount + 1
                return product
            }
            return Product.findByPk(productId)
        })
        .then(product => {
            return userCart.addProduct(product, {through: {count: newCount}})
        })
        .then(() => res.redirect('/cart/'))
        .catch(err => console.log(err))
}

exports.remove = (req, res) => {
    let productId = req.params.id
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({where:{id:productId}})
                .then(([product]) => {
                    return product.cartItem.destroy()
                })
        })
        .then(() => res.redirect('/cart/'))
        .catch(err => console.log(err))
}