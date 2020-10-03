const Product = require('../models/product')


exports.getCreate = (req, res) => {
    res.render('./create-product.ejs', {pageTitle: "Create Product", edit: false})
}

exports.postCreate = (req, res) => {
    let product = new Product(req.body.title, req.body.price, null, req.user._id)
    product.save()
        .then(() => res.redirect('/product/user-list'))
        .catch(err => console.log(err))
}

exports.getEdit = (req, res) => {
    let productId = req.params.id
    Product.findById(productId)
        .then(product => {
            if (product)
                res.render('./create-product.ejs',
                    {
                        pageTitle: "Edit Product",
                        product: product,
                        edit: true
                    })
            else
                res.render('./error.ejs', {pageTitle: "denied", message: "something wrong 🤔"})
        })
        .catch(err => console.log(err))
}

exports.postEdit = (req, res) => {
    const product = new Product(
        req.body.title,
        req.body.price,
        req.body.id
    )
    product.save()
        .then(() => res.redirect('/product/user-list'))
        .catch(err => console.log(err))

}

exports.getList = (req, res) => {
    Product.fetchAll()
        .then(products => {
            res.render('./product-list.ejs', {pageTitle: "all products", products: products})
        }).catch(err => console.log(err))
}

exports.getUserProducts = (req, res) => {
    Product.getUserProducts(req.user._id)
        .then(products => {
            res.render('./product-list.ejs', {pageTitle: "user products", products: products})
        })
        .catch(err => console.log(err))
}

exports.postDelete = (req, res) => {
    let productId = req.body.id
    Product.delete(productId)
        .then(() => {
            return req.user.removeFromCart(productId)
        })
        .then(() => res.redirect('/product/list'))
        .catch(err => console.log(err))
}

exports.getDetail = (req, res) => {
    const productId = req.params.id
    Product.findById(productId)
        .then(product => {
            res.render('./product-detail.ejs', {pageTitle: "detail", product: product})
        })
        .catch(err => console.log(err))
}
