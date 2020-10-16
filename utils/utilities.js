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