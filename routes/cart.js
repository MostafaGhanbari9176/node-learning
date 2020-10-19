const express = require('express')

const isAuth = require('../middlewares/isAuth')

const controller = require('../controllers/carts')

const router = express.Router()

router.use(isAuth)

router.post('/add', controller.postAddProduct)

router.get('/', controller.getCart)

router.get('/remove/:productId', controller.getRemoveProduct)

router.get('/increase/:productId', controller.getIncreaseCount)
router.get('/decrease/:productId', controller.getDecreaseCount)

module.exports = router