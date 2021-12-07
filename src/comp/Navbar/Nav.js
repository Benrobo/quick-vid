import React, { useState } from 'react'
import { Link } from "react-router-dom"
import "./Nav.css"
import logo from "../../logo.png"
import isLoggedIn from "../../utils/checkAuth"
import moment from 'moment';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faUpload, faUser, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Redirect, Request } from "../../utils/index"

function Nav() {
    const [search, setSearch] = useState("");
    const [visibility, setVisibility] = useState(false)
    const [posts, setPosts] = useState([]);
    const [postLength, setPostsLength] = useState([]);
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);
    const [searchCont, setSearchCont] = useState(false)

    async function handleSearch(e) {
        if (search === "") return;

        if (e.key === "Enter") {
            setSearchCont(true)
            try {
                setLoading(true)
                let api = "http://localhost:5000/quick-vid/api/posts/search"
                let { req, res } = await Request(api, "post", {
                    "content-type": "application/json"
                }, { text: search });

                if (req.status === 200 && res) {
                    setLoading(false)
                    setPosts(res)
                    setPostsLength(res.length)
                    return
                }
                else {
                    setLoading(false)
                    setError("Something went wrong fetching posts")
                    return
                }
            }
            catch (e) {
                setLoading(false)
                setError("Something went wrong fetching posts")
            }
        }
    }

    const displayMoreInfo = () => {
        setVisibility(!visibility)
    }

    const logUserOut = () => {
        localStorage.removeItem("tokens")
        Redirect("/", 0)
    }

    function hideCont() {
        setSearchCont(false)
    }

    return (
        <nav className="nav-cont">
            {searchCont && <SearchCont postLength={postLength} error={error} posts={posts} hide={hideCont} />}

            <div className="logo">
                <img src={logo} alt="" className="logo img-fluid" />
            </div>
            <div className="search">
                <input type="text" onKeyPress={handleSearch} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="form-control search-inp" />
            </div>

            <div className="user-info">
                {isLoggedIn() && <Link to="/upload" className="btn btn-info login">
                    <FontAwesomeIcon icon={faUpload} /> Upload
                </Link>}
                {!isLoggedIn() && <Link to="/login" className="btn btn-primary login">
                    <FontAwesomeIcon icon={faLock} /> Login
                </Link>}
                {isLoggedIn() && <img src="https://avatars.dicebear.com/api/micah/dvdfvdfv.svg" onClick={displayMoreInfo} alt="" className="img-fluid" />}
                <div className="actions">
                </div>
                {
                    visibility
                    &&
                    <div className="more-info-cont">
                        <li><Link to="/upload"><FontAwesomeIcon icon={faUser} size="1x" /> Upload</Link></li>
                        {isLoggedIn() && <li onClick={logUserOut}><FontAwesomeIcon icon={faLock} size="1x" /> Logout</li>}
                    </div>
                }
            </div>
        </nav>
    )
}

function SearchCont({ postLength, posts, error, hide }) {

    return (
        <div className="search-container" style={styles} onClick={hide}>
            {postLength === 0
                ?
                <p>Sorry Posts Not found.</p>
                :
                error === "" ? posts.map((list) => {
                    return (
                        <Link to={`/videoPreview/${list.videoId}`} key={list.id} data-video-url={list.videoUrl}>
                            <div className="vid-card" style={vcardStyle}>
                                <div className="img-cont" >
                                    <img alt={list.title} style={{ width: "150px" }} src={list.videoImage} />
                                </div>
                                <div className="time-cont">
                                    <small>{list.userName}. </small>
                                    <small>{moment(list.created_at).startOf('hour').fromNow()}</small>
                                </div>
                                <div className="vid-info">
                                    <small className="title">{list.title}</small>
                                </div>
                            </div>
                        </Link>
                    )
                }) : error
            }
        </div>
    )
}

let styles = {
    width: "100%",
    height: "100vh",
    position: "fixed",
    left: 0,
    top: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    padding: "20px",
    flexDirection: "row",
    flexWrap: "wrap",
    background: "#000",
    zIndex: 1000,
}

const vcardStyle = {
    width: "200px",
    height: "200px",
    position: "relative",
    margin: "20px",
    borderRadius: "10px",
    cursor: "pointer",
    opacity: 1,
    transition: "0.2s ease",
    transform: "scale(1)",
    textDecoration: "none",
    fontSize: "15px",
}


export default Nav
