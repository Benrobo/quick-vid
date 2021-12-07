import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import swal from 'sweetalert';

import Back from "../../comp/Icons/Back"
import "./login.css"

import { Request, Redirect, setToken } from "../../utils/index"



function Alert() {
    this.success = (text) => {
        return swal({
            title: "Success",
            text,
            icon: "success",
            button: "Ok",
        });
    }

    this.error = (text) => {
        return swal({
            title: "error",
            text,
            icon: "error",
            button: "Ok",
        });
    }
}

let newAlert = new Alert()

function Login() {

    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email === "" || pwd === "") {
            newAlert.error("Fields cant be empty")
            return
        }

        let data = {
            email: email,
            password: pwd
        }

        setLoading(true)

        let api = "http://localhost:5000/quick-vid/api/login"
        let { req, res } = await Request(api, "post", {
            "content-type": "application/json"
        }, data)

        if (req.status === 200) {
            let usersData = {
                user: res.users,
                accessToken: res.accessToken,
                refreshToken: res.refreshToken
            }
            setLoading(false)
            newAlert.success("User registed successfully")
            setToken(usersData)
            Redirect("/login", 1200)
        }
        else if (req.status === 400) {
            setLoading(false)
            newAlert.error(res.message)
        }
        else {
            setLoading(false)
            newAlert.success("Something went wrong, try again later")
        }
    }

    return (
        <>
            <Back path="/" size="1x" />

            <div className="auth-cont">
                <div className="auth-form">
                    <p>Login</p>
                    <br />
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="form-control" />
                    <br />
                    <input type="password" placeholder="Password" onChange={(e) => setPwd(e.target.value)} className="form-control" />
                    <br />
                    <button className="btn btn-block btn-primary" onClick={handleSubmit}>{loading ? "Logging In ...." : "Log In"}</button>
                    <br />
                    <small>
                        have an account? <Link to="/signup">create one</Link>
                    </small>
                </div>
            </div>
        </>
    )
}

export default Login
