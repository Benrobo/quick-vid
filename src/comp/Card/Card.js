import React, { useState, useEffect } from 'react'
import data from "./Card.json"
import "./Card.css"
import { Link } from 'react-router-dom'
import { Request } from '../../utils';
import moment from 'moment';
import Loader from '../CardLoader/Loader';

function Card() {
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [postLength, setPostsLength] = useState([]);
    const [error, setError] = useState("")

    useEffect(() => {
        const getPosts = async () => {
            // fetch data
            try {
                setLoading(true)
                let api = "http://localhost:5000/quick-vid/api/posts/all"
                let { req, res } = await Request(api, "get", {
                    "content-type": "application/json"
                });

                if (req.status === 200 && res) {
                    setLoading(false);
                    setPosts([...res])
                    setPostsLength(res.length)
                    return
                }
                else {
                    setLoading(false)
                    setError("Something went wrong fetching posts.")
                }
            }
            catch (e) {
                setLoading(false);
                setError("Something went wrong fetching posts")
            }
        }

        getPosts()
    }, [])

    return (
        <div className="video-container">

            {
                loading === true ? <Loader /> :
                    postLength === 0
                        ?

                        <p>No Videos Available, Try Uploading.</p>

                        :
                        error === "" ?
                            posts.map((list) => {
                                return (
                                    <Link to={`/videoPreview/${list.videoId}`} key={list.id} data-video-url={list.videoUrl}>
                                        <div className="vid-card">
                                            <div className="img-cont" style={{ background: `url(${list.videoImage})`, }}>
                                                <img src={list.videoImage} alt={list.title} />
                                            </div>
                                            <div className="time-cont">
                                                <span>{list.userName}</span>
                                                <span>{moment(list.created_at).startOf('hour').fromNow()}</span>
                                            </div>
                                            <div className="vid-info">
                                                <p className="title">{list.title}</p>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            }) : error
            }
        </div>
    )
}

export default Card
