const User = require("../models/user")

exports.getLogIn = (req, res) => {
    res.render('./auth/logIn.ejs', {pageTitle: "LogIn", loggedIn: req.loggedIn})
}

exports.postLogIn = (req, res) => {
    User.findOne({pass: req.body.pass, userName: req.body.userName})
        .then(user => {
            if (user) {
                req.session.user = user
                req.session.save(err => {
                    if (err)
                        console.log(err)
                    res.redirect('/')
                })
            } else
                res.render('./error.ejs', {
                    pageTitle: "Authentication Fails",
                    message: "userName or pass incorrect🤔",
                    loggedIn: false
                })
        }).catch(err => console.log(err))
}

exports.getLogOut = (req, res) => {
    req.session.destroy(err => {
        if (err)
            console.log(err)
        res.redirect('/')
    })
}