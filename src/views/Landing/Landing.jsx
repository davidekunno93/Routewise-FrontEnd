import React, { useContext, useEffect, useRef, useState } from 'react'
import { HeroFade } from '../../components/HeroFade'
import { Fade, Slide } from 'react-awesome-reveal'
import { DataContext } from '../../Context/DataProvider'
import { Link, useNavigate } from 'react-router-dom'
import { DateRange } from 'react-date-range'
import format from 'date-fns/format';
import { NameTripModal } from '../NameTripModal'
import { LoadingModal } from '../../components/Loading/LoadingModal'
import axios from 'axios'
import './Landing.scoped.css'
import WorldCitiesSearchBar from '../../components/WorldCitiesSearchBar/WorldCitiesSearchBar'
import FeaturedTripCard from '../../components/FeaturedTripCard/FeaturedTripCard'
import LinearGradient from '../../components/LinearGradient/LinearGradient'
import NavigationTabs from '../../components/NavigationTabs/NavigationTabs'
import { auth } from '../../firebase'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import CarouselWiper from '../../components/Carousel/CarouselWiper'
import { max } from 'date-fns'

export const Landing = () => {
    const { user, setCurrentTrip, mobileMode, authFunctions, getCountryName, timeFunctions,
        convertAbbvToState, isStateAbbv } = useContext(DataContext);

    // page navigation
    const navigate = useNavigate();
    const goToDashboard = () => {
        if (!user) {
            authFunctions.openSignUp();
        } else {
            navigate('/dashboard');
        };
    };



    // item libraries
    const actionPoints = [
        {
            imgUrl: "https://i.imgur.com/U3xTQeb.png",
            title: "Get Suggestions",
            text: "Travel confidently with experiences catered to your interests"
        },
        {
            imgUrl: "https://i.imgur.com/luxuMC7.png",
            title: "Plan Efficiently",
            text: "Simplify plainning with an itinerary generator that optimizes nearby destinations for effortless travel."
        },
        {
            imgUrl: "https://i.imgur.com/3uIhLaI.png",
            title: "Adapt Your Itinerary",
            text: "Travel confidently with a fully customizable itinerary to meet your travel needs."
        },
    ];
    const igPosts = [
        {
            title: "Explore Kyoto with RouteWise",
            imgUrl: "https://i.imgur.com/7VoY5tnh.jpg",
            displayPicture: "https://i.imgur.com/qyd4LXy.png",
            caption: "Kyoto, Japan is my ultimate travel spot, and here's why...",
            link: "https://www.instagram.com/p/C-GyTLkpRMo/",
        },
        {
            title: "Discover Reykjavik with RouteWise",
            imgUrl: "https://i.imgur.com/ZNCaiV8h.jpg",
            displayPicture: "https://i.imgur.com/qyd4LXy.png",
            caption: "Reykjavik, the northernmost capital of a sovereign state, is renowned for its unique landscapes and nature that are unlike anywhere else in the world.",
            link: "https://www.instagram.com/p/C-bwK0KJS_C/",
        },
        {
            title: "Wander London Like a Local",
            imgUrl: "https://i.imgur.com/wo57fM1h.jpg",
            displayPicture: "https://i.imgur.com/qyd4LXy.png",
            caption: "This week, our front-end developer David is sharing his favorite city: London!",
            link: "https://www.instagram.com/p/C-t9refOmrZ/",
        },
        {
            title: "This Week's City Spotlight: Victoria!",
            imgUrl: "https://i.imgur.com/AoGbBOWh.jpg",
            displayPicture: "https://i.imgur.com/qyd4LXy.png",
            caption: "With its beautifully preserved architecture and the welcoming, laid-back vibe of the locals, Victoria is the perfect place to unwind and soak in some history.",
            link: "https://www.instagram.com/p/C-9BkAHMSKN/",
        },
    ];
    const featuredTrips = [
        {
            imgUrl: "https://i.imgur.com/vwbHzLT.png",
            title: "Tokyo, Japan",
            duration: 3,
            numberOfPlaces: 20,
        },
        {
            imgUrl: "https://i.imgur.com/3eQRFxi.png",
            title: "Paris, France",
            duration: 4,
            numberOfPlaces: 20,
        },
        {
            imgUrl: "https://i.imgur.com/agePW4J.png",
            title: "Rome, Italy",
            duration: 5,
            numberOfPlaces: 24,
        },
    ];
    const tabs = [
        {
            tabName: "Create a trip",
            conciseTabName: "Create",
            imgUrl: "https://i.imgur.com/b3MWD7T.gif",
        },
        {
            tabName: "Add Places",
            conciseTabName: "Add",
            imgUrl: "https://i.imgur.com/LIwYn0h.gif",
        },
        {
            tabName: "Modify Itinerary",
            conciseTabName: "Modify",
            imgUrl: "",
        },
    ];

    // calendar code
    const [calendarOpen, setCalendarOpen] = useState(false);
    const toggleCalendarOpen = () => {
        if (calendarOpen) {
            setCalendarOpen(false);
        } else {
            setCalendarOpen(true);
        };
    };
    const [range, setRange] = useState([
        {
            startDate: null, // new Date(),
            endDate: null, // addDays(new Date(), 7),
            key: 'selection'
        }
    ]);
    const rangePlaceholder = [
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ];
    useEffect(() => {
        document.addEventListener('keydown', hideOnEscape, true)
        document.addEventListener('click', hideOnClickOutsideCalendar, true)
        return () => {
            document.removeEventListener('keydown', hideOnEscape, true)
            document.removeEventListener('click', hideOnClickOutsideCalendar, true)
        }
    }, []);
    // click outside calendar functions
    const calendarWrapRef = useRef(null);
    const hideOnEscape = (e) => {
        if (e.key === "Escape") {
            setCalendarOpen(false)
            closeUserTripPopup()
        };
    };
    const hideOnClickOutsideCalendar = (e) => {
        if (calendarWrapRef.current && !calendarWrapRef.current.contains(e.target)) {
            setCalendarOpen(false)
            // closeUserTripPopup()
        };
    };



    // start planning trip code
    const [tripData, setTripData] = useState(null);
    const [createTripControls, setCreateTripControls] = useState({
        cityInput: "",
        startDate: null,
        endDate: null,
        tripIsLoading: false,
        tripModalOpen: false,
        tripModalWidth: 450,
    });
    const createTripFunctions = {
        updateCityInput: function (inputText) {
            setCreateTripControls({
                ...createTripControls,
                cityInput: inputText,
            });
        },
        updateTripDates: function (itemSelection) {
            setCreateTripControls({
                ...createTripControls,
                startDate: timeFunctions.datify(format(itemSelection[0].startDate, "MM/dd/yyyy")),
                endDate: timeFunctions.datify(format(itemSelection[0].endDate, "MM/dd/yyyy")),
            });
        },
    };
    const getCity = async () => {
        const cityInput = createTripControls.cityInput;
        if (!cityInput) {
            // if there is no city entered --> please enter city name
            let cityInput = document.getElementById('cityInput')
            cityInput.classList.add('entry-error')
            alert("Please enter a travel destination");
        } else if (!range[0].startDate || !range[0].endDate) {
            alert("Please enter a start and end date for your trip");
        } else {
            const apiKey = 'ka/g7nybqosAgLyFNCod1A==WBv07XT0PI2TrXTO'
            // if there is a city entered
            setCreateTripControls({ ...createTripControls, tripIsLoading: true });
            // if the user input includes a "," -- it contains city and state/country
            if (cityInput.includes(",")) {
                // let cityNoSpaces = cityInput.replace(/ /g, '')
                const cityArr = cityInput.split(', ')
                // console.log(cityArr[0], convertAbbvToState(cityArr[1]))
                let url = "";
                if (isStateAbbv(cityArr[1])) {
                    url = `https://api.api-ninjas.com/v1/geocoding?city=${cityArr[0]}&state=${convertAbbvToState(cityArr[1])}&country=US`
                    // console.log(url)
                } else {
                    url = `https://api.api-ninjas.com/v1/geocoding?city=${cityArr[0]}&country=${cityArr[1]}`
                };
                const response = await axios.get(url, {
                    headers: { 'X-Api-Key': apiKey }
                }).then((response => {
                    openNewTrip(response)
                }))
                    .catch((error) => {
                        console.log(error)
                        setCreateTripControls({ ...createTripControls, tripIsLoading: false });
                        alert("City was not found");
                    })
                // go to TripName Modal automatically
            } else {
                // if user enters just a city name with no ","
                const response = await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${cityInput}`, {
                    headers: { 'X-Api-Key': apiKey }
                }).then((response => openNewTrip(response)))
                    .catch((error) => {
                        console.log(error)
                        setCreateTripControls({ ...createTripControls, tripIsLoading: false });
                        alert("City was not found");
                    })
            };
        };
    };
    const openNewTrip = (response) => {
        // if no response catch error***
        let data = response.data
        let geocode = [data[0].latitude, data[0].longitude]
        let countryName = getCountryName(data[0].country)
        let tripDataObj = {
            cityName: data[0].name,
            state: data[0].state,
            country: countryName,
            country_2letter: data[0].country,
            destinationLat: geocode[0],
            destinationLong: geocode[1],
            geocode: geocode,
            startDate: format(range[0].startDate, "MM/dd/yyyy"),
            endDate: format(range[0].endDate, "MM/dd/yyyy"),
        }
        if (typeof tripDataObj.state === 'undefined') {
            tripDataObj.state = ""
        }
        let dataNew = []
        let states = []
        for (let i = 0; i < data.length; i++) {
            if (!states.includes(data[i].state)) {
                dataNew.push(data[i])
            }
            states.push(data[i].state)
        }
        // setCityOptions(dataNew)

        setTripData(tripDataObj)
        setCreateTripControls({ ...createTripControls, tripModalOpen: true, tripIsLoading: false });

        // take first response.data index and use name/state/country/lat/lon 
        // coerse to tripData and open Name Trip modal, using tripData as props
    };


    // maximize travel xp tabs code
    const [activeTabIndex, setActiveTabIndex] = useState(0);


    const items = featuredTrips.map((trip, index) => {
        return (
            <FeaturedTripCard key={index} trip={trip} />
        )
    });


    return (
        <>
            <LoadingModal open={createTripControls.tripIsLoading} width={createTripControls.tripModalWidth} height={500} onClose={() => setCreateTripControls({ ...createTripControls, tripIsLoading: false })} />
            <NameTripModal open={createTripControls.tripModalOpen} tripData={tripData} setCurrentTrip={setCurrentTrip} onClose={() => setCreateTripControls({ ...createTripControls, tripModalOpen: false })} />
            <div className="hero-section w-100 position-relative">

                <div className={`hero-content-box ${mobileMode && "mobile"}`}>


                    <h1 className={`hero-title ${mobileMode && "mobile"} darkpurple-text`}>Create the <span className="font-merriweather bold500 italic">perfect itinerary</span> <br />to fit your travel needs</h1>
                    <p className={`hero-text ${mobileMode ? "mobile" : "w-40"} bold600`}>Travel confidently with an itinerary optimized for convenience and catered to you</p>
                    {/* <button onClick={() => goToDashboard()} className="btn-primaryflex"><p className="my-1 mx-2 white-text">Start planning now</p></button> */}

                    <div className={`selection-box-landing ${mobileMode && "mobile"}`}>
                        {!mobileMode &&
                            <div className="box-title flx-2 flx-c just-ce"><p className='m-0 mb-2'>Plan your next adventure</p></div>
                        }
                        <div className={`box-items flx-3 ${mobileMode ? "flx-c" : "flx-r"} gap-4 mb-4 flx-wrap`}>
                            <div className="item-location flx-3 flx-c just-en">
                                <div className="item-destination">
                                    <div className="box-heading dark-text page-subsubheading">Where are you going?</div>
                                    {/* <input id='cityInput' onChange={createTripFunctions.updateCityInput} type='text' placeholder='City name e.g. Hawaii, Cancun, Rome' className='calendarInput italic-placeholder city-placeholder-text' autoComplete='off' required /> */}
                                    <WorldCitiesSearchBar
                                        onInputChange={(inputText) => createTripFunctions.updateCityInput(inputText)}
                                    />
                                </div>
                            </div>
                            <div className={`item-dates ${mobileMode && "mobile"}`}>
                                <div className="box-heading dark-text page-subsubheading">When will you be there?</div>
                                <div ref={calendarWrapRef} className="calendarWrap">
                                    <div onClick={() => toggleCalendarOpen()} className="calendarInput pointer">
                                        <div className="startDateInput flx-1">
                                            <span className={`material-symbols-outlined ${range[0].startDate ? "purple-text" : "lightgray-text"}`}>date_range</span>
                                            <p className={`m-0 date-placeholder-text ${range[0].startDate ? null : "lightgray-text"}`}>{range[0].startDate ? timeFunctions.datify(format(range[0].startDate, "MM/dd/yyyy")) : "Start Date"}</p>
                                        </div>
                                        <hr className='h-40' />
                                        <div className="endDateInput flx-1">
                                            <span className={`material-symbols-outlined ${range[0].endDate ? "purple-text" : "lightgray-text"}`}>date_range</span>
                                            <p className={`m-0 date-placeholder-text ${range[0].endDate ? null : "lightgray-text"}`}>{range[0].startDate ? timeFunctions.datify(format(range[0].endDate, "MM/dd/yyyy")) : "End Date"}</p>
                                        </div>

                                    </div>
                                    <div>
                                        {calendarOpen &&
                                            <DateRange
                                                onChange={item => { setRange([item.selection]); createTripFunctions.updateTripDates([item.selection]); }}
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
                                <button onClick={() => getCity()} className="btn-primaryflex2 position-bottom">Start Planning</button>
                            </div>
                        </div>
                    </div>

                </div>
                <HeroFade />
            </div>


            <div className="section planning">
                <Fade delay={300} triggerOnce>
                    <Slide direction='up' triggerOnce>
                        <div className="page-title-box wide">
                            <h1 className={`page-title py-4 darkpurple-text`}>Planning your day-to-day travel itinerary just got <span className="font-merriweather bold500 italic">a whole lot easier</span></h1>
                        </div>
                        <div className={`action-points ${mobileMode && "mobile"}`}>
                            {actionPoints.map((point, index) => {
                                let first = 0
                                let last = actionPoints.length - 1
                                return <div key={index} className="point-holder">
                                    <div className={`v-line-divider ${!mobileMode ? index === last ? "d-none" : null : "d-none"}`}></div>
                                    <div className={`point ${mobileMode && "mobile"}`}>
                                        <div className="imgDiv">
                                            <img src={point.imgUrl} alt="" className='point-img' />
                                        </div>
                                        <div className="description">
                                            <div className="title">{point.title}</div>
                                            <div className="text">{point.text}</div>
                                        </div>
                                    </div>
                                    {/* {index !== last && mobileMode &&
                                        <hr className='h-line-divider' />
                                    } */}
                                </div>
                            })}


                        </div>
                    </Slide>
                </Fade>
            </div>
            <LinearGradient
                topColor='#FFFCF9'
                bottomColor='transparent'
                height={64}
            />

            <div className="section pt-0">
                <Fade delay={300} triggerOnce>
                    <Slide direction='up' triggerOnce>
                        <div className="page-title-box">
                            <h1 className="page-title darkpurple">Maximize your travel experience with optimized routes</h1>
                            <p className="page-subtitle">RouteWise creates travel itineraries based on the proximity of your desired destinations, ensuring you make the most of your time while exploring</p>
                        </div>

                        <div className="section light-padding">
                            <NavigationTabs
                                tabs={tabs}
                                beamBackgroundColor={"transparent"}
                                gap={mobileMode ? 0 : 48}
                                paddingX={24}
                                setActiveTabIndex={setActiveTabIndex}
                                screenPaddingX={36}
                            />
                            <div className="tab-imgDiv">
                                {tabs.map((tab, index) => {
                                    return <img key={index} src={tab.imgUrl} alt={tab.tabName} className="gif" data-hiddendirection={index < activeTabIndex ? "left" : index > activeTabIndex ? "right" : false} />
                                })}
                            </div>
                        </div>
                    </Slide>
                </Fade>
            </div>

            <Fade delay={300} triggerOnce>
                <Slide direction='up' triggerOnce>
                    <div className="section">
                        <div className="page-title-box thin">
                            <h1 className="page-title darkpurple">Featured Itineraries</h1>
                            <p className="page-subtitle">Explore our featured itineraries for inspiration and a head start on planning your own unique trip</p>
                        </div>
                        {/* {!mobileMode ? */}
                        <div className="featuredTrips">
                            {featuredTrips.map((trip, index) => {
                                return <FeaturedTripCard key={index} trip={trip} />
                            })}
                        </div>

                        {/* <CarouselWiper items={items} width={300} height={478} /> */}

                    </div>
                </Slide>
            </Fade>


            <Fade delay={300} triggerOnce>
                <Slide direction='up' triggerOnce>
                    <div className="section">
                        <div className="page-title-box thin">
                            <h1 className="page-title darkpurple">Personalized recommendations</h1>
                            <p className="page-subtitle">Receive recommendations for your destination's top sites and places based on your travel preferences</p>
                            <button onClick={() => authFunctions.openSignUp()} className="btn-primaryflex mt-3">Get Started</button>
                        </div>

                        <img src="https://i.imgur.com/AOX42y3.gif" alt="" className='gif' />
                    </div>
                </Slide>
            </Fade>


            {/* <div className="how-it-works mt-8">
                <div className={`page-card2 ${mobileMode ? "flx-c" : "flx-r"}`}>
                    <div className="flx-1 left-side">
                        <img src="https://i.imgur.com/psCYP7X.jpg" alt="" className="left-side-img" />
                    </div>
                    <div className={`${mobileMode ? "flx-3" : "flx-1"} right-side flx-c`}>
                        <div className="content">

                            <p className={`large m-0 ${mobileMode ? "mb-3" : "mb-5"} font-jakarta bold600 purple-text`}>HOW IT WORKS</p>
                            {!mobileMode &&
                                <h2 className="page-title font-noto bold500 mt-2">Craft the Perfect Getaway</h2>
                            }
                            <div className={`page-card2-text ${mobileMode && "mobile"}`}>

                                <div className="item flx-r gap-2">
                                    <img src="https://i.imgur.com/DkwGOth.png" alt="" className="pin-bullet mr-3" />
                                    <p className={`landing-title ${mobileMode && "mobile"} flx align-c m-0`}>Add places you want to visit</p>
                                </div>
                                <div className="item flx-r gap-2">
                                    <img src="https://i.imgur.com/qGDtWpZ.png" alt="" className="pin-bullet mr-3" />
                                    <p className={`landing-title ${mobileMode && "mobile"} flx align-c m-0`}>Generate your proximity-based itinerary</p>
                                </div>
                                <div className="item flx-r gap-2">
                                    <img src="https://i.imgur.com/93zoDqE.png" alt="" className="pin-bullet mr-3" />
                                    <p className={`landing-title ${mobileMode && "mobile"} flx align-c m-0`}>Customize your itinerary and explore!</p>
                                </div>
                            </div>
                            <div className={`flx-r ${mobileMode ? "position-bottom" : "mt-5"}`}>
                                <button onClick={() => authFunctions.openSignUp()} className="btn-primaryflex2">Sign up</button>
                            </div>



                        </div>
                    </div>
                </div>




            </div> */}

            <div className="empty-4"></div>

            <div className="fuji-section">
                <div className="left-side">

                    <div className="content">
                        <p className="text">Say goodbye to stress and <span className="font-merriweather italic">hello to seamless travel planning!</span></p>
                        <div className="flx">
                            <button onClick={() => authFunctions.openSignUp()} className="btn-primaryflex">Start planning</button>
                        </div>
                    </div>
                </div>
                <div className="right-side">
                    <img src="https://i.imgur.com/FG5TIOC.png" alt="Add places screenshot" className='addplaces-screenshot' />
                </div>
                <img src="https://i.imgur.com/UVmM55w.jpg" alt="fuji" className='full-img' />
            </div>

            <div className="explore-section">
                <div className="page-title-box">
                    <div className="page-title black-text py-5">Explore with us on Instagram!</div>
                </div>
                <div className="ig-carousel-window">

                    {/* <div className="inner-no-flex"> */}
                    <div className="ig-cards">

                        {igPosts.map((img, index) => {
                            let first = index === 0 ? true : false
                            return <Link to={img.link} target='_blank'>
                                <div key={index} className={`ig-card ${!first ? "ml-4" : null} ${mobileMode && "mobile"} `}>
                                    <img src={img.imgUrl} alt="" className="fill-img" />
                                    <div className="caption">
                                        <div className="displayPicture">
                                            <img src={img.displayPicture} alt="" className="img" />
                                        </div>
                                        <div className="text">
                                            <p className="title truncated">{img.title}</p>
                                            <p className="desc truncated">{img.caption}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
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
