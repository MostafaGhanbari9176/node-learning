module.exports = (req, res, next) => {
    req.flash = flash
    next()
}

const flash = function (key, value) {
    if (value == null)
        return get(key, this.session)
    return store(key, value, this.session)
}

const store = (key, value, _session) => {
    const flashHistory = _session.flash || []
    flashHistory.push({key: key, value: value})
    _session.flash = flashHistory
    _session.save(err => {
        if (err)
            console.log("storing flash on session error")
        return Promise.resolve()
    })
}

const get = (key, _session) => {
    const flashList = _session.flash || []
    const flash = flashList.find(i => i.key === key)
    if (flash) {
        _session.flash = flashList.filter(i => i.key !== key)
        _session.save(err => {
            if (err)
                console.log("update flash on session error")
            //return Promise.resolve(flash.value)
        })
        return flash.value
    } else
        //return Promise.resolve(undefined)
        return undefined
}