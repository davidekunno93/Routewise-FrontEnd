import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { OpenMap } from '../components/OpenMap'

export const AddPlaces = () => {

    const navigate = useNavigate()
    // const [places, setPlaces] = useState(null);

    const [places, setPlaces] = useState([
        {
            placeName: 'Trafalgar Square',
            info: 'Open 24 hours',
            address: "Trafalgar Sq, London WC2N 5DS, UK",
            imgURL: 'https://i.imgur.com/xwY6Bdd.jpg',
            geocode: [51.50806, -0.12806]
        },
        {
            placeName: "Tate Modern",
            info: "Mon-Sun 10 AM-6 PM",
            address: "Bankside, London SE1 9TG, UK",
            imgURL: "https://i.imgur.com/FYc6OB3.jpg",
            geocode: [51.507748, -0.099469]
        },
        {
            placeName: "Hyde Park",
            info: "Mon-Sun 5 AM-12 AM",
            address: "Hyde Park, London W2 2UH, UK",
            imgURL: "https://i.imgur.com/tZBnXz4.jpg",
            geocode: [51.502777, -0.151250]
        },
        {
            placeName: "Buckingham Palace",
            info: "Tours Start at 9am",
            address: "Buckingham Palace, London SW1A 1AA, UK",
            imgURL: "https://i.imgur.com/lw40mp9.jpg",
            geocode: [51.501476, -0.140634]
        },
        {
            placeName: "Borough Market",
            info: "Closed Mondays, Tues-Sun 10 AM-5 PM",
            address: "Borough Market, London SE1 9AL, UK",
            imgURL: "https://i.imgur.com/9KiBKqI.jpg",
            geocode: [51.50544, -0.091249]
        }
    ])

    // const [markers, setMarkers] = useState(places)

    const goToDashboard = () => {
        navigate('/dashboard')
    }

    const addStar = (index) => {
        const starFull = document.getElementById(`star-full-${index}`)
        const starEmpty = document.getElementById(`star-empty-${index}`)
        starFull.classList.remove('d-none')
        starEmpty.classList.add('d-none')
    }
    const removeStar = (index) => {
        const starFull = document.getElementById(`star-full-${index}`)
        const starEmpty = document.getElementById(`star-empty-${index}`)
        starFull.classList.add('d-none')
        starEmpty.classList.remove('d-none')
    }

    return (
        <>
            <div className="page-container90 mt-4">

                <Link to='/dashboard' className=''>
                    <span className="material-symbols-outlined v-tbott mx-2">
                        arrow_back
                    </span>
                    <p className="inline large">Back</p>
                </Link>
                <p className="page-heading-bold my-3">Search and add places to your trip to *city*</p>

                <div className="body-section flx-r">
                    <div className="map-section flx-5">
                        <div className="gray-box position-relative flx">

                            <div className="searchBar position-absolute w-100 ml-5 z-10000">
                                <div className="position-relative w-100 h-100">
                                    <span className="material-symbols-outlined position-absolute location-icon-placeholder">
                                        location_on
                                    </span>
                                    <span className="material-symbols-outlined position-absolute search-icon-overlay">
                                        search
                                    </span>
                                    <input type='text' className="input-search-map-overlay position-absolute" placeholder='Search places...' />
                                </div>
                            </div>

                            <OpenMap markers={places} />
                        </div>
                    </div>
                    <div className="places-list flx-c flx-4">
                        <div className="">
                            <p className="page-subheading-bold m-0 my-1">Added places</p>
                            <div className="placeCards">



                                {Array.isArray(places) ? places.map((place, index) => {
                                    return <div key={index} className="placeCard position-relative flx-r my-2">

                                        <div className="placeCard-img-div flx-1">
                                            <img className="placeCard-img" src={place.imgURL} />
                                        </div>
                                        <div className="placeCard-body flx-2">
                                            <p className="body-title">{place.placeName}</p>
                                            <p className="body-info">{place.info}</p>
                                            <p className="body-address">{place.address}</p>
                                        </div>
                                        <div className="placeCard-starOrDelete flx-c just-sb align-c">
                                            {/* <img className="empty-star m-auto pad16" src='https://i.imgur.com/70juIKm.png' /> */}
                                            {/* <span className="material-symbols-outlined mx-3 my-2 o-50 onHover-fade pointer">
                                                star
                                            </span> */}
                                            <img onClick={() => addStar(index)} id={`star-empty-${index}`} src="https://i.imgur.com/S0wE009.png" alt="" className="star-empty my-2" />
                                            <img onClick={() => removeStar(index)} id={`star-full-${index}`} src="https://i.imgur.com/Bq6COcA.png" alt="" className="star-full my-2 d-none" />
                                            <span className="material-symbols-outlined mx-3 my-2 onHover-50 pointer">
                                                delete
                                            </span>
                                        </div>
                                    </div>
                                })
                                    :
                                    <div className="add-places-card">
                                        <span className="material-symbols-outlined xx-large">
                                            location_on
                                        </span>
                                        <p className="large bold700 my-1">Add some places</p>
                                        <p className="m-0 w-50 center-text">Use the search bar on the map to add places that you want to go</p>
                                    </div>

                                }
                            </div>
                            <div className="generate-btn-space w-100">
                                <button className="btn-primaryflex right mt-2">Generate Itinerary</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
