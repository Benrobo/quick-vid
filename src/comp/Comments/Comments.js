import React, { useState, useEffect } from 'react'
// import data from "./Card.json"
import "./Comment.css"
import { Link } from 'react-router-dom'
import { Request } from '../../utils';
import moment from 'moment';

function Comments({ comment, length }) {
    return (
        <>
            {
                length === 0 ?
                    "No comments"
                    :
                    comment.map((cm, i) => {
                        return (
                            <div className="comment-container" key={i}>
                                <div className="comment-card">
                                    <img src={cm.userImg} alt="" className="img-fluid" />
                                    <div className="comment-text">
                                        <small>{cm.userName}</small>
                                        <span>{cm.text}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
            }
        </>
    )
}

export default Comments
