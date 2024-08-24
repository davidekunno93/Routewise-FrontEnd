import React, { useContext, useEffect, useRef, useState } from 'react'
import { HeroCarousel } from '../components/HeroCarousel'
import { HeroFade } from '../components/HeroFade'
import { Fade, Slide } from 'react-awesome-reveal'
import { DataContext } from '../Context/DataProvider'
import { Link, useNavigate } from 'react-router-dom'
import { DateRange } from 'react-date-range'
import format from 'date-fns/format';
import Scrollbars from 'react-custom-scrollbars-2'
import { NameTripModal } from './NameTripModal'
import { LoadingModal } from '../components/LoadingModal'
import axios from 'axios'
import { auth } from '../firebase'

export const Landing = () => {
    const { user, setUser } = useContext(DataContext);
    const { currentTrip, setCurrentTrip, clearCurrentTrip } = useContext(DataContext);
    const { signUpIsOpen, setSignUpIsOpen } = useContext(DataContext);
    const { showNavbar, setShowNavbar } = useContext(DataContext);
    const { authIndex, setAuthIndex } = useContext(DataContext);
    const { mobileMode, mobileModeNarrow } = useContext(DataContext);
    const { logOut } = useContext(DataContext);
    // navigate function
    const navigate = useNavigate()
    const goToDashboard = () => {
        if (!user) {
            openSignUp()
        } else {
            navigate('/dashboard')
        }
    }
    useEffect(() => {
        console.log(auth)
    }, [])
    // useEffect(() => {
    //     // console.log(auth.currentUser)
    //     if (auth.currentUser) {
    //         goToDashboard()
    //     }
    // }, [auth.currentUser])

    // useEffect(() => {
    //     console.log("user =", auth.currentUser)
    //     if (auth.currentUser) {
    //         setUser(auth.currentUser)
    //     }
    // }, [auth])
    useEffect(() => {
        setShowNavbar(false)
        return restoreNavbar;
    }, [])
    const restoreNavbar = () => {
        setShowNavbar(true)
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
        return document.removeEventListener('keydown', hideOnEscape, true)
    }, [])
    useEffect(() => {
        // setCalendar(format(new Date(), 'MM/dd/yyyy'))
        document.addEventListener('click', hideOnClickOutsideCalendar, true)
        return document.removeEventListener('click', hideOnClickOutsideCalendar, true)
    }, [])
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



    // name trip modal code
    const [tripData, setTripData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalWidth, setModalWidth] = useState(450);
    const [cityOptions, setCityOptions] = useState([]);
    const [tripModalOpen, setTripModalOpen] = useState(false)
    const changeCity = () => {
        setTripModalOpen(false)
        setSpecifyCityOpen(true)
    }
    const [city, setCity] = useState(null);
    const updateCity = (e) => {
        setCity(e.target.value)
    }

    const getCity = async () => {
        if (!city) {
            // if there is no city entered --> please enter city name
            let cityInput = document.getElementById('cityInput')
            cityInput.classList.add('entry-error')
            console.log("no city")
            alert("Please enter a travel destination")
        } else if (!range[0].startDate || !range[0].endDate) {
            alert("Please enter a start and end date for your trip")
        } else {
            const apiKey = 'ka/g7nybqosAgLyFNCod1A==WBv07XT0PI2TrXTO'
            // if there is a city entered
            setLoading(true)
            const index = city.indexOf(',')
            // if the user input includes a "," -- it contains city and state/country
            if (index > -1) {
                let cityNoSpaces = city.replace(/ /g, '')
                const cityArr = cityNoSpaces.split(',')
                // console.log(cityArr)
                const response = await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${cityArr[0]}&country=${cityArr[1]}`, {
                    headers: { 'X-Api-Key': apiKey }
                }).then((response => openNewTrip(response)))
                    .catch((error) => {
                        console.log(error)
                        setLoading(false)
                    })
                // go to TripName Modal automatically
            } else {
                // if user enters just a city name with no ","
                const response = await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${city}`, {
                    headers: { 'X-Api-Key': apiKey }
                }).then((response => openNewTrip(response)))
                    .catch((error) => {
                        console.log(error)
                        setLoading(false)
                        alert("City was not found")
                    })
            }
        }

    }

    const getCountryName = (country_2letter) => {
        const country_abbr = ['AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BH', 'BS', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW']
        const country_name = ['Afghanistan', 'Åland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahrain', 'Bahamas', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia, Plurinational State of', 'Bonaire, Sint Eustatius and Saba', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo', 'Democratic Republic of Congo', 'Cook Islands', 'Costa Rica', "Côte d'Ivoire", 'Croatia', 'Cuba', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands (Malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard Island and McDonald Islands', 'Holy See (Vatican City State)', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'North Korea', 'South Korea', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine, State of', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Barthélemy', 'Saint Helena, Ascension and Tristan da Cunha', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saint Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten ', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia and the South Sandwich Islands', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'United States Minor Outlying Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela, Bolivarian Republic of', 'Viet Nam', '(British) Virgin Islands ', '(U.S.) Virgin Islands', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe']
        return country_abbr.includes(country_2letter) ? country_name[country_abbr.indexOf(country_2letter)] : null
    }

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
        setCityOptions(dataNew)

        setTripData(tripDataObj)
        setLoading(false)
        setTripModalOpen(true)

        // take first response.data index and use name/state/country/lat/lon 
        // coerse to tripData and open Name Trip modal, using tripData as props
    }

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
    const igImages = [
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
    ]

    return (
        <>
            <LoadingModal open={loading} width={modalWidth} height={500} onClose={() => setLoading(false)} />
            <NameTripModal open={tripModalOpen} tripData={tripData} setCurrentTrip={setCurrentTrip} onClose={() => setTripModalOpen(false)} />
            <div className="hero-section w-100 position-relative">
                <div className="hero-navbar">
                    <img src="https://i.imgur.com/VvcOzlX.png" alt="Routewise" className={`routewise-logo ${!mobileMode && "ml5"}`} />

                    {!auth.currentUser ?
                        <div className="flx-r align-c gap-6 mr5">
                            <button onClick={() => openSignUp()} className="btn-primaryflex">Sign Up</button>
                            {!mobileMode &&
                                <p onClick={() => openSignIn()} className="m-0 pointer onHover-fade">Log in</p>
                            }
                        </div>
                        :
                        <div className="flx-r align-c gap-6 mr5">
                            <button onClick={() => goToDashboard()} className="btn-primaryflex">Go to dashboard</button>
                            {!mobileModeNarrow &&
                                <p onClick={() => logOut()} className="m-0 pointer onHover-fade">Log out</p>
                            }
                        </div>
                    }
                </div>

                <div className={`hero-content-box ${mobileMode && "mobile"}`}>


                    <h1 className={`hero-title ${mobileMode && "mobile"} bold500 m-0`}>Your Next Great <br />Adventure Starts Here</h1>
                    {!mobileMode &&
                        <p className={`hero-text ${mobileMode ? "mobile" : "w-40"} bold600`}>Effortlessly craft the perfect trip with a more optimized travel itinerary</p>
                    }
                    {/* <button onClick={() => goToDashboard()} className="btn-primaryflex"><p className="my-1 mx-2 white-text">Start planning now</p></button> */}

                    <div className={`selection-box-landing ${mobileMode && "mobile"}`}>
                        {!mobileMode &&
                            <div className="box-title flx-2 flx-c just-ce"><p className='m-0 mb-2'>Start planning your next adventure</p></div>
                        }
                        <div className={`box-items flx-3 ${mobileMode ? "flx-c" : "flx-r"} gap-4 mb-4 flx-wrap`}>
                            <div className="item-location flx-3 flx-c just-en">
                                <div className="item-destination">
                                    <div className="box-heading dark-text page-subsubheading">Where are you headed?</div>
                                    <input id='cityInput' onChange={(e) => updateCity(e)} type='text' placeholder='City name e.g. Hawaii, Cancun, Rome' className='calendarInput italic-placeholder city-placeholder-text' autoComplete='off' required />
                                </div>
                            </div>
                            <div className={`item-dates ${mobileMode && "mobile"}`}>
                                <div className="box-heading dark-text page-subsubheading">When will you be there?</div>
                                <div ref={refOne} className="calendarWrap">
                                    <div onClick={() => toggleCalendarOpen()} className="calendarInput pointer">
                                        <div className="startDateInput flx-1">
                                            <span className={`material-symbols-outlined ${range[0].startDate ? "purple-text" : "lightgray-text"}`}>date_range</span>
                                            <p className={`m-0 date-placeholder-text ${range[0].startDate ? null : "lightgray-text"}`}>{range[0].startDate ? datify(format(range[0].startDate, "MM/dd/yyyy")) : "Start Date"}</p>
                                        </div>
                                        <hr className='h-40' />
                                        <div className="endDateInput flx-1">
                                            <span className={`material-symbols-outlined ${range[0].endDate ? "purple-text" : "lightgray-text"}`}>date_range</span>
                                            <p className={`m-0 date-placeholder-text ${range[0].endDate ? null : "lightgray-text"}`}>{range[0].startDate ? datify(format(range[0].endDate, "MM/dd/yyyy")) : "End Date"}</p>
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
                                {/* <Link to='/dashboard' className='position-bottom'> */}
                                <button onClick={() => getCity()} className="btn-primaryflex2 position-bottom">Start Planning</button>
                                {/* </Link> */}
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
                        <h1 className={`page-title ${mobileMode ? "w-90" : "w-65"} center-text mt-9 m-auto font-noto bold600`}>Planning your day-to-day travel itinerary just got a whole lot easier</h1>
                        <div className={`action-points  ${mobileMode && "mobile"}`}>
                            {actionPoints.map((point, index) => {
                                let first = 0
                                let last = actionPoints.length - 1
                                return <div key={index} className="point-holder">
                                    <div className={`v-line-divider ${!mobileMode ? index === last ? "d-none" : null : "d-none"}`}></div>
                                    <div className={`point ${mobileMode && "mobile"}`}>
                                        <img src={point.imgUrl} alt="" className='point-img' />
                                        <div className="title">{point.title}</div>
                                        <div className="text">{point.text}</div>
                                    </div>
                                    {index !== last && mobileMode &&
                                        <hr className='h-line-divider' />
                                    }
                                </div>
                            })}


                        </div>


                        {/* <div className="empty-3"></div> */}
                    </Slide>
                </Fade>
            </div>



            <div className="how-it-works mt-8">


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
                                <button onClick={() => openSignUp()} className="btn-primaryflex2">Sign up</button>
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
                <div className="page-title w-90 font-noto center-text m-auto my-5">Explore with us on Instagram!</div>
                <div className="ig-carousel-window">

                    {/* <div className="inner-no-flex"> */}
                    <div className="ig-cards">

                        {igImages.map((img, index) => {
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
