const bCrypt = require('bcryptjs')
const crypto = require('crypto')

const utils = require('../utils/utilities')
const User = require("../models/user")

exports.getLogIn = (req, res) => {
    res.render('./auth/logIn.ejs', {
        pageTitle: "LogIn",
        message: req.flash("error")
    })
}

exports.postLogIn = (req, res) => {
    const userName = req.body.userName
    User.findOne({userName: userName})
        .then(user => {
            if (!user) {
                req.flash("error", "invalid username")
                res.redirect('/auth/logIn')
            } else {
                bCrypt.compare(req.body.pass, user.pass)
                    .then(toPass => {
                        if (toPass) {
                            req.session.user = user
                            req.session.save(err => {
                                if (err)
                                    console.log(err)
                                res.redirect('/')
                            })
                        } else {
                            req.flash("error", "invalid pass")
                            res.redirect('/auth/logIn')
                        }
                    })
                    .catch(err => {
                        req.flash("error", "something wrong 🤔")
                        res.redirect('/auth/logIn')
                        console.log(err)
                    })
            }
        })
        .catch(err => console.log(err))
}

exports.getLogOut = (req, res) => {
    req.session.destroy(err => {
        if (err)
            console.log(err)
        res.redirect('/')
    })
}

exports.getLogUp = (req, res) => {
    res.render('./auth/logup.ejs', {
        pageTitle: "Create Your Account",
        message: req.flash("error")
    })
}

exports.postLogUp = (req, res) => {
    const userName = req.body.userName
    const email = req.body.email
    User.findOne({$or: [{userName: userName}, {email: email}]})
        .then(user => {
            if (user) {
                req.flash("error", "repetitious info")
                res.redirect('/auth/logUp')
            } else {
                bCrypt.hash(req.body.pass, 12)
                    .then(hashedPass => {
                        const user = new User({
                            userName: userName,
                            pass: hashedPass,
                            email: email
                        })
                        return user.save()
                    })
                    .then(() => {
                        utils.sendMail("mostafa market", `<h1>Hello, Your Account Created.\n thanks🌹</h1>`,
                            email)
                        req.flash("error", "your account created")
                        res.redirect('/auth/logIn')
                    })
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
}

exports.getResetPass = (req, res) => {
    res.render('./auth/reset.ejs', {
        pageTitle: "Reset Pass",
        message: req.flash("error")
    })
}

exports.postResetPass = (req, res) => {
    const email = req.body.email

    User.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash("error", "account with this email, not exist")
                return res.redirect('/auth/reset')
            }
            crypto.randomBytes(32, (err, buffer) => {
                if (err) {
                    console.log(err)
                    req.flash("error", "something wrong please try again")
                    return res.redirect('/auth/reset')
                }
                const token = buffer.toString('hex')
                user.resetToken = token
                user.resetTokenExpiration = Date.now() + 3600000
                return user.save()
                    .then(() => {
                        utils.sendMail("Reset Pass", `
                        <h1> click on <a href="http://localhost:1997/auth/updatePass/${token}">link</a> to reset your pass </h1>
                        `, email)
                        req.flash("error", "Reset Email Send.")
                        res.redirect('/auth/reset')
                    })
            })
        })
        .catch(err => console.log(err))
}

exports.getUpdatePass = (req, res) => {
    const token = req.params.token
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user => {
            if (!user) {
                return res.render('./error', {
                    pageTitle: "Forbidden",
                    message: "your reset link wrong."
                })
            }
            res.render('./auth/update-pass.ejs', {
                pageTitle: "Update Password",
                message: req.flash("error"),
                userId: user._id.toString(),
                token: token
            })
        })
        .catch(err => console.log(err))
}

exports.postUpdatePass = (req, res) => {
    const token = req.body.token
    const userId = req.body.userId
    const pass = req.body.pass

    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
        .then(user => {
            if (!user) {
                return res.render('./error.ejs', {
                    pageTitle: "Forbidden",
                    message: "your request wrong."
                })
            }
            bCrypt.hash(pass, 12)
                .then(hashedPass => {
                    user.pass = hashedPass
                    user.resetToken = undefined
                    user.resetTokenExpiration = undefined
                    return user.save()
                })
                .then(() => {
                    req.flash("error", "your password reset.")
                    res.redirect('./auth/logIn')
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}