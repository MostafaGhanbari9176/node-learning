const express = require('express')

const controller = require('../controllers/carts')

const router = express.Router()

router.get('/', controller.getCart)

router.post('/add', controller.postAdd)

router.get('/remove/:id', controller.remove)

module.exports = router