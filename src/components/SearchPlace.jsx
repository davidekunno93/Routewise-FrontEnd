import axios from 'axios';
import React, { useEffect, useState } from 'react'

export const SearchPlace = ({ id, country, addPlaceFromFlowBox, dayNum }) => {
    const [type, setType] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState(null);

    const updateSearchText = (e) => {
        setSearchText(e.target.value)
    }

    const [currentTimeout, setCurrentTimeout] = useState(null);

    useEffect(() => {
        // console.log(id)
        if (currentTimeout) {
            clearTimeout(currentTimeout)
        }
        if (searchText.length >= 3) {
            setCurrentTimeout(setTimeout(loadSearchData, 1000))
        } 
        if (searchText.length === 0) {
            let autocomplete = document.getElementById(`autocompleteBox-${id}`)
            autocomplete.classList.add('d-none')
        }
    }, [searchText])

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

    const test = (dayNum, place) => {
        console.log(dayNum)
        console.log(place)
    }

    return (
        <>
            <div className="position-relative w-100">
                {type === 1 ?

                    <div className="searchBar position-relative w-100">
                        <span className="material-symbols-outlined position-absolute flowBox-location-icon-placeholder">
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
                        <input onChange={(e) => updateSearchText(e)} id={`searchEntry-${id}`} type='text' className="flowBox-searchBar flx-1 position-absolute" placeholder='Add a location' />
                    </div>
                    :
                    <input type='text' className='form-input2 w-98 ml-1 mt-3' placeholder='Search places...' />
                }

                <div id={`autocompleteBox-${id}`} className="flowBox-search position-absolute">
                    {results ? results.map((result, i) => {
                        return <div key={i} className="result ws-nowrap onHover-option">
                            <div onClick={() => {addPlaceFromFlowBox(dayNum, result); resetSearch(id)}} className="inner-contain flx-r w-96 hideOverflow m-auto">
                                <img src="https://i.imgur.com/ukt1lYj.png" alt="" className="small-pic mr-1" />
                                <p className="m-0 my-2 large">{result.formatted}</p>
                            </div>
                        </div>
                    })
                        : null}
                </div>
            </div>
        </>
    )
}
