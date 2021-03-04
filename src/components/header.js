import React from 'react'

import './header.css'

const header = props => {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ]


    return(
        <div className="header">
            <h1>{months[props.headerDate.getMonth()]} {props.headerDate.getFullYear()}</h1>
            <button onClick={props.scrollToToday}>Today</button>
        </div>
    )
}

export default header
