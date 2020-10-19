const bCrypt = require('bcryptjs')

const User = require("../models/user")

exports.getLogIn = (req, res) => {
    res.render('./auth/logIn.ejs', {pageTitle: "LogIn"})
}

exports.postLogIn = (req, res) => {
    const userName = req.body.userName
    User.findOne({userName: userName})
        .then(user => {
            if (!user) {
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
                        } else
                            res.redirect('/auth/logIn')
                    })
                    .catch(err => {
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
    res.render('./auth/logup.ejs', {pageTitle: "Create Your Account"})
}

exports.postLogUp = (req, res) => {
    const userName = req.body.userName
    User.findOne({userName: userName})
        .then(user => {
            if (user) {
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
                        res.redirect('/auth/logIn')
                    })
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
}