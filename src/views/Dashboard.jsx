import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { NameTripModal } from './NameTripModal';


export const Dashboard = () => {
    // login require
    const [openTripModal, setOpenTripModal] = useState(false)
    const [departDate, setDepartDate] = useState(new Date());
    const [translationIndex, setTranslationIndex] = useState(0);
    const [fullTranslated, setFullTranslated] = useState(false);
    useEffect(() => {
        console.log(window.innerWidth)
    }, [])

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
        setOpenTripModal(true)
    }
    const closeNameTripModal = () => {
        setOpenTripModal(false)
    }

    return (
        <>
            <div className=''>
                <DatePicker selected={departDate} onChange={(departDate) => setDepartDate(departDate)} />
            </div>
            <NameTripModal open={openTripModal} onClose={() => closeNameTripModal()} />
            <div className="page-container90 mt-4">
                <h1 className="page-title">Hi Josh, (emoji)</h1>
                <div className="selection-box flx-c">
                    <div className="box-title flx-2 flx-c just-ce"><p className='m-0'>Start planning your next adventure</p></div>
                    <div className="box-items flx-3 flx-r mb-4">
                        <div className="item-location flx-3 flx-c just-en">
                            <div className="box-heading">Where are you headed?</div>
                            <input type='text' placeholder='e.g. Hawaii, Cancun, Rome' className='input-normal italic-placeholder' />
                        </div>
                        <div className="item-dates flx-2 flx-c just-en">
                            <div className="box-heading">When will you be there?</div>
                            <input type='text' placeholder='Start Date | End Date' className='input-normal2' />
                        </div>
                        <div className="item-addtrip flx-c just-en">
                            <button onClick={() => openNameTripModal()} className="btn-primaryflex2">Add Trip</button>
                        </div>
                    </div>
                </div>

                <div className="map my-5 flx"><p className="m-auto">Map goes here</p></div>

                <div className="popular-destinations">
                    <div className="page-heading my-3">Popular destinations</div>

                    <div className="carousel2-window">
                        <div id='cityCarouselInner' className="inner-no-flex" style={{ transform: `translateX(-${translationIndex * 350}px)` }}>
                            {cities.map((city, index) => {
                                return <div className="card3 position-relative">
                                    <img src={city.imgUrl} alt="" className="card3-img" />
                                    <div className="model-overlay position-absolute white-text">
                                        <span class="material-symbols-outlined v-bott">
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
