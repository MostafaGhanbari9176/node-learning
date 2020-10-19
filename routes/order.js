const express = require('express')

const isAuth = require('../middlewares/is-auth')

const controller = require('../controllers/orders')

const router = express.Router()

router.use(isAuth)

router.post('/create', controller.postCreateOrder)

router.get('/', controller.getOrderList)

module.exports = router