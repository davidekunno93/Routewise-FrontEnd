import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const SpecifyCity = ({ open, cities, tripData, setTripData, getCountryName, openNameTripModal, onClose }) => {
    if (!open) return null


    

    const [finished, setFinished] = useState(false);
    if (finished) {
        onClose();
        openNameTripModal();
        setFinished(false);
    }
    

    const handleSelect = (cityName, state, country, lat, lon) => {
        let tripInfo = {...tripData}
        tripInfo.cityName = cityName
        tripInfo.state = state
        tripInfo.country = getCountryName(country)
        tripInfo.country_2letter = country
        tripInfo.geocode = [lat, lon]
        setTripData(tripInfo)
        updateFinished()
        // onClose()
        // openNameTripModal()

    }

    const updateFinished = () => {
        setFinished(true)
    }

    return (
        <>
            <div className="overlay"></div>
            <div className="modal">
                <div className="specifyCity-box">
                    <div className="placement flx-c align-c w-100 m-auto">
                        <span onClick={onClose} className="closeBtn material-symbols-outlined position-absolute xx-large color-gains">
                            close
                        </span>
                        <div className="page-subheading-bold bold700 font-jakarta w-80 my-3 dark-text">
                            Select your destination
                        </div>
                        
                        <div className="">
                            {cities.map((city, i) => {
                                return <Link onClick={() => handleSelect(city.name, city.state, city.country, city.latitude, city.longitude)} key={i}><p className="large nav-link my-2">{city.name}, {city.country === 'US' ? city.state + ", " : null} {city.country}</p></Link>
                            })}

                        </div>

                        {/* <button className="btn-primaryflex">Start Planning!</button> */}
                    </div>
                </div>
            </div>
        </>
    )
}
