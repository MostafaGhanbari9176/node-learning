const Product = require('../models/product')
const utils = require('../utils/utilities')

const ITEM_PER_PAGE = 1

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
    const page = +req.query.page || 1
    let itemsCount
    Product.countDocuments()
        .then(_itemsCount => {
            itemsCount = _itemsCount
            return Product.find()
                .skip((page - 1) * ITEM_PER_PAGE)
                .limit(ITEM_PER_PAGE)
        })
        .then(products => {
            res.render('./product-list.ejs', {
                pageTitle: "All Products",
                products: products,
                canModify: false,
                next: page + 1,
                prev: page - 1,
                haveNext: (page + 1) <= itemsCount,
                havePrev: (page - 1) >= 1,
                page: page,
                total: itemsCount
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

exports.deleteProduct = (req, res) => {
    const productId = req.params.productId
    Product.findOne({_id: productId, user: req.user})
        .then(product => {
            if (!product)
                throw new Error('access denied')
            utils.deleteImage(product.image)
            return product.deleteOne()
        })
        .then(() => res.status(200).json({message: 'succeed.'}))
        .catch(err => res.status(500).json({message: 'deleting product failed!'}))
}

exports.getUserProducts = (req, res) => {

    const page = +req.query.page || 1
    let itemsCount
    Product.countDocuments()
        .then(_itemsCount => {
            itemsCount = _itemsCount
            return Product.find({user: req.user})
                .skip((page - 1) * ITEM_PER_PAGE)
                .limit(ITEM_PER_PAGE)
        })
        .then(products => {
            res.render('./product-list.ejs', {
                pageTitle: "All Products",
                products: products,
                canModify: true,
                next: page + 1,
                prev: page - 1,
                haveNext: (page + 1) <= itemsCount,
                havePrev: (page - 1) >= 1,
                page: page,
                total: itemsCount
            })
        })
        .catch(err => console.log(err))
}


