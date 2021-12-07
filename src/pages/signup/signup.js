import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import swal from 'sweetalert';

import Back from "../../comp/Icons/Back.js"
import "./signup.css"

import { Request, Redirect } from "../../utils/index"



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

function Signup() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name === "" || email === "" || pwd === "") {
            newAlert.error("Fields cant be empty")
            return
        }

        let data = {
            username: name,
            email: email,
            password: pwd
        }

        setLoading(true)

        let api = "http://localhost:5000/quick-vid/api/register"
        let { req, res } = await Request(api, "post", {
            "content-type": "application/json"
        }, data)


        if (req.status === 200) {
            setLoading(false)
            newAlert.success("User registed successfully")
            Redirect("/login", 1000)
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
            <Back path="/" size="20" />

            <div className="auth-cont">
                <div className="auth-form">
                    <p>Signup</p>
                    <br />
                    <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} className="form-control" />
                    <br />
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="form-control" />
                    <br />
                    <input type="password" placeholder="Password" onChange={(e) => setPwd(e.target.value)} className="form-control" />
                    <br />
                    <button className="btn btn-block btn-primary" onClick={handleSubmit}>{loading ? "Signing up ...." : "Signup"}</button>
                    <br />
                    <small>
                        Dont have an account? <Link to="/login">Log In</Link>
                    </small>
                </div>
            </div>
        </>
    )
}

export default Signup
