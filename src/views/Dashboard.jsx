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



export const Dashboard = () => {
    // login require
    const [openTripModal, setOpenTripModal] = useState(false)
    const [loading, setLoading] = useState(false);
    const [translationIndex, setTranslationIndex] = useState(0);
    const [fullTranslated, setFullTranslated] = useState(false);
    const [mapCenter, setMapCenter] = useState(null);
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


    const openNewTrip = (response) => {
        // if no response catch error***
        let data = response.data
        let geocode = [data[0].latitude, data[0].longitude]
        let tripInfo = {
            cityName: data[0].name,
            state: data[0].state,
            country: data[0].country,
            destinationLat: geocode[0],
            destinationLong: geocode[1],
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
            <NameTripModal open={openTripModal} tripData={tripData} changeCity={() => changeCity()} onClose={() => closeNameTripModal()} />
            <div className="page-container90 mt-4">
                <h1 onClick={() => changeCC()} className="page-title">Hi Josh, (emoji)</h1>
                <div className="selection-box flx-c">
                    <div className="box-title flx-2 flx-c just-ce"><p className='m-0'>Start planning your next adventure</p></div>
                    <div className="box-items flx-3 flx-r mb-4">
                        <div className="item-location flx-3 flx-c just-en">
                            <div className="mr-2">
                                <div className="box-heading">Where are you headed?</div>
                                <input onChange={(e) => updateCity(e)} id='cityInput' type='text' placeholder='e.g. Hawaii, Cancun, Rome' className='calendarInput italic-placeholder' />
                            </div>
                        </div>
                        <div className="item-dates flx-2 flx-c just-en">
                            <div className="box-heading">When will you be there?</div>
                            <div className="calendarWrap mr-2">
                                <span className="material-symbols-outlined position-absolute inputIcon-right xx-large o-50">
                                    date_range
                                </span>
                                <input
                                    onClick={() => setCalendarOpen(calendarOpen => !calendarOpen)}
                                    // value={`${range[0].startDate && range[0].endDate ? format(range[0].startDate, "MM/dd/yyyy")+"      |      "+format(range[0].endDate, "MM/dd/yyyy") : "Start Date   End Date" } `} 
                                    value={`${format(range[0].startDate, "MM/dd/yyyy")}     to     ${format(range[0].endDate, "MM/dd/yyyy")} `}
                                    className="calendarInput"
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
