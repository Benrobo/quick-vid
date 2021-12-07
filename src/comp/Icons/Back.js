import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom"


function Back({ path, size }) {
    return (
        <Link to={path} className="back-conts">
            <FontAwesomeIcon icon={faArrowLeft} size={size} style={{ position: "fixed", top: "50px", left: "50px" }} />
        </Link>
    )
}

export default Back
