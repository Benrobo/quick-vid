import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import moment from 'moment'
import IsLoggedIn from "../../utils/checkAuth";
import { getLoggedInUserInfo, Request } from "../../utils/index"

import "./video.css"
import Comments from '../../comp/Comments/Comments'

function WatchVideo() {
    const [loading, setLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [videoData, setVideoData] = useState([]);
    const [message, setMessage] = useState("");
    const [copied, setCopied] = useState(false)
    const [comment, setComment] = useState("")
    const [commentData, setCommentData] = useState([])
    const [commentLength, setCommentLength] = useState("");
    const [error, setError] = useState("")


    let { id } = useParams()

    useEffect(() => {
        async function getVideoData() {
            setLoading(true);
            let api = "http://localhost:5000/quick-vid/api/posts/video";
            let { req, res } = await Request(api, "post", {
                "content-type": "application/json"
            }, { vidId: id })

            if (req.status === 200 && res) {
                setVideoData([...res]);
                setLoading(false);
                await getComments()

                // return
            }
            else {
                setLoading(false)
                setMessage(res.message)
            }
        }
        getVideoData()
    }, [])


    function copyLink(e) {
        navigator.clipboard.writeText(e.target.getAttribute("data-link"))
        setCopied(!copied)
    }


    // handle comments upload
    async function handleComment(e) {
        if (e.key === 'Enter') {
            if (comment === "" || comment === null) return

            setComment("")

            let { refreshToken, user } = getLoggedInUserInfo()
            let userId = user.id;
            setCommentLoading(true)
            let api = "http://localhost:5000/quick-vid/api/addComment"
            let { req, res } = await Request(api, "post", {
                "content-type": "application/json",
                "authorization": `Bearer ${refreshToken}`
            }, { userId, videoId: id, comment, userName: user.username })

            if (req.status === 200 && res) {
                setCommentLoading(false);
                setCommentLength(res.length)
                getComments()
                return
            }
            else {
                setCommentLoading(false)
                setError("Something went wrong fetching posts.")
            }
        }
    }

    const getComments = async () => {
        // fetch data
        try {
            setCommentLoading(true)
            let api = "http://localhost:5000/quick-vid/api/posts/comments"
            let { req, res } = await Request(api, "post", {
                "content-type": "application/json"
            }, { videoId: id });

            if (req.status === 200 && res) {
                setCommentLoading(false);
                setCommentData([...res])
                setCommentLength(res.length)
                return
            }
            else {
                setCommentLoading(false)
                setError("Something went wrong fetching posts.")
                return
            }
        }
        catch (e) {
            setCommentLoading(false);
            setError("Something went wrong fetching posts")
        }
    }

    return (

        <>
            {/* <Nav /> */}

            {
                loading === true
                    ?
                    <Error msg={"Fetching Video"} action="loading" />
                    :
                    message === "" ?
                        (
                            // {
                            videoData.map((video) => {
                                let videoId = video.videoId.replace("-", "")
                                return (
                                    <div className="video-preview-cont" key={video.id}>
                                        <div className="video-preview">
                                            <Link to="/">
                                                <button className="btn btn-secondary" style={{ transform: `scale(.75)`, }}>
                                                    Home
                                                </button>
                                            </Link>
                                            <iframe width="1260" className="video" height="480" src={`https://www.loom.com/embed/${id}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true.`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                            <div className="video-cont">
                                                <h4>{video.title}</h4>
                                                <div className="video-info">
                                                    <button className="btn btn-primary" data-link={`https://www.loom.com/share/${videoId}`} onClick={(e) => { copyLink(e) }}>
                                                        {copied === true ? "Coppied ✔✔" : "Share"}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="user-info">
                                                {/* <img src="https://avatars.dicebear.com/api/micah/dvdfvdfv.svg" alt="" className="img-fluid" /> */}
                                                <small>{video.userName}</small>
                                                <small className="time"> . {moment(video.created_at).startOf('hour').fromNow()} . </small>
                                                <small className="views"> 0 views</small>
                                            </div>
                                        </div>
                                        <div className="comment-cont">
                                            <div className="head">
                                                <span className="title">Comments</span>
                                                <span className="count badge badge-primary">{commentLength}</span>
                                            </div>
                                            <div className="form">
                                                {IsLoggedIn() === false ? "log In to comment" : < input type="text" onChange={(e) => setComment(e.target.value)} onKeyPress={handleComment} placeholder="Add Comment" className="form-control comment" value={comment} />}
                                            </div>
                                            <div className="comment-list">
                                                {
                                                    commentLoading === true
                                                        ?
                                                        "loading"
                                                        :
                                                        <Comments comment={commentData} length={commentLength} />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            // }
                        )
                        :
                        <Error msg={message} action="error" />
            }
        </>
    )
}


function Error({ msg, action }) {
    return (
        <div className="msg-cont" style={styles}>
            {msg}
            {action === "loading" ? "" : <Link to="/" className="btn btn-primary mt-4">Go Home</Link>}
        </div>
    )
}

let styles = {
    width: "100%",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    padding: "20px",
    flexDirection: "column"

}

export default WatchVideo
