const bCrypt = require('bcryptjs')

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
    User.findOne({userName: userName})
        .then(user => {
            if (user) {
                req.flash("error", "username exist, please choose another one🌹")
                res.redirect('/auth/logUp')
            } else {
                bCrypt.hash(req.body.pass, 12)
                    .then(hashedPass => {
                        const user = new User({
                            userName: userName,
                            pass: hashedPass
                        })
                        return user.save()
                    })
                    .then(() => {
                        req.flash("error", "your account created")
                        res.redirect('/auth/logIn')
                    })
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
}