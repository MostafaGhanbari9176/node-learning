exports.getLogIn = (req, res) => {
    res.render('./auth/logIn.ejs', {pageTitle:"LogIn", loggedIn:req.loggedIn})
}

exports.postLogIn = (req, res) => {
    res.setHeader("Set-Cookie", "LoggedIn=true; Path=/; Max-Age=10; httpOnly")
    res.redirect('/')
}

exports.getLogOut = (req, res) => {
    res.setHeader("Set-Cookie", "LoggedIn=false; Path=/")
    res.redirect('/')
}