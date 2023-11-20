import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const SpecifyCity = ({ open, cities, updateCity2, updateState, updateCountry, updateGeocode, openNameTripModal, onClose }) => {
    if (!open) return null

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
    

    const [finished, setFinished] = useState(false);
    if (finished) {
        onClose();
        openNameTripModal();
        setFinished(false);
    }
    

    const handleSelect = (cityName, state, country, lat, lon) => {
        let geocode = [lat, lon]
        console.log(cityName, state, geocode)
        updateCity2(cityName)
        updateState(state)
        updateCountry(country)
        updateGeocode(geocode)
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
                        <div className="xx-large bold700 font-jakarta w-80 my-3">
                            Select your destination
                        </div>
                        <div className="">
                            {cities.map((city, i) => {
                                return <Link onClick={() => handleSelect(city.name, city.state, city.country, city.latitude, city.longitude)} key={i}><p className="large">{city.name}, {city.country === 'US' ? city.state + ", " : null} {city.country}</p></Link>
                            })}

                        </div>

                        {/* <button className="btn-primaryflex">Start Planning!</button> */}
                    </div>
                </div>
            </div>
        </>
    )
}
