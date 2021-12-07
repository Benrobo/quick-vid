import React, { useState, useEffect } from 'react'
import { setup, isSupported } from "@loomhq/loom-sdk";
import { oembed, validate } from "@loomhq/loom-embed";
import swal from 'sweetalert';
import Back from "../../comp/Icons/Back.js"
import "./upload.css"
import { Request, Redirect, getLoggedInUserInfo } from "../../utils/index"
import { Link } from 'react-router-dom';



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


const API_KEY = "da36099c-057a-4059-8bb6-4f1763fce585"
const BUTTON_ID = "loom-sdk-button";

function Upload() {
    const [embedUrl, setEmbedUrl] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [doneLoading, setDonloading] = useState(false)

    useEffect(() => {
        setLoading(!loading)
        try {
            async function setupLoom() {
                const { supported, error } = await isSupported();
                if (!supported) {
                    console.warn(`Error setting up Loom: ${error}`);
                    return;
                }
                const button = document.getElementById(BUTTON_ID);
                if (!button) {
                    return;
                }

                const { configureButton } = await setup({
                    apiKey: API_KEY,
                    config: { insertButtonText: 'Save Recorded Video' }
                });


                configureButton({
                    element: button,
                    hooks: {
                        onInsertClicked: async (videoInfo) => {
                            let newtitle = window.prompt("Video Title");
                            if (newtitle === "" || newtitle === null) {
                                window.prompt("Video Title")
                                return
                            }
                            // extract some meta data
                            let { embedUrl, id } = videoInfo;
                            setEmbedUrl(embedUrl)
                            setLoading(false)
                            // save the video in database
                            let user = getLoggedInUserInfo().user
                            let { refreshToken } = getLoggedInUserInfo()
                            let sendData = { videoId: id, userId: user.id, email: user.email, username: user.username, title: newtitle, embedUrl }

                            setLoading(true);
                            setDonloading(false);

                            let api = "http://localhost:5000/quick-vid/api/addPosts"
                            let { req, res } = await Request(api, "post", {
                                "content-type": "application/json",
                                "authorization": `Bearer ${refreshToken}`
                            }, sendData)
                            console.log(req, res)
                            if (req.status === 200) {
                                setLoading(false);
                                setDonloading(true);
                                newAlert.success("Posts added successfully")
                                Redirect("/", 5)
                                return;
                            }
                            else if (req.status === 400) {
                                setLoading(false);
                                setDonloading(true);
                                newAlert.error(res.message)
                                Redirect("/upload", 3000)
                                return;
                            }
                            else {
                                setLoading(false);
                                setDonloading(true);
                                newAlert.error("Something went wrong, try again later")
                                return;
                            }
                        },
                        onRecordingComplete: () => {

                        },
                        onCancel: () => {
                            setLoading(false)
                            setDonloading(true)
                            newAlert.error("Recording of video has been terminated")
                            return
                        }
                    }
                });
            }

            setupLoom();
        } catch (e) {
            return newAlert.error("Failed to setup screen recorder, please try again later")
        }
        setLoading(false)
    }, []);

    // function saveData() {
    //     if (title === "") {
    //         newAlert.error("Title field is empty")
    //         return
    //     }
    // }


    return (
        <div className="main-cont">
            <div className="upload-cont">
                <Back path="/" size="1x" />
                <div className="head">
                    <h3>Add Video</h3>
                </div>
                <div className="body">
                    {/* <p>Title</p> */}
                    {/* <input type="text" placeholder="Title" maxLength="20" onChange={(e) => setTitle(e.target.value)} className="form-control title" /> */}
                    <br />
                    <div className="upload-box">
                        <div className="actions">
                            <button id={BUTTON_ID} className="btn btn-info upload-btn" disabled={loading === true ? true : false}>Record Screen & Save Video</button>
                            <Link to="/">
                                <button className="btn btn-danger">Cancel</button>
                            </Link>
                        </div>
                    </div>
                    <br />
                    {doneLoading === true ? "Saving Video" : ""}
                </div>
            </div>
        </div>
    )
}

export default Upload
