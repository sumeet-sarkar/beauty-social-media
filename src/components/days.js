import React from 'react'
import { IconContext } from "react-icons";
import { AiFillStar } from "react-icons/ai";
import { AiOutlineStar } from "react-icons/ai";
import './days.css'

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
    "Dec",
]

const getRatingsElement = (rating, dateStringKey) => {
    const checked = <AiFillStar />
    const unChecked = <AiOutlineStar/>
    const ratingsList = []

    for (let r = 0; r < rating; r++) {
        ratingsList.push(checked)
    }
    for (let r = rating; r < 5; r++) {
        ratingsList.push(unChecked)
    }

    let ratingStarSize = "0.6em"
    if(window.innerWidth > 720) {
        ratingStarSize = "1em"
    }

    return(
        <div className="calendar_ratings">
            <IconContext.Provider value={{ size:`${ratingStarSize}` }}>
                {ratingsList.map((rating,index)=>{
                    return(
                        <span key={dateStringKey+index}>{rating}</span>
                    )
                })}
            </IconContext.Provider>
        </div>
    )
}

const getLegendsElement = (typesOfDay, dateStringKey) => {
    const legendsNotation = {
        "hair cut": {
            code: "Cu",
            color: "#00FFFF",
        },
        "protein treatment": {
            code: "Pr",
            color: "#F0F8FF",
        },
        "hair color": {
            code: "HC",
            color: "#F5F5DC",
        },
        "deep conditioning": {
            code: "DC",
            color: "#FFEBCD",
        },
        "clarifying": {
            code: "C",
            color: "#6495ED",
        }
    }
    const postLegends = []

    typesOfDay.map(typeOfDay=>{
        const legend = {
            code: legendsNotation[typeOfDay].code,
            color: legendsNotation[typeOfDay].color
        }
        postLegends.push(legend)
    })

    return(
        <div className="calendar_legends">
            {postLegends.map((legend,index)=>{
                return(
                    <span key={dateStringKey+index} className="dot" style={{backgroundColor: legend.color}}>{legend.code}</span>
                )
            })}
        </div>
    )
}

const getMonthElementJSX = headerDate =>{
    return(
        <p className="month"> {months[headerDate.getMonth()]}</p>
    )
}

const getMonthElement = (month, date) => {
    if(month == undefined || date.toDateString() != month.toDateString()){
        return [null, null]
    }
    else {
        let headerDate
        if(date.getDate()==1){
            headerDate = new Date(date)
        } else {
            headerDate = new Date(
                date.getFullYear(),
                date.getMonth()+1,
                1
            )
        }
        const monthElement = getMonthElementJSX(headerDate)
        headerDate=headerDate.toDateString()
        return([monthElement, headerDate])
    }
}

const days = props => {

    let postsIndex = 0;
    let monthsIndex = 0;

    const dates = []
    for(let date = new Date(props.firstFullDate); date <= props.lastFullDate; date.setDate(date.getDate()+1)) {
        dates.push(new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ))
    }

    const postDates = []
    props.posts.map(post => {
        const postDateRequiredFormat = new Date(
                                        new Date(post.calendardatetime).toDateString()
                                    )
        postDates.push(postDateRequiredFormat)
    })

    return (
        <div className="days_container" onScroll={props.renderDates}>
            {dates.map(date=>{
                const dateStringKey = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
                const [monthElement, headerDate] = getMonthElement(props.monthsList[monthsIndex], date)
                if(monthElement){monthsIndex++}

                if(postsIndex>=postDates.length || date.toString() != postDates[postsIndex].toString()) {
                    return(
                        <div key={dateStringKey} id={dateStringKey} className="days" headerdate={headerDate}>
                            {monthElement}
                            <p>{date.getDate()}</p>
                        </div>
                    )
                } else {
                    const ratingsBox = getRatingsElement(props.posts[postsIndex].rating, dateStringKey)
                    const legendsBox = getLegendsElement(props.posts[postsIndex].typeofday, dateStringKey)
                    postsIndex++;
                    return(
                        <div key={dateStringKey} className="days" onClick={props.showCarousal} headerdate={headerDate}>
                            <p>{date.getDate()}</p>
                            {monthElement}
                            <div className="calendar_tile" id={dateStringKey} data={props.posts[postsIndex-1].id}>
                                {ratingsBox}
                                <img src={props.posts[postsIndex-1].media[0].mediaurl}></img>
                                {legendsBox}
                            </div>
                        </div>
                    )
                }
            })}
        </div>
    )
}

export default days
