
const Request = async (api, method, headers, data) => {
    try {
        let req = await fetch(api, {
            method,
            headers,
            body: data !== "" || data !== undefined || data !== null || data ? JSON.stringify(data) : null
        })

        let res = await req.json()

        return { req, res }
    }
    catch (e) {
        return { msg: e.message }
    }
}

const Redirect = (path, time = 0) => {
    return setTimeout(() => {
        window.location = (path)
    }, time);

}

const setToken = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data))
}

const getLoggedInUserInfo = () => {
    return JSON.parse(localStorage.getItem("tokens"))
}


module.exports = {
    Request,
    Redirect,
    setToken,
    getLoggedInUserInfo
}