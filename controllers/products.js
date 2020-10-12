const Product = require('../models/product')

exports.getCreateProduct = (req, res) => {
    res.render('./create-product.ejs',
        {
            pageTitle: "Create New Product", edit: false
        })
}

exports.postCreateProduct = (req, res) => {
    const product = new Product(req.body)
    product.save()
        .then(result => {
            res.redirect('/product/list')
        })
        .catch(err => console.log(err))
}

exports.getProductList = (req, res) => {
    Product.find()
        .then(products => {
            res.render('./product-list.ejs', {pageTitle: "All Products", products: products})
        })
        .catch(err => console.log(err))
}

exports.getProductDetail = (req, res) => {
    const productId = req.params.productId
    Product.findById(productId)
        .then(product => {
            res.render('./product-detail.ejs', {
                pageTitle: "Detail",
                product: product
            })
        })
        .catch(err => console.log(err))
}

exports.getEditProduct = (req, res) => {
    const productId = req.params.productId
    Product.findById(productId)
        .then(product => {
            res.render('./create-product.ejs',
                {
                    pageTitle: "Edit Product",
                    product: product,
                    edit: true
                })
        })
        .catch(err => console.log(err))
}

exports.postEditProduct = (req, res) => {
    Product.updateOne({_id: req.body.id}, {$set: {title: req.body.title, price: req.body.price}})
        .then(() => {
            res.redirect('/product/list')
        })
        .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res) => {
    Product.findByIdAndDelete(req.body.id)
        .then(() => {
            res.redirect('/product/list')
        })
        .catch(err => console.log(err))
}


