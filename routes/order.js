const express = require('express')

const controller = require('../controllers/orders')

const router = express.Router()

router.post('/create', controller.postCreateOrder)

router.get('/', controller.getOrderList)

module.exports = router