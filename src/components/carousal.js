import React from 'react';
import './carousal.css'

import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IconContext } from "react-icons";
import { AiFillStar } from "react-icons/ai";
import { AiOutlineStar } from "react-icons/ai";
import { AiFillCloseCircle } from "react-icons/ai";

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

function darkenArrow() {
    document.querySelector(".left-arrow").classList.add("hover");
    document.querySelector(".left-arrow").classList.remove("free");
    document.querySelector(".right-arrow").classList.add("hover");
    document.querySelector(".right-arrow").classList.remove("free");
}

function lightenArrow() {
    document.querySelector(".left-arrow").classList.add("free");
    document.querySelector(".left-arrow").classList.remove("hover");
    document.querySelector(".right-arrow").classList.add("free");
    document.querySelector(".right-arrow").classList.remove("hover");
}

const getLegendsDiv = (typesOfDay, key) => {
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
        <div className="carousal_legends">
            {postLegends.map((legend,index)=>{
                return(
                    <div key={key+index} className="dot" style={{backgroundColor: legend.color}}>
                        <span>{legend.code}</span>
                    </div>
                )
            })}
        </div>
    )
}

const getRatingsDiv = (rating, key) => {
    const checked = <AiFillStar />
    const unChecked = <AiOutlineStar/>
    const ratingsList = []

    for (let r = 0; r < rating; r++) {
        ratingsList.push(checked)
    }
    for (let r = rating; r < 5; r++) {
        ratingsList.push(unChecked)
    }

    return(
        <div className="carousal_ratings">
            <IconContext.Provider value={{ className: 'react-icons-ratings', size:"1.5em" }}>
                {ratingsList.map((rating,index)=>{
                    return(
                        <span key={key+index}>{rating}</span>
                    )
                })}
            </IconContext.Provider>
        </div>
    )
}

const carousal = (props) => {
    const carousal = props.posts.map((post, index) => {
        const legendsBox = getLegendsDiv(post.typeofday, post.id)
        const ratingsBox = getRatingsDiv(post.rating, post.id)
        const date = (new Date(post.calendardatetime)).toDateString()
        const dateString = new Date(post.calendardatetime)
        const dateStringKey = `${dateString.getDate()} ${months[dateString.getMonth()]} ${dateString.getFullYear()}`
        const indexValue = (props.posts.length-index).toString()
        return (
            <div key={post.id} id={dateStringKey} className="box" index={indexValue}>
                <div className="carousal_image">
                    <img src={post.media[0].mediaurl} />
                </div>
                <div className="carousal_tile_header">
                    {legendsBox}
                    {ratingsBox}
                </div>
                <p className="carousal_date"><strong>{date}</strong></p>
                <p className="carousal_description">{post.text.length > props.titleLength ? post.text.substring(0, props.titleLength - 7) + '...more' : post.text}</p>
            </div>
        )
    })

    return (
        <div className="wrapper" >
            <div className="left-arrow free" onClick={props.slideLeft}>
                <MdKeyboardArrowLeft className="arrow" fontSize="30px" />
            </div>
            <div className="carousal" onMouseEnter={darkenArrow} onMouseLeave={lightenArrow}>
                <div className="box empty_box"></div>
                {carousal}
                <div className="box empty_box"></div>
            </div>
            <div className="right-arrow free" onClick={props.slideRight}>
                <MdKeyboardArrowRight className="arrow" fontSize="30px" />
            </div>
            <AiFillCloseCircle className="close" onClick={props.closeCarousal}/>
        </div>
    );
};

export default carousal;
