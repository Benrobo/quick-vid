import decode from "jwt-decode"

const IsLoggedIn = () => {
    let tokens = JSON.parse(localStorage.getItem("tokens"));

    if (!tokens || tokens.refreshToken === "" || tokens.accessToken === "") {
        return false;
    }

    try {
        // exp gives us date in miliseconds
        let { exp } = decode(tokens.refreshToken);

        // convert milliseconds -> seconds
        let date = new Date().getTime() / 1000;

        // check if exp date is < the present date
        if (exp < date) {
            return false;
        }

    } catch (e) {
        return false;
    }

    return true;
}

export default IsLoggedIn