const nodeMailer = require('nodemailer')
const fs = require('fs')
const path = require('path')

const extractCookies = req => {
    const result = []
    const cookies = req.get("Cookie")
    if (cookies.length === 0)
        return result
    const cookieList = cookies.split(';')
    cookieList.forEach(cookie => {
        const key = cookie.split('=')[0].trim()
        const value = cookie.split('=')[1].trim()
        result.push({key: key, value: value})
    })
    return result
}

exports.loggedIn = req => {
    const cookieList = extractCookies(req)
    const logInCookie = cookieList.find(c => c.key === "LoggedIn")
    return logInCookie == null ? false : logInCookie.value === 'true'
}

exports.sendMail = (subject, body, to) => {
    const from = "market@mostafaghanbari.ir"
    const transporter = nodeMailer.createTransport({
        host: "mail.mostafaghanbari.ir",
        port: 465,
        secure: true,
        pool: true,
        auth: {
            user: from,
            pass: "wizardmarket1997"
        }
    })

    transporter.sendMail({
        subject: subject,
        from: from,
        to: to,
        html: body

    }, (err, result) => {
        if(err)
            console.log("email",err)
    })
}

exports.deleteImage = (name) => {
    const imagePath = path.join(path.dirname(process.mainModule.filename), 'public', 'images', 'products', name)
    fs.unlink(imagePath, (err) => console.log(err))
}