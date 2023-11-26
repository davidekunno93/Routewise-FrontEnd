import React, { useEffect, useReducer, useRef, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { NameTripModal } from './NameTripModal';
import { OpenMap } from '../components/OpenMap';
import axios from 'axios';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import format from 'date-fns/format';
import { addDays } from 'date-fns'
import { SpecifyCity } from './SpecifyCity';
import { Loading } from '../components/Loading';
import { LoadingModal } from '../components/LoadingModal';
import auth from '../firebase';



export const Dashboard = ({ currentTrip, setCurrentTrip }) => {
    // login require
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
            imgUrl: 'https://i.imgur.com/JnLJKbE.jpg'
        },
        {
            name: 'Rome',
            imgUrl: 'https://i.imgur.com/HJJEInt.jpg'
        },
        {
            name: 'London',
            imgUrl: 'https://i.imgur.com/sCT1BpF.jpg'
        },
        {
            name: 'New York City',
            imgUrl: 'https://i.imgur.com/RxO0dfy.jpg'
        },
        {
            name: 'Tokyo',
            imgUrl: 'https://i.imgur.com/JMgMvzP.png'
        },
        {
            name: 'Miami',
            imgUrl: 'https://i.imgur.com/F6fkD7O.jpg'
        },
        {
            name: 'Dubai',
            imgUrl: 'https://i.imgur.com/OWmQg9L.jpgg'
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
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }
    ])
    useEffect(() => {
        // setCalendar(format(new Date(), 'MM/dd/yyyy'))
        document.addEventListener('keydown', hideOnEscape, true)
        document.addEventListener('click', hideOnClickOutside, true)
    })
    const hideOnEscape = (e) => {
        if (e.key === "Escape") {
            setCalendarOpen(false)
        }
    }
    const hideOnClickOutside = (e) => {
        if (refOne.current && !refOne.current.contains(e.target)) {
            setCalendarOpen(false)
        }
    }
    const refOne = useRef(null);




    const getCity = async () => {
        if (!city) {
            // if there is no city entered --> please enter city name
            let cityInput = document.getElementById('cityInput')
            cityInput.classList.add('entry-error')
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


    const handleCityResponse = (response) => {
        let data = response.data
        console.log(data)

        if (data.length > 1) {
            // go to Select which City you want
            let dataNew = []
            let states = []
            for (let i = 0; i < data.length; i++) {
                if (!states.includes(data[i].state)) {
                    dataNew.push(data[i])
                }
                states.push(data[i].state)
            }
            setCityOptions(dataNew)
            setSpecifyCityOpen(true)
        } else {
            // go to trip name modal

        }
        if (typeof data === 'undefined') {
            console.log('new plan')
        }
    }



    const handleCityStateResponse = (response) => {
        let data = response.data[0]
        console.log(data)
        // setCity(data.name)
        // setState(data.state)
        // setGeocode([data.latitude, data.longitude])
        if (typeof data === 'undefined') {
            console.log('new plan')
        }
    }

    const updateCity = (e) => {
        setCity(e.target.value)
    }
    const closeSpecifyCity = () => {
        setSpecifyCityOpen(false);
    }

    useEffect(() => {
        console.log(city)
    }, [city])

    const startLoading = () => {
        setLoading(true);
    }
    const stopLoading = () => {
        setLoading(false);
    }

    return (
        <>
            {/* <div className=''>
                <DatePicker selected={departDate} onChange={(departDate) => setDepartDate(departDate)} />
            </div>
             */}
            <LoadingModal open={loading} width={450} height={500} onClose={() => stopLoading()} />

            <SpecifyCity open={specifyCityOpen} cities={cityOptions} tripData={tripData} openNameTripModal={openNameTripModal} setTripData={setTripData} onClose={() => closeSpecifyCity()} />
            <NameTripModal open={openTripModal} tripData={tripData} changeCity={() => changeCity()} currentTrip={currentTrip} setCurrentTrip={setCurrentTrip} onClose={() => closeNameTripModal()} />
            <div className="page-container90 mt-4">
                <h1 className="page-title inline-block">Hi {auth.currentUser ? auth.currentUser.displayName : "Josh"} </h1><img src="https://i.imgur.com/4i6xYjB.png" alt="" className="med-pic ml-2" />
                <div className="selection-box flx-c">
                    <div className="box-title flx-2 flx-c just-ce"><p className='m-0'>Start planning your next adventure</p></div>
                    <div className="box-items flx-3 flx-r mb-4">
                        <div className="item-location flx-3 flx-c just-en">
                            <div className="mr-2">
                                <div className="box-heading dark-text">Where are you headed?</div>
                                <input onChange={(e) => updateCity(e)} id='cityInput' type='text' placeholder='e.g. Hawaii, Cancun, Rome' className='calendarInput italic-placeholder' />
                            </div>
                        </div>
                        <div className="item-dates flx-2 flx-c just-en">
                            <div className="box-heading dark-text">When will you be there?</div>
                            <div className="calendarWrap mr-2">
                                <span onClick={() => setCalendarOpen(true)} className="material-symbols-outlined position-absolute inputIcon-right xx-large o-50 pointer">
                                    date_range
                                </span>
                                <input
                                    onClick={() => setCalendarOpen(calendarOpen => !calendarOpen)}
                                    // value={`${range[0].startDate && range[0].endDate ? format(range[0].startDate, "MM/dd/yyyy")+"      |      "+format(range[0].endDate, "MM/dd/yyyy") : "Start Date   End Date" } `} 
                                    value={`${format(range[0].startDate, "MM/dd/yyyy")}     to     ${format(range[0].endDate, "MM/dd/yyyy")} `}
                                    className="calendarInput pointer"
                                    readOnly
                                />
                                <div ref={refOne}>
                                    {calendarOpen &&
                                        <DateRange
                                            onChange={item => setRange([item.selection])}
                                            editableDateInputs={true}
                                            moveRangeOnFirstSelection={false}
                                            ranges={range}
                                            months={2}
                                            direction='vertical'
                                            className='calendarElement'
                                            placeholder="hi" />
                                    }
                                </div>
                            </div>
                            {/* <input type='text' placeholder='Start Date | End Date' className='input-normal2' /> */}
                        </div>
                        <div className="item-addtrip flx-c just-en">
                            <button onClick={() => getCity()} className="btn-primaryflex2">Add Trip</button>
                        </div>
                    </div>
                </div>

                <div className="map my-5 flx">
                    <OpenMap mapCenter={mapCenter} zoom={2} />

                </div>

                <div className="popular-destinations">
                    <div className="page-heading my-3">Popular destinations</div>

                    <div className="carousel2-window">
                        <div id='cityCarouselInner' className="inner-no-flex" style={{ transform: `translateX(-${translationIndex * 350}px)` }}>
                            {cities.map((city, index) => {
                                return <div key={index} className="card3 position-relative">
                                    <img src={city.imgUrl} alt="" className="card3-img" />
                                    <div className="model-overlay position-absolute white-text">
                                        <span className="material-symbols-outlined v-bott">
                                            favorite
                                        </span>
                                        <p className="m-0 inline"> 86 Likes</p>
                                    </div>
                                    <div className="card3-title my-2">{city.name}</div>
                                </div>
                            })}

                        </div>
                    </div>
                    <div className="btns mb-2">
                        <button onClick={() => slideCarouselLeft()} className={translationIndex === 0 ? 'btn-primaryflex-disabled' : 'btn-primaryflex hover-left'}>
                            <span className="material-symbols-outlined mt-1">
                                arrow_back
                            </span>
                        </button>
                        <button onClick={() => slideCarouselRight()} className={fullTranslated === true ? "btn-primaryflex-disabled right" : "btn-primaryflex right hover-right"}>
                            <span className="material-symbols-outlined mt-1">
                                arrow_forward
                            </span>
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}
