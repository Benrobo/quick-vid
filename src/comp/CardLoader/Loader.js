import React from 'react'
import "./loader.css"

function Loader() {
    let count = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    return (
        <div className="loader-cont">
            {
                count.map((i) => (
                    <div className="loader" key={i}>
                        <div className="head"></div>
                        <div className="body">
                            <div className="a"></div>
                            <div className="b"></div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Loader
