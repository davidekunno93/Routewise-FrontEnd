import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { NameTripModal } from './NameTripModal';
import { OpenMap } from '../components/OpenMap';
import axios from 'axios';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import format from 'date-fns/format';
import { addDays, isWithinInterval } from 'date-fns'
import { SpecifyCity } from './SpecifyCity';
import { Loading } from '../components/Loading';
import { LoadingModal } from '../components/LoadingModal';
import { auth } from '../firebase';
import { DataContext } from '../Context/DataProvider';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../components/LoadingScreen';
import EditTripModal from '../components/EditTripModal';



export const Dashboard = ({ currentTrip, setCurrentTrip, clearCurrentTrip }) => {
    // login require
    const { user, setUser } = useContext(DataContext);
    const { signUpIsOpen, setSignUpIsOpen } = useContext(DataContext);
    const [openTripModal, setOpenTripModal] = useState(false)
    const [loading, setLoading] = useState(false);
    const [translationIndex, setTranslationIndex] = useState(0);
    const [fullTranslated, setFullTranslated] = useState(false);
    const [mapCenter, setMapCenter] = useState([51.50735, -0.12776]);
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [city, setCity] = useState(null);
    const [tripData, setTripData] = useState(null);
    const [specifyCityOpen, setSpecifyCityOpen] = useState(false)
    const [cityOptions, setCityOptions] = useState([
        {
            name: "Rome",
            state: "",
            country: "Italy"
        },
        {
            name: "Barcelona",
            state: "",
            country: "Spain"
        },
        {
            name: "Houston",
            state: "Texas",
            country: "US"
        }
    ]);
    const [userTrips, setUserTrips] = useState(null)

    // get user trips code
    const getUserTripsData = async () => {
        const response = await axios.get(`https://routewise-backend.onrender.com/places/trips/${auth.currentUser.uid}`)
        return response.status === 200 ? response.data : "error - it didn't work"
    }

    const loadUserTripsData = async () => {
        let data = await getUserTripsData()
        setUserTrips(data)
        console.log(data)
    }

    useEffect(() => {
        if (auth.currentUser) {
            loadUserTripsData()
            // console.log(auth.currentUser.uid)
        }
        console.log(userTrips)
    }, [])
    useEffect(() => {
        loadUserTripsData()
    }, [user])

    const apiKey = 'ka/g7nybqosAgLyFNCod1A==WBv07XT0PI2TrXTO'
    const updateMapCenter = async () => {
        let response = await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=London&country=England`, {
            headers: { 'X-Api-Key': apiKey }
        }).then(response => {
            console.log(response.data[0])
            let city = response.data[0]
            console.log(city.name, city.state)
            console.log(city.latitude, city.longitude)
            let cityGeo = [city.latitude, city.longitude]
            setMapCenter(cityGeo)
        })
    }
    const changeCC = () => {
        setMapCenter([23.5, 28.3])

    }

    // carousel
    const cities = [
        {
            name: 'Paris',
            imgUrl: 'https://i.imgur.com/JnLJKbEl.jpg'
        },
        {
            name: 'Rome',
            imgUrl: 'https://i.imgur.com/HJJEIntl.jpg'
        },
        {
            name: 'London',
            imgUrl: 'https://i.imgur.com/sCT1BpFl.jpg'
        },
        {
            name: 'New York City',
            imgUrl: 'https://i.imgur.com/RxO0dfyl.jpg'
        },
        {
            name: 'Tokyo',
            imgUrl: 'https://i.imgur.com/JMgMvzPl.png'
        },
        {
            name: 'Miami',
            imgUrl: 'https://i.imgur.com/F6fkD7Ol.jpg'
        },
        {
            name: 'Dubai',
            imgUrl: 'https://i.imgur.com/OWmQg9Ll.jpgg'
        }
    ]
    const slideCarouselRight = () => {
        let carousel = document.getElementById('cityCarouselInner')
        let translatedWidth = window.innerWidth * 0.9 + translationIndex * 350
        let carouselWidth = cities.length * 350 - 50
        let fullTranslateWidth = carouselWidth - window.innerWidth * 0.9
        let test = cities.length * 350 - 50 - 350
        if (translatedWidth > cities.length * 350 - 50 - 350) {
            console.log(translatedWidth, test, carouselWidth, fullTranslateWidth)
            carousel.style.transform = `translateX(-${fullTranslateWidth}px)`
            setFullTranslated(true)
        } else {
            setTranslationIndex(translationIndex + 1)
        }
    }
    const slideCarouselLeft = () => {
        if (translationIndex > 0) {
            setTranslationIndex(translationIndex - 1)
            setFullTranslated(false);
        }
    }


    const openNameTripModal = () => {
        // let tripInfo = {
        //     cityName: city,
        //     state: state,
        //     country: country,
        //     geocode: geocode,
        //     startDate: range[0].startDate,
        //     endDate: range[0].endDate,
        // }
        // setTripData(tripInfo)
        setOpenTripModal(true)
    }
    const closeNameTripModal = () => {
        setOpenTripModal(false)
    }

    // calendar
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
    const toggleCalendarOpen = () => {
        if (calendarOpen) {
            setCalendarOpen(false);
        } else {
            setCalendarOpen(true);
        }
    }
    useEffect(() => {
        // setCalendar(format(new Date(), 'MM/dd/yyyy'))
        document.addEventListener('keydown', hideOnEscape, true)
        document.addEventListener('click', hideOnClickOutside, true)
        document.addEventListener('click', hidePopUpOnClickOutside, true)
    })
    const hideOnEscape = (e) => {
        if (e.key === "Escape") {
            setCalendarOpen(false)
            closeUserTripPopup()
        }
    }
    const hideOnClickOutside = (e) => {
        if (refOne.current && !refOne.current.contains(e.target)) {
            setCalendarOpen(false)
            // closeUserTripPopup()
        }
    }
    const refOne = useRef(null);
    const hidePopUpOnClickOutside = (e) => {
        if (refPopUp.current && !refPopUp.current.contains(e.target)) {
            closeUserTripPopup()
        }
    }
    const refPopUp = useRef(null);


    const openSignUp = () => {
        setSignUpIsOpen(true);
    }

    const getCity = async () => {
        if (!user) {
            openSignUp()
        } else {
            if (!city) {
                // if there is no city entered --> please enter city name
                let cityInput = document.getElementById('cityInput')
                cityInput.classList.add('entry-error')
                console.log("no city")
            } else {
                // if there is a city entered
                startLoading()
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
                            stopLoading()
                        })
                    // go to TripName Modal automatically
                } else {
                    // if user enters just a city name with no ","
                    const response = await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${city}`, {
                        headers: { 'X-Api-Key': apiKey }
                    }).then((response => openNewTrip(response)))
                        .catch((error) => {
                            console.log(error)
                            stopLoading()
                            alert("City was not found")
                        })
                }
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
        let tripInfo = {
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
        if (typeof tripInfo.state === 'undefined') {
            tripInfo.state = ""
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

        setTripData(tripInfo)
        stopLoading()
        openNameTripModal()

        // take first response.data index and use name/state/country/lat/lon 
        // coerse to tripData and open Name Trip modal, using tripData as props
    }

    const changeCity = () => {
        setOpenTripModal(false)
        setSpecifyCityOpen(true)
    }




    const updateCity = (e) => {
        setCity(e.target.value)
    }
    const closeSpecifyCity = () => {
        setSpecifyCityOpen(false);
    }

    useEffect(() => {
        // console.log(city)
        if (city) {
            if (city.length > 0) {
                let cityInput = document.getElementById('cityInput')
                cityInput.classList.remove('entry-error')
            }
        }
    }, [city])

    const startLoading = () => {
        setLoading(true);
    }
    const stopLoading = () => {
        setLoading(false);
    }

    const [modalWidth, setModalWidth] = useState(450);



    useEffect(() => {
        window.addEventListener("resize", resizeModal, false)
    }, [])

    const resizeModal = () => {
        if (window.innerWidth < 425) {
            setModalWidth(240)
        } else if (window.innerWidth > 425 && window.innerWidth < 600) {
            setModalWidth(300)
        } else if (window.innerWidth >= 600) {
            setModalWidth(450)
        }
        if (window.innerWidth < 600) {

        }
    }

    const datishort = (date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const monthNum = date.slice(5, 7)
        const month = months[monthNum - 1]
        let day = date.slice(8)
        if (day[0] === "0") {
            day = day[1]
        }
        return month + " " + day
    }
    const datishortRange = (startDate, endDate) => {
        // const startYear = startDate.slice(0, 5)
        // const endYear = endDate.slice(0, 4)
        const start = datishort(startDate)
        const end = datishort(endDate)
        const startMonth = start.slice(0, 3)
        const endMonth = end.slice(0, 3)
        // console.log(startDate)
        // console.log(start)
        // console.log(endDate)

        if (startMonth === endMonth) {
            return start + " - " + end.slice(4)
        } else {
            return start + " - " + end
        }

    }
    const toggleUserTripPopup = (index) => {
        let popUp = document.getElementById(`userTrip-popUp-${index}`)
        popUp.classList.toggle('d-none')
    }

    const closeUserTripPopup = () => {
        let popUps = document.getElementsByClassName('popUp')
        for (let i = 0; i < popUps.length; i++) {
            popUps[i].classList.add('d-none')
        }
    }

    const navigate = useNavigate()

    const viewTrip = async (trip) => {
        // setIsLoading(true)
        let url = `http://127.0.0.1:5000/places/trip/${trip.trip_id}`
        const response = axios.get(url)
            .then((response) => {
                createItinerary(response, trip)
            })
            .catch((error) => {
                console.log(error)
                setIsLoading(false)
                alert('Something went wrong. Please try again')
            })
    }
    const createItinerary = (response, trip) => {
        let currentTripCopy = {
            tripID: trip.trip_id,
            tripName: trip.trip_name,
            city: trip.dest_city,
            country: trip.dest_country,
            country_2letter: trip.dest_country_2letter,
            startDate: trip.start_date,
            endDate: trip.end_date,
            tripDuration: trip.duration,
            geocode: [trip.dest_lat, trip.dest_long],
            imgUrl: trip.dest_img,
            places: Object.values(response.data.places_serial),
            itinerary: response.data,
        }
        // currentTripCopy["itinerary"] = response.data
        // currentTripCopy["places"] = Object.values(response.data.places_serial)
        console.log(response.data)
        console.log(currentTripCopy)
        setCurrentTrip(currentTripCopy)
        navigate('/itinerary')
    }
    const [isLoading, setIsLoading] = useState(false);
    const stopLoadingScreen = () => {
        setIsLoading(false)
    }

    const deleteTrip = (trip) => {
        let url = `http://127.0.0.1:5000/places/delete-trip/${trip.trip_id}`
        const response = axios.delete(url)
        .then((response) => {
            console.log(response.data)
            loadUserTripsData()
            closeUserTripPopup()
        })
        .catch((error) => {
            console.log(error)
        })
    }

    // test updating trip
    const testUpdateTrip = async (trip_id) => {
        let url = `http://localhost:5000/places/update_trip/${trip_id}`
        let data = {
            tripName : "New Trip Name",
            startDate: null,
            endDate: null
        }
        const response = await axios.patch(url, data, {
            headers: {"Content-Type": "application/json"}
        }).then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }


    // edit trip modal code
    const [editTripModalOpen, setEditTripModalOpen] = useState(false)
    const openEditTripModal = (trip) => {
        setTripToEdit(trip)
        setEditTripModalOpen(true);
    }
    const [tripToEdit, setTripToEdit] = useState(null)


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

    return (
        <>
            {/* <div className=''>
                <DatePicker selected={departDate} onChange={(departDate) => setDepartDate(departDate)} />
            </div>
             */}
            <LoadingModal open={loading} width={modalWidth} height={500} onClose={() => stopLoading()} />
            <LoadingScreen open={isLoading} loadObject={"itinerary"} loadingMessage={"Please wait while your itinerary is loading..."} waitTime={10000} currentTrip={currentTrip} onClose={stopLoadingScreen} />
            <EditTripModal open={editTripModalOpen} trip={tripToEdit} onClose={() => setEditTripModalOpen(false)} />
            <SpecifyCity open={specifyCityOpen} cities={cityOptions} tripData={tripData} setTripData={setTripData} getCountryName={getCountryName} openNameTripModal={openNameTripModal} onClose={() => closeSpecifyCity()} />
            <NameTripModal open={openTripModal} tripData={tripData} changeCity={() => changeCity()} currentTrip={currentTrip} setCurrentTrip={setCurrentTrip} clearCurrentTrip={clearCurrentTrip} onClose={() => closeNameTripModal()} />
            <div className="page-container90 mt-4">
                <h1 className="page-title inline-block">Hi {auth.currentUser ? auth.currentUser.displayName : "Josh"} </h1><img src="https://i.imgur.com/4i6xYjB.png" alt="" className="small-pic ml-2" />
                <div className="selection-box flx-c">
                    <div className="box-title flx-2 flx-c just-ce"><p className='my-3'>Start planning your next adventure</p></div>
                    <div className="box-items flx-3 flx-r mb-4 flx-wrap">
                        <div className="item-location flx-3 flx-c just-en">
                            <div className="mr-2-disappear768">
                                <div className="box-heading dark-text page-subsubheading">Where are you headed?</div>
                                <input onChange={(e) => updateCity(e)} id='cityInput' type='text' placeholder='City name e.g. Hawaii, Cancun, Rome' className='calendarInput italic-placeholder' required />
                            </div>
                        </div>
                        <div className="item-dates flx- flx-c just-en">
                            <div className="box-heading dark-text page-subsubheading">When will you be there?</div>
                            <div ref={refOne} className="calendarWrap mr-2-disappear768">
                                {/* <span onClick={() => setCalendarOpen(true)} className="material-symbols-outlined position-absolute inputIcon-right xx-large o-50 pointer">
                                    date_range
                                </span> */}
                                {/* <input
                                    onClick={() => setCalendarOpen(calendarOpen => !calendarOpen)}
                                    // value={`${range[0].startDate && range[0].endDate ? format(range[0].startDate, "MM/dd/yyyy")+"      |      "+format(range[0].endDate, "MM/dd/yyyy") : "Start Date   End Date" } `} 
                                    value={` ${format(range[0].startDate, "MM/dd/yyyy")}            -to-           ${format(range[0].endDate, "MM/dd/yyyy")} `}
                                    className="calendarInput pointer"
                                    readOnly
                                /> */}
                                <div onClick={() => toggleCalendarOpen()} className="calendarInput pointer">
                                    <div className="startDateInput flx-1">
                                        <span className={`material-symbols-outlined ${range[0].startDate ? "purple-text" : "lightgray-text"}`}>date_range</span>
                                        <p className={`m-0 ${range[0].startDate ? null : "lightgray-text"}`}>{range[0].startDate ? datify(format(range[0].startDate, "MM/dd/yyyy")) : "Start Date" }</p>
                                    </div>
                                    <hr className='h-40' />
                                    <div className="endDateInput flx-1">
                                        <span className={`material-symbols-outlined ${range[0].endDate ? "purple-text" : "lightgray-text"}`}>date_range</span>
                                        <p className={`m-0 ${range[0].endDate ? null : "lightgray-text"}`}>{range[0].startDate ? datify(format(range[0].endDate, "MM/dd/yyyy")) : "End Date" }</p>
                                    </div>
                                </div>
                                <div>
                                    {calendarOpen &&
                                        <DateRange
                                            onChange={item => setRange([item.selection])}
                                            editableDateInputs={true}
                                            moveRangeOnFirstSelection={false}
                                            ranges={range[0].startDate ? range : rangePlaceholder}
                                            months={2}
                                            direction='vertical'
                                            className='calendarElement'
                                        />
                                    }
                                </div>
                            </div>
                            {/* <input type='text' placeholder='Start Date | End Date' className='input-normal2' /> */}
                        </div>
                        <div className="item-addtrip flxstyle-respond">
                            <button onClick={() => getCity()} className="btn-primaryflex2 mt-3">Add Trip</button>
                        </div>
                    </div>
                </div>

                {userTrips ?
                    <>
                        <div className="flx-r align-r just-sb mt-5">
                            <p className="m-0 page-heading-bold">My Trips</p>
                            {userTrips.length > 4 ?
                                <Link>
                                    <div className="flx-r align-c">
                                        <p className="m-0 purple-text page-text">See all trips</p>
                                        <span className="material-symbols-outlined ml-1 purple-text">
                                            arrow_forward
                                        </span>
                                    </div>
                                </Link>
                                : null }
                        </div>
                        {!userTrips.length > 0 &&
                            <>
                                <p className="m-0 gray-text">No trips created. <span onClick={() => getCity()} className="purple-text bold500 pointer">Enter a city</span>  to start!</p>
                                {/* <p className="m-0 gray-text small">Come back after you've created a trip to view created itineraries</p> */}
                            </>
                        }

                        <div className="userTrips flx-r gap-8">
                            {userTrips.map((trip, index) => {

                                if (index < 4) {


                                    return <div key={index} className="userTrip-box">
                                        <div ref={refPopUp} id={`userTrip-popUp-${index}`} className="popUp d-none">
                                            <div onClick={(() => {openEditTripModal(trip); closeUserTripPopup()})} className="option">
                                                <p className="m-0">Edit trip</p>
                                                <span className="material-symbols-outlined large mx-1">
                                                    edit
                                                </span>
                                            </div>
                                            <div onClick={(() => viewTrip(trip))} className="option">
                                                <p className="m-0">View trip</p>
                                                <span className="material-symbols-outlined large mx-1">
                                                    map
                                                </span>
                                            </div>
                                            <div onClick={() => deleteTrip(trip)} className="option">
                                                <p className="m-0">Delete trip</p>
                                                <span className="material-symbols-outlined large mx-1">
                                                    delete
                                                </span>
                                            </div>
                                        </div>
                                        <span ref={refPopUp} onClick={() => toggleUserTripPopup(index)} className="material-symbols-outlined vertIcon">
                                            more_vert
                                        </span>
                                        <img src={trip.dest_img} alt="" className="destImg pointer" />
                                        <p className="m-0 box-title">{trip.trip_name}</p>
                                        <div className="flx-r">
                                            <p className="m-0 gray-text">{datishortRange(trip.start_date, trip.end_date)}</p>
                                            <p className="m-0 gray-text">&nbsp; &#9679; &nbsp;</p>
                                            <p className="m-0 gray-text">{trip.duration} {trip.duration > 1 ? "days" : "day"}</p>
                                        </div>
                                    </div>
                                }
                            })}
                        </div>
                    </>
                    : null }

                {/* map code */}
                <div className="map my-5 flx">
                    <OpenMap mapCenter={mapCenter} zoom={2} />

                </div>

                <div className="popular-destinations">
                    <div className="page-heading-bold my-3">Popular destinations</div>

                    <div className="carousel2-window">
                        <div id='cityCarouselInner' className="inner-no-flex" style={{ transform: `translateX(-${translationIndex * 350}px)` }}>
                            {cities.map((city, index) => {
                                return <div key={index} className="card3 position-relative">
                                    <img src={city.imgUrl} alt="" className="card3-img" />
                                    <div className="model-overlay position-absolute white-text">
                                        <span className="material-symbols-outlined v-bott white-text">
                                            favorite
                                        </span>
                                        <p className="m-0 inline white-text"> 86 Likes</p>
                                    </div>
                                    <div className="page-subheading-bold my-2 black-text">{city.name}</div>
                                </div>
                            })}

                        </div>
                    </div>
                    <div className="btns mb-2">
                        <button onClick={() => slideCarouselLeft()} className={translationIndex === 0 ? 'btn-primaryflex-disabled' : 'btn-carousel-special hover-left'}>
                            <span className="material-symbols-outlined mt-1 white-text">
                                arrow_back
                            </span>
                        </button>
                        <button onClick={() => slideCarouselRight()} className={fullTranslated === true ? "btn-primaryflex-disabled right" : "btn-carousel-special right hover-right"}>
                            <span className="material-symbols-outlined mt-1 white-text">
                                arrow_forward
                            </span>
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}
