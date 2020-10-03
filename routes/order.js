const express = require('express')
const router = express.Router()

const controller = require('../controllers/order')

router.post('/create', controller.postCreateOrder)

router.get('/', controller.getOrderList)

module.exports = router