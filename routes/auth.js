const router = require('express').Router()

const controller = require('../controllers/auth')

router.get('/logIn', controller.getLogIn)
router.post('/LogIn', controller.postLogIn)

router.get('/logOut', controller.getLogOut)

router.get('/logUp', controller.getLogUp)
router.post('/logUp', controller.postLogUp)

router.get('/reset', controller.getResetPass)
router.post('/reset', controller.postResetPass)
router.get('/updatePass/:token', controller.getUpdatePass)
router.post('/updatePass', controller.postUpdatePass)

module.exports = router