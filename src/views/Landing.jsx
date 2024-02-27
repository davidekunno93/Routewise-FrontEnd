import React, { useContext, useEffect, useRef, useState } from 'react'
import { HeroCarousel } from '../components/HeroCarousel'
import { HeroFade } from '../components/HeroFade'
import { Fade, Slide } from 'react-awesome-reveal'
import { DataContext } from '../Context/DataProvider'
import { Link, useNavigate } from 'react-router-dom'
import { DateRange } from 'react-date-range'
import format from 'date-fns/format';
import Scrollbars from 'react-custom-scrollbars-2'

export const Landing = () => {
    const { user, setUser } = useContext(DataContext);
    const { signUpIsOpen, setSignUpIsOpen } = useContext(DataContext);
    const { showNavbar, setShowNavbar } = useContext(DataContext);
    const { authIndex, setAuthIndex } = useContext(DataContext);
    useEffect(() => {
        setShowNavbar(false)
        return restoreNavbar;
    }, [])
    const restoreNavbar = () => {
        setShowNavbar(true)
    }

    // navigate function
    const navigate = useNavigate()
    const goToDashboard = () => {
        if (!user) {
            openSignUp()
        } else {
            navigate('/dashboard')
        }
    }

    // auth related functions
    const openSignUp = () => {
        setAuthIndex(0)
        setSignUpIsOpen(true)
    }
    const openSignIn = () => {
        setAuthIndex(1)
        setSignUpIsOpen(true)
    }


    // item library
    const actionPoints = [
        {
            imgUrl: "https://i.imgur.com/TUK3CGM.png",
            title: "Get Suggestions",
            text: "Browse a catalog of suggested places personalized to your travel preferences and catered to your interests."
        },
        {
            imgUrl: "https://i.imgur.com/uMthR47.png",
            title: "Plan Efficiently",
            text: "Simplify plainning with an itinerary generator that optimizes nearby destinations for effortless travel."
        },
        {
            imgUrl: "https://i.imgur.com/78p1JDz.png",
            title: "Adapt Your Itinerary",
            text: "Travel confidently with a fully customizable itinerary to meet your travel needs."
        },
    ]
    // no longer using these how it works images
    const howItWorksCards = ["https://i.imgur.com/wx4upLO.png", "https://i.imgur.com/02aZHAR.png"]

    // calendar code
    const [calendarOpen, setCalendarOpen] = useState(false);
    const toggleCalendarOpen = () => {
        if (calendarOpen) {
            setCalendarOpen(false);
            // console.log('close calendar')
        } else {
            setCalendarOpen(true);
            // console.log('open calendar')
        }
        // console.log(calendarOpen)
    }

    const [range, setRange] = useState([
        {
            startDate: null, // new Date(),
            endDate: null, // addDays(new Date(), 7),
            key: 'selection'
        }
    ])
    const rangePlaceholder = [
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]
    useEffect(() => {
        // setCalendar(format(new Date(), 'MM/dd/yyyy'))
        document.addEventListener('keydown', hideOnEscape, true)
        document.addEventListener('click', hideOnClickOutsideCalendar, true)
    })
    const hideOnEscape = (e) => {
        if (e.key === "Escape") {
            setCalendarOpen(false)
            closeUserTripPopup()
        }
    }
    const hideOnClickOutsideCalendar = (e) => {
        if (refOne.current && !refOne.current.contains(e.target)) {
            setCalendarOpen(false)
            // closeUserTripPopup()
        }
    }
    const refOne = useRef(null);


    // other functions
    const datify = (normalDate) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let day = normalDate.slice(3, 5)
        let monthNum = normalDate.slice(0, 2)
        if (monthNum.charAt(0) === "0") {
            monthNum = monthNum[1]
        }
        let fullYear = normalDate.slice(6)
        const month = months[monthNum - 1]
        if (day.charAt(0) === "0") {
            day = day[1]
        }
        let twoYear = fullYear.slice(2)
        return month + " " + day + ", " + twoYear
    }

    const exploreImgs = [
        "https://i.imgur.com/NCoueOB.png",
        "https://i.imgur.com/Vq3WthR.jpg",
        "https://i.imgur.com/kStMRiW.jpg",
        "https://i.imgur.com/V82Owfa.jpg",
        "https://i.imgur.com/Mf39Zrc.jpg",
    ]

    return (
        <>
            <div className="hero-section w-100 position-relative">
                <div className="hero-navbar">
                    <img src="https://i.imgur.com/VvcOzlX.png" alt="Routewise" className="routewise-logo ml5" />
                    <div className="flx-r align-c gap-6 mr5">
                        <button onClick={() => openSignUp()} className="btn-primaryflex">Sign Up</button>
                        <p onClick={() => openSignIn()} className="m-0 pointer onHover-fade">Log in</p>
                    </div>
                </div>

                <div className="hero-content-box">


                    <h1 className="hero-title bold500 m-0">Your Next Great <br />Adventure Starts Here</h1>
                    <p className="hero-text w-40 bold600">Effortlessly craft the perfect trip with a more optimized travel itinerary</p>
                    {/* <button onClick={() => goToDashboard()} className="btn-primaryflex"><p className="my-1 mx-2 white-text">Start planning now</p></button> */}

                    <div className="selection-box-landing flx-c">
                        <div className="box-title flx-2 flx-c just-ce"><p className='m-0 mb-2'>Start planning your next adventure</p></div>
                        <div className="box-items flx-3 flx-r mb-4 flx-wrap">
                            <div className="item-location flx-3 flx-c just-en">
                                <div className="mr-2-disappear768">
                                    <div className="box-heading dark-text page-subsubheading">Where are you headed?</div>
                                    <input id='cityInput' type='text' placeholder='City name e.g. Hawaii, Cancun, Rome' className='calendarInput italic-placeholder' required />
                                </div>
                            </div>
                            <div className="item-dates flx- flx-c just-en">
                                <div className="box-heading dark-text page-subsubheading">When will you be there?</div>
                                <div ref={refOne} className="calendarWrap mr-2-disappear768">
                                    <div onClick={() => toggleCalendarOpen()} className="calendarInput pointer">
                                        <div className="startDateInput flx-1">
                                            <span className={`material-symbols-outlined ${range[0].startDate ? "purple-text" : "lightgray-text"}`}>date_range</span>
                                            <p className={`m-0 ${range[0].startDate ? null : "lightgray-text"}`}>{range[0].startDate ? datify(format(range[0].startDate, "MM/dd/yyyy")) : "Start Date"}</p>
                                        </div>
                                        <hr className='h-40' />
                                        <div className="endDateInput flx-1">
                                            <span className={`material-symbols-outlined ${range[0].endDate ? "purple-text" : "lightgray-text"}`}>date_range</span>
                                            <p className={`m-0 ${range[0].endDate ? null : "lightgray-text"}`}>{range[0].startDate ? datify(format(range[0].endDate, "MM/dd/yyyy")) : "End Date"}</p>
                                        </div>

                                    </div>
                                    <div>
                                        {calendarOpen &&
                                            <DateRange
                                                onChange={item => setRange([item.selection])}
                                                editableDateInputs={true}
                                                moveRangeOnFirstSelection={false}
                                                ranges={range[0].startDate ? range : rangePlaceholder}
                                                months={1}
                                                direction='horizontal'
                                                className='calendarElement'
                                            />
                                        }
                                    </div>

                                </div>

                            </div>
                            <div className="flx-c">
                                <Link to='/dashboard' className='position-bottom'>
                                    <button className="btn-primaryflex2 position-bottom">Start Planning</button>
                                </Link>
                            </div>
                        </div>
                        {/* <div className="item-addtrip flx style-respond">
                            <button className="btn-primaryflex2 mt-3">Start Planning</button>
                        </div> */}
                    </div>

                </div>
                <HeroFade />
            </div>


            <div className="planning-section mt-8">
                <Fade delay={300} triggerOnce>
                    <Slide direction='up' triggerOnce>
                        <h1 className="page-title w-65 center-text m-auto my-9 font-noto bold600">Planning your day-to-day travel itinerary just got a whole lot easier</h1>
                        <div className="action-points">
                            {actionPoints.map((point, index) => {
                                let first = 0
                                let last = actionPoints.length - 1
                                return <div key={index} className="point-holder">
                                    <div className={`v-line-divider ${index === last ? "d-none" : null}`}></div>
                                    <div className="point">
                                        <img src={point.imgUrl} alt="" className='point-img' />
                                        <div className="title">{point.title}</div>
                                        <div className="text">{point.text}</div>

                                    </div>
                                </div>
                            })}


                        </div>


                        {/* <div className="empty-3"></div> */}
                    </Slide>
                </Fade>
            </div>



            <div className="how-it-works mt-8">


                <div className="page-card2 flx-r">
                    <div className="flx-1 left-side">
                    </div>
                    <div className="flx-1 right-side flx-c">
                        <div className="content">

                            <p className="large m-0 mb-5 font-jakarta bold600 purple-text">HOW IT WORKS</p>
                            <h2 className="page-title font-noto bold500 mt-6">Craft the Perfect Getaway</h2>
                            <div className="page-card2-text">

                                <div className="item flx-r gap-2">
                                    <img src="https://i.imgur.com/DkwGOth.png" alt="" className="pin-bullet mr-3" />
                                    <p className="landing-title flx align-c m-0">Add places you want to visit</p>
                                </div>
                                <div className="item flx-r gap-2">
                                    <img src="https://i.imgur.com/qGDtWpZ.png" alt="" className="pin-bullet mr-3" />
                                    <p className="landing-title flx align-c m-0">Generate your proximity-based itinerary</p>
                                </div>
                                <div className="item flx-r gap-2">
                                    <img src="https://i.imgur.com/93zoDqE.png" alt="" className="pin-bullet mr-3" />
                                    <p className="landing-title flx align-c m-0">Customize your itinerary and explore!</p>
                                </div>
                            </div>
                            <div className="flx-r mt-5">
                                <button onClick={() => setSignUpIsOpen(true)} className="btn-primaryflex2">Sign up</button>
                            </div>



                        </div>
                    </div>
                </div>

                {/* <div className="cards w-90 m-auto">
                    <Fade delay={500} fraction={0.6} triggerOnce>
                        <Slide fraction={0.6} direction='left' triggerOnce>
                            <div className="card4-l flx-r-respond600 my-10">
                                <div className="flx-3">
                                    <img src="https://i.imgur.com/un3ARG9.png" alt="" className="card4-img" />
                                </div>
                                <div className="flx-2 flx pad2p">
                                    <div className="m-auto">
                                        <div className="landing-title flx-r">
                                            <div className="">
                                                <img src="https://i.imgur.com/B1KMmUe.png" alt="" className="pin-bullet mr-3" />
                                            </div>
                                            <div className="flx-c">
                                                <p className="mt-0">Add places to your trip list</p>
                                                <p className="m-0 landing-text">Look up the places you want to go on the map and add it to your trip list with a click of a button!</p>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Slide>
                        <Slide fraction={0.6} direction='right' triggerOnce>
                            <div className="card4-r flx-r-respond600-reverse my-10">
                                <div className="flx-2 flx pad2p">
                                    <div className="m-auto">
                                        <div className="landing-title flx-r">
                                            <div className="">
                                                <img src="https://i.imgur.com/X80Z1AG.png" alt="" className="pin-bullet mr-3" />
                                            </div>
                                            <div className="flx-c">
                                                <p className="mt-0">Generate a proximity-based itinerary</p>
                                                <p className="m-0 landing-text">Decide the places you want to see and we'll fit it into an itinerary that groups nearby places together to maximize your time and minimize the stress of figuring out what to do next.</p>

                                            </div></div>
                                    </div>
                                </div>
                                <div className="flx-3">
                                    <img src="https://i.imgur.com/jreQknC.png" alt="" className="card4-img" />
                                </div>
                            </div>
                        </Slide>
                        <Slide fraction={0.6} direction='left' triggerOnce>
                            <div className="card4-l flx-r-respond600 my-10">
                                <div className="flx-1">
                                    <img src="https://i.imgur.com/cCoCoMv.png" alt="" className="card4-img" />
                                </div>
                                <div className="flx-1 flx pad2p">
                                    <div className="m-auto">
                                        <div className="landing-title flx-r">
                                            <div className="">
                                                <img src="https://i.imgur.com/ARSN66k.png" alt="" className="pin-bullet mr-3" />
                                            </div>
                                            <div className="flx-c">
                                                <p className="mt-0">Customize your itinerary and explore!</p>
                                                <p className="m-0 landing-text">We know that plans change. After your itinerary is generated, easily add more places to your itinerary and move activities around to create the perfect trip that meets your needs.</p>

                                            </div></div>
                                    </div>
                                </div>
                            </div>
                        </Slide>
                    </Fade>

                </div> */}


            </div>

            <div className="empty-4"></div>

            <div className="explore-section">
                <div className="page-title font-noto center-text my-5">Explore with us on Instagram!</div>
                <div className="ig-carousel-window">

                    {/* <div className="inner-no-flex"> */}
                    <div className="ig-cards">

                        {exploreImgs.map((img, index) => {
                            let first = index === 0 ? true : false
                            return <div key={index} className={`ig-card ${!first ? "ml-4" : ""}`}>
                                <img src={img} alt="" className="fill-img" />
                            </div>
                        })}

                    </div>
                    {/* </div> */}
                </div>
            </div>

            {/* <div className="page-card">
                <div className="flx-r-respond768">
                    <p className="page-heading-bold page-card-title center-text appear768">Did you know?</p>
                    <div className="img flx-1 flx">
                        <img src="https://i.imgur.com/FxsCfD2.png" alt="" className="page-card-img m-auto my-12-respond768" />
                    </div>
                    <div className="body flx-1">
                        <div className="pad28 w-80">
                            <p className="page-heading-bold page-card-title disappear768">Did you know?</p>
                            <p className="page-card-text">
                                Pigeons have a small spot on their beak that is believed to contain a magnetic mineral called magnetite. This acts as a natural compass and allows them to sense the Earth's magnetic field, helping them determine their position and navigating in the right direction. <br /><br />
                                That's why we've enlisted the pigeon as our little mascot, to help travelers pick up the breadcrumbs and plan the most efficient itinerary that utilizes the proximity of locations for a stress-free trip.<br /><br />
                                Ready to get started?
                            </p>
                            <button onClick={() => goToDashboard()} className="btn-primaryflex2 mt-4">Start planning now</button>
                        </div>
                    </div>
                </div>
            </div> */}


        </>
    )
}
