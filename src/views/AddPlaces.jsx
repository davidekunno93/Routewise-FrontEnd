import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { OpenMap } from '../components/OpenMap'
import axios from 'axios'

export const AddPlaces = () => {

    const navigate = useNavigate()
    const [places, setPlaces] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [bias, setBias] = useState([51.50735, -0.12776])
    const [country, setCountry] = useState('gb')
    const [auto, setAuto] = useState([]);
    // const [places, setPlaces] = useState([
    //     {
    //         placeName: 'Trafalgar Square',
    //         info: 'Open 24 hours',
    //         address: "Trafalgar Sq, London WC2N 5DS, UK",
    //         imgURL: 'https://i.imgur.com/xwY6Bdd.jpg',
    //         category: "my creation",
    //         geocode: [51.50806, -0.12806]
    //     },
    //     {
    //         placeName: "Tate Modern",
    //         info: "Mon-Sun 10 AM-6 PM",
    //         address: "Bankside, London SE1 9TG, UK",
    //         imgURL: "https://i.imgur.com/FYc6OB3.jpg",
    //         category: "my creation",
    //         geocode: [51.507748, -0.099469]
    //     },
    //     {
    //         placeName: "Hyde Park",
    //         info: "Mon-Sun 5 AM-12 AM",
    //         address: "Hyde Park, London W2 2UH, UK",
    //         imgURL: "https://i.imgur.com/tZBnXz4.jpg",
    //         category: "my creation",
    //         geocode: [51.502777, -0.151250]
    //     },
    //     {
    //         placeName: "Buckingham Palace",
    //         info: "Tours Start at 9am",
    //         address: "Buckingham Palace, London SW1A 1AA, UK",
    //         imgURL: "https://i.imgur.com/lw40mp9.jpg",
    //         category: "my creation",
    //         geocode: [51.501476, -0.140634]
    //     },
    //     {
    //         placeName: "Borough Market",
    //         info: "Closed Mondays, Tues-Sun 10 AM-5 PM",
    //         address: "Borough Market, London SE1 9AL, UK",
    //         imgURL: "https://i.imgur.com/9KiBKqI.jpg",
    //         category: "my creation",
    //         geocode: [51.50544, -0.091249]
    //     }
    // ])
    // useEffect(() => {
    //     getSearchData()
    // }, [searchText])

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

    const getCityImg = async (imgQuery) => {
        const response = await axios.get(`https://api.unsplash.com/search/photos/?client_id=S_tkroS3HrDo_0BTx8QtZYvW0IYo0IKh3xNSVrXoDxo&query=${imgQuery}`)
        return response.status === 200 ? response.data : "error"
        // .then((response) => {
        //         console.log(response.results[0].urls.regular)
        //         setCityImg(response.results[0].urls.regular)
        //     })
    }
    const loadCityImg = async (imgQuery) => {
        const data = await getCityImg(imgQuery)
        // console.log(data)
        console.log(data.results[0].urls.regular)
        return data.results[0].urls.regular
    }

    const addPlace = async (place) => {
        let imgQuery = place.name.replace(/ /g, '-')
        let imgUrl = await loadCityImg(imgQuery)
        let placeCopy = [...places]
        let newPlace = {
            placeName: place.name,
            info: '...',
            address: place.formatted,
            imgURL: imgUrl,
            category: place.category,
            geocode: [place.lat, place.lon]
        }
        placeCopy.push(newPlace)
        console.log(placeCopy)
        setPlaces(placeCopy)
        resetSearch()
    }

    const removePlace = (index) => {
        let placeCopy = [...places]
        placeCopy.splice(index, 1)
        setPlaces(placeCopy)
    }


    const updateLazy = () => {
        console.log("I'm lazy")
    }
    const [currentTimeout, setCurrentTimeout] = useState(null);
    useEffect(() => {
        if (currentTimeout) {
            clearTimeout(currentTimeout)
        }
        if (searchText) {
            if (searchText.length > 2) {
                setCurrentTimeout(setTimeout(loadSearchData, 1000))
            }
        }
    }, [searchText])

    const getSearchData = async () => {

        const apiKey = "3e9f6f51c89c4d3985be8ab9257924fe"
        let url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${searchText}&bias=proximity:${bias[0]},${bias[1]}&limit=5&format=json&filter=countrycode:${country}&apiKey=${apiKey}`
        const response = await axios.get(url)
        return response.status === 200 ? response.data : null

    }
    const loadSearchData = async () => {
        let data = await getSearchData()
        console.log(data)
        setAuto(data.results)
        // open search box
        let autoComplete = document.getElementById('autocomplete-container')
        autoComplete.classList.remove('d-none')
    }

    const updateSearchText = (e) => {
        setSearchText(e.target.value)
    }

    const resetSearch = () => {
        let searchInput = document.getElementById('searchInput')
        let autoComplete = document.getElementById('autocomplete-container')
        searchInput.value = ""
        setSearchText('');
        autoComplete.classList.add('d-none')
    }

    const clearAllPlaces = () => {
        setPlaces([]);
    }

    return (
        <>
            <div className="page-container90 mt-4">

                <Link to='/dashboard' className=''>
                    <span className="material-symbols-outlined v-tbott mr-2">
                        arrow_back
                    </span>
                    <p className="inline large purple-text">Back</p>
                </Link>
                <p onClick={() => resetSearch()} className="page-heading-bold m-0 mt-3">Search and add places to your trip to *city*</p>
                <div className="flx-r onHover-fadelite">
                    <p className="mt-1 mb-3 purple-text"><span className="material-symbols-outlined v-bott mr-2">
                        add
                    </span>Add hotel or other accommodation***</p>
                </div>
                <div className="body-section flx-r">
                    <div className="map-section flx-5">
                        <div className="gray-box position-relative flx">

                            <div className="searchBar position-absolute w-100 z-10000">
                                <div className="position-relative w-100 h-100">
                                    <div id='autocomplete-container' className="mapSearch-dropdown flx-c">
                                        {/* <div className="inner-box w-96 m-auto h-100 pt-1 flx-c hideOverflow"> */}
                                        {auto ? auto.map((result, i) => {
                                            return <div key={i} onClick={() => addPlace(result)} className="result ws-nowrap onHover-option">
                                                <div className="inner-contain flx-r w-96 hideOverflow m-auto">
                                                    <img src="https://i.imgur.com/ukt1lYj.png" alt="" className="small-pic mr-1" />
                                                    <p className="m-0 my-2 large">{result.formatted}</p>
                                                </div>
                                            </div>
                                        }) : null}
                                        {/* </div> */}


                                    </div>
                                    <span className="material-symbols-outlined position-absolute location-icon-placeholder">
                                        location_on
                                    </span>
                                    {searchText.length > 0 ?
                                        <span onClick={() => resetSearch()} className="material-symbols-outlined position-absolute search-icon-overlay pointer onHover-black">
                                            close
                                        </span>
                                        :
                                        <span className="material-symbols-outlined position-absolute search-icon-overlay">
                                            search
                                        </span>
                                    }
                                    <input onChange={(e) => updateSearchText(e)} id='searchInput' type='text' className="input-search-map-overlay position-absolute" placeholder='Search places...' />
                                </div>
                            </div>

                            <OpenMap markers={places} />
                        </div>
                    </div>
                    <div className="places-list flx-c flx-4">
                        <div className="">
                            <div className="flx-r flx-end just-sb">
                                <p className="page-subheading-bold m-0 my-1">Added places</p>
                                <p onClick={() => clearAllPlaces()} className="mb-2 purple-text pointer">Clear List</p>
                            </div>
                            <div className="placeCards">



                                {Array.isArray(places) && places.length > 0 ? places.map((place, index) => {
                                    return <div key={index} className="placeCard position-relative flx-r my-2">

                                        <div className="placeCard-img-div flx-1">
                                            <img className="placeCard-img" src={place.imgURL} />
                                        </div>
                                        <div className="placeCard-body flx-2">
                                            <p className="body-title ">{place.placeName}</p>
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
                                            <span onClick={() => removePlace(index)} className="material-symbols-outlined mx-3 my-2 onHover-50 pointer">
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
