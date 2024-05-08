import { AddressAutofill } from '@mapbox/search-js-react';
import axios from 'axios';
import React, { useContext, useDebugValue, useEffect, useRef, useState } from 'react'
import { DataContext } from '../Context/DataProvider';

const SearchPlaceForMap = ({ addPlaceToConfirm }) => {
    const { currentTrip, setCurrentTrip, clearCurrentTrip } = useContext(DataContext);
    const geolocation = {
        country_2letter: currentTrip.country_2letter ? currentTrip.country_2letter : "gb",
        geocode: currentTrip.geocode ? currentTrip.geocode : [51.50735, -0.12776],
    }
    // select a place, give it back to parent component - prop drill the add place function

    // SUGGESTIONS CODE
    // const autofill_accessToken = import.meta.env.VITE_APP_MAPBOX_API_KEY;
    const autofill_accessToken = "pk.eyJ1Ijoicm91dGV3aXNlMTAyMyIsImEiOiJjbHZnMGo4enEwcHMxMmpxZncxMzJ6cXJuIn0.becg64t48O9U4HViiduAGA";
    ;
    const searchRef = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [currentTimeout, setCurrentTimeout] = useState(null);
    const getPlaces = async (query) => {
        let lat = geolocation.geocode[0]
        let lon = geolocation.geocode[1]
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?country=${geolocation.country_2letter}&proximity=${lon}%2C${lat}&language=en&access_token=${autofill_accessToken}`)
        setSuggestions(response.data.features);
        console.log(response.data.features)
    }
    // trigger API call when searchText has 3 or more chars
    useEffect(() => {
        if (currentTimeout) {
            // console.log("clearing current timeout:", currentTimeout);
            clearTimeout(currentTimeout);
            setCurrentTimeout(null);
        }
        if (searchText.length < 3) {
            setSuggestions([]);
            if (searchText.length === 0) {
                searchRef.current.value = ""
                searchRef.current.focus()
            }
        } else {
            setCurrentTimeout(setTimeout(getPlaces(searchText), 1000));
        }
    }, [searchText]);


    // TEST API CALL FUNCTION
    const apiCall = () => {
        console.log("CALL API NOWW!!!!!")
        let results = [
            {
                properties: {
                    address: "123 Belldrive, TX"
                },
                place_name: "name, 123 Belldrive, TX, United states",
                text: "Place name",
            },
            {
                properties: {
                    address: "123 Belldrive, TX"
                },
                place_name: "name, 123 Belldrive, TX, United states",
                text: "Place name",
            },
            {
                properties: {
                    address: "123 Belldrive, TX"
                },
                place_name: "name, 123 Belldrive, TX, United states",
                text: "Place name",
            },
        ]
        setSuggestions(results);
    }

    return (
        <div className="searchBar-container flx-c position-absolute z-1">
            <div className="searchBar position-relative w-90 flx align-c">
                <span className="material-symbols-outlined icon-overlay-left o-80">
                    location_on
                </span>
                {searchText.length === 0 ?
                    <span className="material-symbols-outlined icon-overlay-right o-80">
                        search
                    </span>
                    :
                    <span onClick={() => setSearchText("")} className="material-symbols-outlined icon-overlay-right o-80 pointer">
                        close
                    </span>
                }
                
                <input
                    ref={searchRef}
                    onChange={e => setSearchText(e.target.value)}
                    type="text"
                    autoComplete="off"
                    className="searchBar-input"
                    placeholder='Search places...' />
                
                {suggestions &&
                    <div id='autocomplete-container' className={`searchBar-dropdown z-1 flx-c ${suggestions.length === 0 && "hide"}`}>
                        {suggestions.map((place, index) => {
                            let hasAddress = place.properties.address
                            let formattedAddress = place.place_name.split(",").slice(1, -1)
                            return hasAddress && <div key={index} onClick={() => {addPlaceToConfirm(place); setSearchText("")}} className="option">
                                <img src="https://i.imgur.com/ukt1lYj.png" alt="" className="small-pic mr-1" />
                                <div className="flx-c">
                                    <p className="m-0"><strong>{place.text}</strong></p>
                                    <p className="m-0 small gray-text bold500">{formattedAddress}</p>
                                </div>
                            </div>
                        })}
                        
                    </div>
                }
            </div>
            {/* <div className="search-categories">
                <div className="search-category">
                    <span className="material-symbols-outlined">
                        restaurant
                    </span>
                    <p className="m-0">Food</p>
                </div>
                <div className="search-category">
                    <span className="material-symbols-outlined">
                        local_bar
                    </span>
                    <p className="m-0">Nightlife</p>
                </div>
                <div className="search-category">
                    <span className="material-symbols-outlined">
                        bolt
                    </span>
                    <p className="m-0">Attractions</p>
                </div>
                <div className="search-category">
                    <span className="material-symbols-outlined">
                        spa
                    </span>
                    <p className="m-0">Relaxation</p>
                </div>
                <div className="search-category">
                    <span className="material-symbols-outlined">
                        comedy_mask
                    </span>
                    <p className="m-0">Entertainment</p>
                </div>
            </div> */}
        </div>
    )
}
export default SearchPlaceForMap;