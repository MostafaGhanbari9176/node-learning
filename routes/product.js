const express = require('express')

const controller = require('../controllers/products')

const router = express.Router()

router.get('/create', controller.getCreate)
router.post('/create', controller.postCreate)

router.get('/edit/:id', controller.getEdit)
router.post('/edit', controller.postEdit)

router.get('/list', controller.getList)

router.get('/user-list', controller.getUserProducts)

router.post('/delete', controller.postDelete)

module.exports = router