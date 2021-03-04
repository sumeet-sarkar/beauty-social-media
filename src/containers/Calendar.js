import React, { Component } from 'react';

import axios from 'axios';

import Header from '../components/header';
import Weekdays from '../components/weekdays';
import Days from '../components/days';
import Carousal from '../components/carousal'

import './Calendar.css'

class Calendar extends Component {

    constructor(props) {
        super(props)
        this.date = new Date()

        this.lastFullDate = new Date(
            this.date.getFullYear(),
            this.date.getMonth(),
            this.date.getDate() + 6 - this.date.getDay() 
        )

        this.totalPosts = []
        this.totalPostsIndex = 0

        this.isPostsExhausted = false
        this.requestContinuationToken = null

        this.months = [
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

        this.ioelements = []

        this.carousalIndex = 0
        this.datePostinCarousal = null

        this.state = {
            firstFullDate: new Date(
                this.date.getFullYear(),
                this.date.getMonth(),
                this.date.getDate() + 7 - this.date.getDay() - 56
            ),
            headerDate: new Date(this.date),
            posts: [],
            isCarousalVisible: false,
            carousalPosts: []
        }
    }

    getPosts = (firstFullDate, totalPosts=[...this.totalPosts]) => {
        const request = {
            requestobjects: [
                {
                    "posts": {
                        "operationtype": "read",        
                        "id": {
                            "return": true
                        },
                        "userid": {
                            "searchvalues" : ["41329663-5834-11eb-8e6e-3ca82abc3dd4"],
                            "return": true
                        },
                        "iscalendarentry": {
                            "searchvalues" : ["true"],
                            "return": true
                        },        
                        "media": {
                            "return": true
                        },
                        "rating": {
                            "return": true
                        },
                        "text": {
                            "return": true
                        },
                        "privacy": {
                            "searchvalues": [
                                18
                            ],
                            "return": true
                        },
                        "typeofday": {
                            "return": true
                        },
                        "calendardatetime": {
                            "return": true,
                            "sort" : "descending"
                        },
                        "maxitemcount": "5",
                        "continuationtoken": this.requestContinuationToken
                    }
                }
            ]
        }

        const headers = {
            'Content-Type': 'application/json'
        }
        axios.post('https://devapi.quinn.care/graph', request, { headers:headers })
            .then(response => {

                    if(response.data.responseobjects[0].posts!=null) {
                        response.data.responseobjects[0].posts.forEach(post => {
                            totalPosts.push(post)
                        });
                    }
                    else {
                        this.isPostsExhausted = true
                    }
                    this.requestContinuationToken = response.data.responseobjects[0].continuationtoken
                    this.totalPosts = totalPosts
                    this.setPosts(firstFullDate)
            })
            .catch(error => {
                alert(error)
            })
    }

    setPosts = (firstFullDate) => {
        const newPosts = [
            ...this.state.posts
        ]

        let totalPostsIndex = this.totalPostsIndex
        for(totalPostsIndex; totalPostsIndex<this.totalPosts.length; totalPostsIndex++){
            const postDate = new Date(this.totalPosts[totalPostsIndex].calendardatetime)
            if(postDate >= firstFullDate) {
                newPosts.push(this.totalPosts[totalPostsIndex])
            }
            else {
                break;
            }
        }
        this.totalPostsIndex = totalPostsIndex
        this.setState({
            posts: newPosts,
            carousalPosts: this.totalPosts
        })

        const isRequestNeeded = this.checkIfRequest(firstFullDate)
        if(isRequestNeeded) {
            this.getPosts(firstFullDate)
        }
    }

    removePostsSameDate = () => {
        const posts = [
            ...this.state.posts
        ]
        posts.reverse()
        for(let i = posts.length-1; i>0; i--){

            const currentPostDateCorrectFormat = new Date(new Date(
                posts[i].calendardatetime
                )
            ).toDateString()

            const prevPostDateCorrectFormat = new Date(new Date(
                posts[i-1].calendardatetime
                )
            ).toDateString()

            if(currentPostDateCorrectFormat == prevPostDateCorrectFormat){
                posts.splice(i-1,1)
            }
        }
        return posts
    }

    toggleCarousal = (event) => {
        const isCarousalVisible = !this.state.isCarousalVisible

        if(isCarousalVisible) {
            this.datePostinCarousal = event.target.attributes.id.value
        }

        this.setState({ 
            isCarousalVisible: isCarousalVisible,
        })
    }

    setFirstFullDate = () => {
        const firstFullDate = new Date(
            this.state.firstFullDate.getFullYear(),
            this.state.firstFullDate.getMonth(),
            this.state.firstFullDate.getDate() - 28
        )
        this.setState({
            firstFullDate: firstFullDate,
        })
        return firstFullDate
    }

    checkIfRequest = (firstFullDate) => {

        if(this.isPostsExhausted) {
            return false
        }

        const firstPost = this.totalPosts[this.totalPosts.length-1]

        if(firstPost === undefined) {
            return true
        }

        const firstPostDate = new Date(
                                new Date(firstPost.calendardatetime).toDateString()
                            )
        if(firstFullDate<firstPostDate){
            return true
        }

        return false
    }

    controller = () => {

        const firstFullDate = this.setFirstFullDate()

        if(this.isPostsExhausted == true){
            return
        }

        let isRequestNeeded = this.checkIfRequest(firstFullDate)
        if(isRequestNeeded) {
            this.getPosts(firstFullDate)
        }
        this.setPosts(firstFullDate)
    }

    renderDates = () => {
        if(document.querySelector('.days_container').scrollTop < 300) {
            this.controller()
        }
    }

    scrollToToday = () => {
        document.querySelector('.today').scrollIntoView({behavior: "smooth", block: "end"})
    }

    addTodaySelector = () => {
        const dateStringKey = `${this.date.getDate()} ${this.months[this.date.getMonth()]} ${this.date.getFullYear()}`
        document.querySelector(`[id="${dateStringKey}"]`).classList.add("today")
    }

    getMonths = () => {
        const monthsList = []

        let firstMonth;

        if(this.state.firstFullDate.getDate() == 1) {
            firstMonth = new Date(this.state.firstFullDate)
        }
        else {
            firstMonth = new Date(
                this.state.firstFullDate.getFullYear(),
                this.state.firstFullDate.getMonth() + 1,
                1
            )
        }

        const lastMonth = new Date(
            this.lastFullDate.getFullYear(),
            this.lastFullDate.getMonth(),
            1
        )
        for (let month = new Date(firstMonth); month<=lastMonth; month.setMonth(month.getMonth()+1)) {
            const dateOnSunday = new Date(
                month.getFullYear(),
                month.getMonth(),
                1-month.getDay()
            )
            monthsList.push(dateOnSunday)
        }
        return monthsList
    }

    setHeaderMonth = (dateString, isScrollingUp) => {

        const date = new Date(dateString)
        let headerDate;
        if(isScrollingUp){
            headerDate = new Date(
                date.getFullYear(),
                date.getMonth()-1,
                1
            )
        } else {
            headerDate = date
        }
        this.setState({ headerDate: headerDate })
    }

    createObserver = () => {
        const daysContainer = document.querySelector('.days_container');
        let prevScrollValue = daysContainer.scrollHeight - daysContainer.scrollTop;
        let currentScrollValue = prevScrollValue;
        const io = new IntersectionObserver(entries => {
            let isScrollingUp;
            
            currentScrollValue = daysContainer.scrollHeight - daysContainer.scrollTop
            if(currentScrollValue-prevScrollValue > 0){
                isScrollingUp = true
            }
            entries.map(entry => {

                if(prevScrollValue==currentScrollValue){
                    for(let i = 0; i<entries.length; i++) {
                        if(entries[i].isIntersecting) {
                            this.setHeaderMonth(entries[i].target.getAttribute("headerdate"), true)
                            break
                        }
                    }
                }
                else if( (entry.isIntersecting && isScrollingUp) || (!entry.isIntersecting && !isScrollingUp) ){
                    this.setHeaderMonth(entry.target.getAttribute("headerdate"), isScrollingUp)
                }
            })
            prevScrollValue = currentScrollValue
        }, {
            threshold: [1.0],
            // 🆕 Track the actual visibility of the element
            // trackVisibility: true,
            // // 🆕 Set a minimum delay between notifications
            // delay: 100
        })
        document.querySelectorAll('[headerdate]').forEach(elem => {
            if(this.ioelements.indexOf(elem) == -1){
                this.ioelements.push(elem)
                io.observe(elem)
            }
        })
    }

    slideCarousal = (scrollingDirection) => {
        if(scrollingDirection==="right" && this.carousalIndex != 1) {
            document.querySelectorAll('[index]')[this.totalPosts.length-this.carousalIndex].classList.remove('box_focus')
            this.carousalIndex--
        }
        else if (scrollingDirection==="left" && this.carousalIndex != this.totalPosts.length){
            document.querySelectorAll('[index]')[this.totalPosts.length-this.carousalIndex].classList.remove('box_focus')
            this.carousalIndex++
            if(this.totalPosts.length - this.carousalIndex < 5 && !this.isPostsExhausted) {
                this.getPosts()
            }
        }
        document.querySelectorAll('[index]')[this.totalPosts.length-this.carousalIndex].classList.add('box_focus')
        document.querySelectorAll('[index]')[this.totalPosts.length-this.carousalIndex].scrollIntoView({behavior: "smooth", block: "end", inline:"center"})
    }

    componentDidMount() {
        this.getPosts(this.state.firstFullDate)
        this.addTodaySelector()
        const daysContainer = document.querySelector('.days_container')
        daysContainer.scrollTop += daysContainer.scrollHeight
        this.createObserver()
    }

    componentDidUpdate(prevpost, prevState){
        if (this.state.firstFullDate !== prevState.firstFullDate){
            if(navigator.userAgent.indexOf('Chrome')==-1){
                const divHeight = document.querySelector('.days').offsetHeight
                document.querySelector('.days_container').scrollTop += divHeight * 4
            }
            this.createObserver()
        }
        if (this.state.isCarousalVisible != prevState.isCarousalVisible && this.state.isCarousalVisible) {
            const docs = document.querySelectorAll(`.box[id="${this.datePostinCarousal}"]`)
            docs[docs.length-1].scrollIntoView({inline: "center"})
            docs[docs.length-1].classList.add('box_focus')
            this.carousalIndex = parseInt(docs[docs.length-1].getAttribute("index"))
        }
        if (this.state.isCarousalVisible && this.state.carousalPosts !== prevState.carousalPosts) {
            document.querySelectorAll('[index]')[this.totalPosts.length-this.carousalIndex].scrollIntoView({ inline:"center" })
        }
    }

    render() {
        const posts = this.removePostsSameDate()
        const postsReversed = [...this.state.carousalPosts]
        postsReversed.reverse()
        const monthsList = this.getMonths()

        return(
            <div className="container">
                <div className="calendar">
                    <Header 
                        headerDate = {this.state.headerDate}
                        scrollToToday={this.scrollToToday}
                    />

                    <Weekdays />

                    <Days
                        firstFullDate = {this.state.firstFullDate}
                        lastFullDate = {this.lastFullDate}
                        posts = {posts}
                        monthsList = {monthsList}
                        showCarousal = {this.toggleCarousal}
                        renderDates = {this.renderDates}
                    />

                </div>

                {this.state.isCarousalVisible && 
                    <Carousal 
                        posts={postsReversed}
                        titleLength={140}
                        closeCarousal={this.toggleCarousal}
                        slideRight={() => this.slideCarousal("right")}
                        slideLeft={() => this.slideCarousal("left")}
                    />
                }
            </div>
        )
    }
}

export default Calendar;
