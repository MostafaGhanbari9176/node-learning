const router = require('express').Router()

const controller = require('../controllers/auth')

router.get('/logIn', controller.getLogIn)
router.post('/LogIn', controller.postLogIn)

router.get('/logOut', controller.getLogOut)

router.get('/logUp', controller.getLogUp)
router.post('/logUp', controller.postLogUp)

module.exports = router