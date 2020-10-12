const express = require('express')

const controller = require('../controllers/products')

const router = express.Router()


router.get('/create', controller.getCreateProduct)
router.post('/create', controller.postCreateProduct)

router.get('/list', controller.getProductList)

router.get('/detail/:productId', controller.getProductDetail)

router.get('/edit/:productId', controller.getEditProduct)
router.post('/edit', controller.postEditProduct)

router.post('/delete', controller.postDeleteProduct)

module.exports = router