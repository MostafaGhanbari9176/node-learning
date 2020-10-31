const Product = require('../models/product')
const utils = require('../utils/utilities')

exports.getCreateProduct = (req, res) => {
    res.render('./create-product.ejs',
        {
            pageTitle: "Create New Product",
            edit: false
        })
}

exports.postCreateProduct = (req, res, next) => {
    const imagePath = req.file == null ? undefined : req.file.filename
    console.log(req.file)
    const product = new Product({...req.body, user: req.user, image: imagePath})
    product.save()
        .then(result => {
            res.redirect('/product/user-list')
        })
        .catch(err => next(err))
}

exports.getProductList = (req, res) => {
    Product.find()
        .then(products => {
            res.render('./product-list.ejs', {
                pageTitle: "All Products",
                products: products,
                canModify: false
            })
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

exports.postEditProduct = (req, res, next) => {
    Product.findOne({_id: req.body.id, user: req.user})
        .then(product => {
            if (product) {
                product.title = req.body.title
                product.prixe = req.body.price
                if (req.file) {
                    utils.deleteImage(product.image)
                    product.image = req.file.filename
                }
                return product.save()
            }
            throw new Error('access denied!')
        })
        .then(() => res.redirect('/product/user-list'))
        .catch(err => next(err))
}

exports.postDeleteProduct = (req, res) => {
    Product.findOne({_id: req.body.id, user: req.user})
        .then(product => {
            utils.deleteImage(product.image)
            return product.deleteOne()
        })
        .then(() => res.redirect('/product/user-list'))
        .catch(err => console.log(err))
}

exports.getUserProducts = (req, res) => {
    Product.find({user: req.user})
        .then(products => {
            res.render('./product-list.ejs',
                {
                    pageTitle: "Created Products",
                    products: products,
                    canModify: true
                })
        })
        .catch(err => console.log(err))
}


