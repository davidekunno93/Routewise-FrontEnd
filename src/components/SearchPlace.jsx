import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { DataContext } from '../Context/DataProvider';

export const SearchPlace = ({ id, country, addPlaceFromFlowBox, dayNum }) => {
    const { currentTrip } = useContext(DataContext);
    const geolocation = {
        country_2letter: currentTrip.country_2letter ? currentTrip.country_2letter : "gb",
        geocode: currentTrip.geocode ? currentTrip.geocode : [51.50735, -0.12776],
    }

    // 
    const [type, setType] = useState(1);
    const [results, setResults] = useState(null);
    // 
    

    // SUGGESTIONS CODE
    const autofill_accessToken = 'pk.eyJ1Ijoicm91dGV3aXNlMTAyMyIsImEiOiJjbHZnMGo4enEwcHMxMmpxZncxMzJ6cXJuIn0.becg64t48O9U4HViiduAGA';
    const searchRef = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [suggestions, setSuggestions] = useState([])
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
    


    // useEffect(() => {
    //     // console.log(id)
    //     if (currentTimeout) {
    //         clearTimeout(currentTimeout)
    //     }
    //     if (searchText.length >= 3) {
    //         setCurrentTimeout(setTimeout(loadSearchData, 1000))
    //     }
    //     if (searchText.length === 0) {
    //         let autocomplete = document.getElementById(`autocompleteBox-${id}`)
    //         autocomplete.classList.add('d-none')
    //     }
    // }, [searchText])

    const getSearchData = async () => {
        if (searchText.length < 2) {
            // console.log('')
        } else {
            const apiKey = "3e9f6f51c89c4d3985be8ab9257924fe"
            let url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${searchText}&bias=countrycode:${country.toLowerCase()}&limit=5&format=json&filter=countrycode:${country.toLowerCase()}&apiKey=${apiKey}`
            console.log(url)
            const response = await axios.get(url)
            return response.status === 200 ? response.data : null
        }
    }
    const loadSearchData = async () => {
        let data = await getSearchData()
        console.log(data)
        setResults(data.results)
        // open search box
        let autoComplete = document.getElementById(`autocompleteBox-${id}`)
        autoComplete.classList.remove('d-none')
    }

    const resetSearch = (id) => {
        let searchEntry = document.getElementById(`searchEntry-${id}`)
        let autoComplete = document.getElementById(`autocompleteBox-${id}`)
        searchEntry.value = ""
        setSearchText('');
        autoComplete.classList.add('d-none')
    }

    // local state for search text
    // local state for autocomplete results
    // useEffect to call autocomplete api if search text >= 3 chars
    // autocomplete results mapped w/ limit of 5 to populate in ac box



    return (
        <>
            <div className="position-relative w-100">
                {type === 1 ?

                    <div className="searchBar position-relative w-100">
                        <span className="material-symbols-outlined flowBox-location-icon-placeholder">
                            location_on
                        </span>
                        {searchText.length > 0 ?
                            <span onClick={() => resetSearch(id)} className="material-symbols-outlined position-absolute search-icon-overlay2 pointer onHover-fade">
                                close
                            </span>
                            :
                            <span className="material-symbols-outlined position-absolute search-icon-overlay2">
                                search
                            </span>
                        }
                        {/* <button className="btn-primaryflex-overlay">Add</button> */}
                        {/* <input onChange={(e) => setSearchText(e.target.value)} id={`searchEntry-${id}`} type='text' className="flowBox-searchBar flx-1 position-absolute" placeholder='Add a location' /> */}
                        <input ref={searchRef} onChange={(e) => setSearchText(e.target.value)} id={`searchEntry-${id}`} type='text' className="searchBar-input flx-1 position-absolute" placeholder='Add a location' autoComplete='off' />
                    </div>
                    :
                    <input type='text' className='form-input2 w-98 ml-1 mt-3' placeholder='Search places...' />
                }
                {suggestions &&
                    <div id='autocomplete-container' className={`searchBar-dropdown z-1 flx-c ${suggestions.length === 0 && "hide"}`}>
                        {suggestions.map((place, index) => {
                            let hasAddress = place.properties.address
                            let formattedAddress = place.place_name.split(",").slice(1, -1)
                            return hasAddress && <div key={index} onClick={() => { addPlaceFromFlowBox(dayNum, place); resetSearch(id) }} className="option">
                                <img src="https://i.imgur.com/ukt1lYj.png" alt="" className="small-pic mr-1" />
                                <div className="flx-c">
                                    <p className="m-0"><strong>{place.text}</strong></p>
                                    <p className="m-0 small gray-text bold500">{formattedAddress}</p>
                                </div>
                            </div>
                        })}
                        
                    </div>
                }

                {/* <div id={`autocompleteBox-${id}`} className="flowBox-search position-absolute">
                    {results ? results.map((result, i) => {
                        return <div key={i} className="result ws-nowrap onHover-option">
                            <div onClick={() => { addPlaceFromFlowBox(dayNum, result); resetSearch(id) }} className="inner-contain flx-r w-96 hideOverflow m-auto">
                                <img src="https://i.imgur.com/ukt1lYj.png" alt="" className="small-pic mr-1" />
                                <p className="m-0 my-2 large">{result.formatted}</p>
                            </div>
                        </div>
                    })
                        : null}
                </div> */}
            </div>
        </>
    )
}
