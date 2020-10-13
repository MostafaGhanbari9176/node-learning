const express = require('express')

const controller = require('../controllers/carts')

const router = express.Router()

router.post('/add', controller.postAddProduct)

router.get('/', controller.getCart)

router.get('/remove/:productId', controller.getRemoveProduct)

module.exports = router