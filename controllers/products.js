const Product = require('../models/product')


exports.getCreate = (req, res) => {
    res.render('./create-product.ejs', {pageTitle: "Create Product", edit: false})
}

exports.postCreate = (req, res) => {
    req.user.createProduct(req.body)
        .then(() => res.redirect('/product/user-list'))
        .catch(err => console.log(err))
}

exports.getEdit = (req, res) => {
    let productId = req.params.id
    req.user.getProducts({where: {id: productId}})
        .then(products => {
            if (products.length > 0)
                res.render('./create-product.ejs',
                    {
                        pageTitle: "Edit Product",
                        product: products[0],
                        edit: true
                    })
            else
                res.render('./error.ejs', {pageTitle: "denied", message: "Access Denied"})
        })
        .catch(err => console.log(err))
}

exports.postEdit = (req, res) => {
    let productId = req.body.id
    req.user.getProducts({where: {id: productId}})
        .then(products => {
            if (products.length > 0) {
                let product = products[0]
                product.title = req.body.title
                product.price = req.body.price
                return product.save()
            } else {
                res.render('./error.ejs', {pageTitle: "denied", message: "Access Denied"})
            }
        })
        .then(() => res.redirect('/product/user-list'))
        .catch(err => console.log(err))

}

exports.getList = (req, res) => {
    Product.findAll()
        .then(products => {
            res.render('./product-list.ejs', {pageTitle: "all products", products: products})
        }).catch(err => console.log(err))
}

exports.getUserProducts = (req, res) => {
    req.user.getProducts()
        .then(products => {
            res.render('./product-list.ejs', {pageTitle: "user products", products: products})
        })
        .catch(err => console.log(err))
}

exports.postDelete = (req, res) => {
    let productId = req.body.id
    req.user.getProducts({where: {id: productId}})
        .then(products => {
            if (products.length > 0) {
                let product = products[0]
                return product.destroy()
            } else {
                res.render('./error.ejs', {pageTitle: "denied", message: "Access Denied"})
            }
        })
        .then(() => res.redirect('/product/user-list'))
        .catch(err => console.log(err))
}
