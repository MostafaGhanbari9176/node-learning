const express = require('express')

const isAuth = require('../middlewares/is-auth')

const controller = require('../controllers/products')

const router = express.Router()


router.get('/create', isAuth, controller.getCreateProduct)
router.post('/create', isAuth, controller.postCreateProduct)

router.get('/list', controller.getProductList)

router.get('/detail/:productId', controller.getProductDetail)

router.get('/edit/:productId', isAuth, controller.getEditProduct)
router.post('/edit', isAuth, controller.postEditProduct)

router.post('/delete', isAuth, controller.postDeleteProduct)

router.get('/user-list', isAuth, controller.getUserProducts)

module.exports = router