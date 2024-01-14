import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { OpenMap } from '../components/OpenMap'
import axios from 'axios'
import Scrollbars from 'react-custom-scrollbars-2'
import { Itinerary } from './Itinerary'
import { LoadingScreen } from '../components/LoadingScreen'
import { Loading } from '../components/Loading'
import { DataContext } from '../Context/DataProvider'
import StarPlacesToolTip from '../components/StarPlacesToolTip'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firestore } from '../firebase'
import { LoadingBox } from '../components/LoadingBox'



export const AddPlaces = ({ countryGeo, currentTrip, setCurrentTrip, clearCurrentTrip }) => {
    // Send Kate Data
    const { user, setUser } = useContext(DataContext);
    const { firstTimeUser, setFirstTimeUser } = useContext(DataContext);
    const [firstTimeOnPage, setFirstTimeOnPage] = useState(true);
    const navigate = useNavigate();
    const [places, setPlaces] = useState(currentTrip.places.length > 0 ? currentTrip.places : []);
    const [placeToConfirm, setPlaceToConfirm] = useState(null);
    // const [placeToConfirm, setPlaceToConfirm] = useState({
    //     placeName: "Tate Modern",
    //     info: "Mon-Sun 10 AM-6 PM",
    //     address: "Bankside, London SE1 9TG, UK",
    //     imgURL: "https://i.imgur.com/FYc6OB3.jpg",
    //     category: "my creation",
    //     favorite: false,
    //     lat: 51.507748,
    //     long: -0.099469,
    //     geocode: [51.507748, -0.099469],
    //     placeId: "2",
    // });
    const [markers, setMarkers] = useState([])
    const [searchText, setSearchText] = useState('');
    const [bias, setBias] = useState(currentTrip.geocode ? currentTrip.geocode : [51.50735, -0.12776])
    const [country, setCountry] = useState(currentTrip.country_2letter ? currentTrip.country_2letter : 'gb')
    const [suggestedPlaces, setSuggestedPlaces] = useState([]);
    const [auto, setAuto] = useState([]);
    // const [places, setPlaces] = useState([
    //     {
    //         placeName: 'Trafalgar Square',
    //         info: 'Open 24 hours',
    //         address: "Trafalgar Sq, London WC2N 5DS, UK",
    //         imgURL: 'https://i.imgur.com/xwY6Bdd.jpg',
    //         category: "my creation",
    //         favorite: false,
    //         lat: 51.50806,
    //         long: -0.12806,
    //         geocode: [51.50806, -0.12806],
    //         placeId: "1",
    //     },
    //     {
    //         placeName: "Tate Modern",
    //         info: "Mon-Sun 10 AM-6 PM",
    //         address: "Bankside, London SE1 9TG, UK",
    //         imgURL: "https://i.imgur.com/FYc6OB3.jpg",
    //         category: "my creation",
    //         favorite: false,
    //         lat: 51.507748,
    //         long: -0.099469,
    //         geocode: [51.507748, -0.099469],
    //         placeId: "2",
    //     },
    //     {
    //         placeName: "Hyde Park",
    //         info: "Mon-Sun 5 AM-12 AM",
    //         address: "Hyde Park, London W2 2UH, UK",
    //         imgURL: "https://i.imgur.com/tZBnXz4.jpg",
    //         category: "my creation",
    //         favorite: false,
    //         lat: 51.502777, 
    //         long: -0.151250,
    //         geocode: [51.502777, -0.151250],
    //         placeId: "3",
    //     },
    //     {
    //         placeName: "Buckingham Palace",
    //         info: "Tours Start at 9am",
    //         address: "Buckingham Palace, London SW1A 1AA, UK",
    //         imgURL: "https://i.imgur.com/lw40mp9.jpg",
    //         category: "my creation",
    //         favorite: false,
    //         lat: 51.501476, 
    //         long: -0.140634,
    //         geocode: [51.501476, -0.140634],
    //         placeId: "4",
    //     },
    //     {
    //         placeName: "Borough Market",
    //         info: "Closed Mondays, Tues-Sun 10 AM-5 PM",
    //         address: "Borough Market, London SE1 9AL, UK",
    //         imgURL: "https://i.imgur.com/9KiBKqI.jpg",
    //         category: "my creation",
    //         favorite: false,
    //         lat: 51.50544, 
    //         long: -0.091249,
    //         geocode: [51.50544, -0.091249],
    //         placeId: "5",
    //     }
    // ])
    useEffect(() => {
        getSearchData()
    }, [searchText])

    useEffect(() => {
        console.log(currentTrip)
    }, [])

    useEffect(() => {
        let placeCopy = [...places];
        // console.log(places)
        // console.log(placeToConfirm)
        if (placeToConfirm) {
            placeCopy.push(placeToConfirm)
        }
        setMarkers(placeCopy)
    }, [placeToConfirm, places])



    const goToDashboard = () => {
        navigate('/dashboard')
    }

    const addStar = (index) => {
        // const starFull = document.getElementById(`star-full-${index}`)
        // const starEmpty = document.getElementById(`star-empty-${index}`)
        // starFull.classList.remove('d-none')
        // starEmpty.classList.add('d-none')
        let placesCopy = [...places]
        placesCopy[index].favorite = true
        setPlaces(placesCopy)
        let currentTripCopy = { ...currentTrip }
        currentTripCopy.places[index].favorite = true
        setCurrentTrip(currentTripCopy)
    }
    const removeStar = (index) => {
        // const starFull = document.getElementById(`star-full-${index}`)
        // const starEmpty = document.getElementById(`star-empty-${index}`)
        // starFull.classList.add('d-none')
        // starEmpty.classList.remove('d-none')
        let placesCopy = [...places]
        placesCopy[index].favorite = false
        setPlaces(placesCopy)
        let currentTripCopy = { ...currentTrip }
        currentTripCopy.places[index].favorite = false
        setCurrentTrip(currentTripCopy)
    }
    // useEffect(() => {
    //     console.log(places)
    // }, [places])

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
        // console.log(data, imgQuery)
        if (data.total === 0) {
            return "none"
        } else {
            // console.log(data.results[0].urls.regular)
            return data.results[0].urls.regular
        }
    }

    const getPlaceDetails = async (placeDetailsQuery) => {
        const response = await axios.get(`https://api.geoapify.com/v2/place-details?&id=${placeDetailsQuery}&apiKey=3e9f6f51c89c4d3985be8ab9257924fe`)
        return response.status === 200 ? response.data : "error"
    }

    const loadPlaceDetails = async (placeDetailsQuery) => {
        // let q = "5165cdd94c746eb9bf591e447c71f3c04940f00102f9010904780100000000c0020192030b54617465204d6f6465726e"
        const data = await getPlaceDetails(placeDetailsQuery)
        if (data === "error") {
            console.log("error")
        } else {
            // console.log(data)
            console.log(data.features[0].properties.opening_hours)
            return data.features[0].properties.opening_hours ? data.features[0].properties.opening_hours : "No hours information"
        }
    }

    const clearPlaceToConfirm = () => {
        setPlaceToConfirm(null)
    }

    const addPlaceToConfirm = async (place) => {

        // only load image for place if there isn't already an imgUrl defined in the place object
        let imgUrl = ""
        if (!place.imgUrl) {
            let imgQuery = place.name.replace(/ /g, '-')
            imgUrl = await loadCityImg(imgQuery)
        } else {
            imgUrl = place.imgUrl
        }

        let placeInfo = await loadPlaceDetails(place.place_id)

        let newPlace = {
            placeName: place.name,
            info: placeInfo,
            address: place.formatted,
            imgURL: imgUrl,
            category: place.category ? place.category : "none",
            favorite: false,
            lat: place.lat,
            long: place.lon,
            geocode: [place.lat, place.lon],
            placeId: place.place_id
        }
        setPlaceToConfirm(newPlace)
        resetSearch()
    }

    const addPlace = () => {
        // let imgQuery = place.name.replace(/ /g, '-')
        // let placeInfo = await loadPlaceDetails(place.place_id)
        // let imgUrl = await loadCityImg(imgQuery)
        let placeCopy = [...places]
        let newPlace = placeToConfirm
        placeCopy.push(newPlace)
        console.log(placeCopy)
        setPlaces(placeCopy)
        let currentTripCopy = { ...currentTrip }
        currentTripCopy.places.push(newPlace)
        // currentTripCopy.places = places
        setCurrentTrip(currentTripCopy)
        clearPlaceToConfirm()
        if (firstTimeOnPage) {
            openStarPlacesToolTip()
        }
    }

    const addPlaceToList = async (place) => {
        let placeInfo = await loadPlaceDetails(place.place_id)

        let newPlace = {
            placeName: place.name,
            info: placeInfo,
            address: place.formatted,
            imgURL: place.imgUrl,
            category: place.category ? place.category : "none",
            favorite: false,
            lat: place.lat,
            long: place.lon,
            geocode: [place.lat, place.lon],
            placeId: place.place_id
        }
        let placeCopy = [...places]
        placeCopy.push(newPlace)
        console.log(placeCopy)
        setPlaces(placeCopy)
        let currentTripCopy = { ...currentTrip }
        currentTripCopy.places.push(newPlace)
        // currentTripCopy.places = places
        setCurrentTrip(currentTripCopy)
        if (firstTimeOnPage) {
            openStarPlacesToolTip()
        }
    }

    const removePlace = (index) => {
        let placeCopy = [...places]
        placeCopy.splice(index, 1)
        setPlaces(placeCopy)
        let currentTripCopy = { ...currentTrip }
        currentTripCopy.places.splice(index, 1)
        setCurrentTrip(currentTripCopy)
    }


    // const updateLazy = () => {
    //     console.log("I'm lazy")
    // }
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

    const quickGetSuggestedPlaces = async (category, categoryTitle, limit, mergeData) => {
        const apiKey = "3e9f6f51c89c4d3985be8ab9257924fe"
        let response = ""
        // if category includes % there are two competing types in the same category and I want them to be searched separately
        if (category.includes("%")) {
            let data = null
            // split category into individual search queries
            category = category.split("%")
            // limit of results divided by the amount of diff search queries so overall total is the same
            limit = Math.ceil(limit / category.length)
            // search query terms one by one
            for (let i = 0; i < category.length; i++) {
                // mergeData is data that needs to be stored locally and merged with new data to be returned
                if (!mergeData) {
                    mergeData = []
                    // console.log('no merge data')
                }
                // console.log(mergeData)
                // returned data is the list of places
                data = await quickGetSuggestedPlaces(category[i], categoryTitle, limit, mergeData)
                for (let j = 0; j < data.length; j++) {
                    data[j].properties['categoryTitle'] = categoryTitle
                    if (category[i].includes('nightclub')) {
                        data[j].properties['categoryTag'] = "Nightclub"
                    }
                }
                mergeData = mergeData.concat(data)
            }
            console.log(mergeData)
            return mergeData
        } else {
            response = await axios.get(`https://api.geoapify.com/v2/places?&categories=${category}&bias=proximity:${bias[1]},${bias[0]}&limit=${limit}&apiKey=${apiKey}`)
            let data = response.data.features
            for (let j = 0; j < data.length; j++) {
                data[j].properties['categoryTitle'] = categoryTitle
            }
            console.log(response.data.features)
            return response.status === 200 ? response.data.features : null
        }

    }

    const getSuggestedPlaces = async (category, categoryTitle, limit, delay) => {
        const apiKey = "3e9f6f51c89c4d3985be8ab9257924fe"
        // if category contains % sign this means I want to search the category terms separately on the api - like 
        // Food & NightClub because the merged results don't have many nightclubs in them
        if (category.includes('%')) {
            category = category.split('%')
            limit = Math.ceil(limit / category.length)
            let data = ""
            let dataLoads = []
            for (let i = 0; i < category.length; i++) {
                data = await quickGetSuggestedPlaces(category[i], categoryTitle, limit)
                // category tag so I can add the specific category type to the search query
                if (i === 0) {
                    // for (let j = 0; j < data.length; j++) {
                    //     data[j].properties["categoryTag"] = 'dining'
                    // }
                } else if (i === 1) {
                    for (let j = 0; j < data.length; j++) {
                        data[j].properties["categoryTag"] = 'Nightclub'
                    }
                }
                // add data to data load
                dataLoads.push(data)
            }
            // console.log(dataLoads)
            for (let i = 0; i < category.length - 1; i++) {
                dataLoads[0] = dataLoads[0].concat(dataLoads[1])
            }
            dataLoads = dataLoads[0]
            console.log(dataLoads)
            updateSuggestedPlaces(dataLoads, categoryTitle)
            // if (delay) {
            //     return "done"
            // }
        } else {
            let url = `https://api.geoapify.com/v2/places?&categories=${category}&bias=proximity:${bias[1]},${bias[0]}&limit=${limit}&apiKey=${apiKey}`
            const response = await axios.get(url)
                // return response.status === 200 ? response.data : null
                .then(async (response) => {
                    let data = response.data.features
                    console.log(data)
                    updateSuggestedPlaces(data, categoryTitle)
                    // if (delay) {
                    //     return "done"
                    // }
                })
                .catch((error) => {
                    console.log(error)
                    alert("Something went wrong with suggested places")
                })
        }
    }

    const updateSuggestedPlaces = async (data, categoryTitle) => {
        for (let i = 0; i < data.length; i++) {
            let place = data[i].properties
            if (!place.categoryTitle) {
                place.categoryTitle = categoryTitle
            } else {
                categoryTitle = place.categoryTitle
            }
            if (place.name) {
                // console.log(place.name)
                let addressLine2Short = place.address_line2.split(',')[0].replace(/ /g, "-")
                // console.log(addressLine2Short)
                let imgQuery = ""
                // categoryTag is only for nightlife so far - to help the img query be more specific
                if (place.categoryTag) {
                    imgQuery = place.name.replace(/ /g, "-").split(',').join('') + "-" + place.categoryTag
                } else if (categoryTitle === "Shopping" || categoryTitle === "Nature") {
                    imgQuery = place.name.replace(/ /g, "-").split(',').join('') + "-" + categoryTitle
                    // console.log('if')
                    // console.log(categoryTitle)
                } else if (place.name.split(' ').length === 1) {
                    imgQuery = place.name.replace(/ /g, "-").split(',').join('') + "-" + addressLine2Short
                    // console.log('else if')
                } else {
                    imgQuery = place.name.replace(/ /g, "-").split(',').join('')
                    // console.log('else')
                }
                // console.log(imgQuery)
                if (imgQuery.includes('.') || imgQuery.includes(',')) {
                    imgQuery = place.categoryTitle.split(' ')[0]
                    let imgUrl = await loadCityImg(imgQuery)
                    place.imgUrl = imgUrl
                    console.log(categoryTitle)
                } else {
                    let imgUrl = await loadCityImg(imgQuery)
                    if (imgUrl === "none") {
                        imgQuery = place.categoryTitle.split(' ')[0]
                        let imgUrl = await loadCityImg(imgQuery)
                        place.imgUrl = imgUrl
                    } else {
                        place.imgUrl = imgUrl
                    }
                }
            }

        }
        // console.log(response)
        let suggestedPlacesCopy = [...suggestedPlaces]
        suggestedPlacesCopy = suggestedPlacesCopy.concat(data)
        // console.log(data)
        // data.sort((a, b) => a.properties.distance - b.properties.distance)
        console.log(suggestedPlacesCopy)
        setSuggestedPlaces(suggestedPlacesCopy)
    }

    const clearSuggestedPlaces = () => {
        setSuggestedPlaces([]);
    }
    const { userPreferences, setUserPreferences } = useContext(DataContext);
    // const [userPreferences, setUserPreferences] = useState(
    //     {
    //         landmarks: false,
    //         nature: false,
    //         shopping: false,
    //         food: false,
    //         relaxation: false,
    //         entertainment: false,
    //         arts: false
    //     });
    const [userInterests, setUserInterests] = useState([])

    useEffect(() => {
        // key for converting travel preference to place category
        const categoryKey = {
            landmarks: { category: "tourism.attraction,tourism.sights", categoryTitle: "Landmarks & Attractions" },
            nature: { category: "natural,entertainment.zoo,entertainment.aquarium", categoryTitle: "Nature" },
            shopping: { category: "commercial.shopping_mall,commercial.clothing,commercial.gift_and_souvenir", categoryTitle: "Shopping" },
            food: { category: "catering%adult.nightclub", categoryTitle: "Food & Nightlife" },
            relaxation: { category: "service.beauty.spa,service.beauty.massage", categoryTitle: "Spa & Relaxation" },
            entertainment: { category: "entertainment.cinema,entertainment.amusement_arcade,entertainment.escape_game,entertainment.miniature_golf,entertainment.bowling_alley,entertainment.theme_park,entertainment.activity_park", categoryTitle: "Music & Entertainment" },
            arts: { category: "entertainment.culture,entertainment.museum", categoryTitle: "Arts & Culture" }
        }
        // no user ? render a few landmarks
        // getSuggestedPlaces('tourism.attraction', "Landmarks & Attractions", 12)
        // getSuggestedPlaces('catering%adult.nightclub', "Food & Nightlife", 12)
        let userPreferencesArr = Object.entries(userPreferences)
        // console.log(userPreferences)
        // console.log(userPreferencesArr)
        let userInterestsList = []
        for (let [key, value] of userPreferencesArr) {
            if (value === true) {
                userInterestsList.push(categoryKey[key])
                // console.log(key)
            }
        }
        console.log(userInterestsList)
        setUserInterests(userInterestsList)

        let conclusion = delayGetSuggestedPlaces(userInterestsList)
        console.log(conclusion)

        // user ? continue
        // 0 preferences ? *RENDERED* render button that asks you to update preferences that links to survey page
        // 1 preference ? load 12 suggestions for that one preference
        // if (userInterestsList.length === 1) {
        //     getSuggestedPlaces(userInterestsList[0].category, userInterestsList[0].categoryTitle, 12)
        // }
        // // 2 preferences ? load 6 suggestions per preference
        // else if (userInterestsList.length === 2) {
        //     delayGetSuggestedPlaces(userInterestsList[0].category, userInterestsList[0].categoryTitle, 6)
        //     delayGetSuggestedPlaces(userInterestsList[1].category, userInterestsList[1].categoryTitle, 6)
        // }
        // // 3 preferences ? load 4 suggestions per preference
        // else if (userInterestsList.length === 3) {
        //     getSuggestedPlaces(userInterestsList[0].category, userInterestsList[0].categoryTitle, 4)
        //     getSuggestedPlaces(userInterestsList[1].category, userInterestsList[1].categoryTitle, 4)
        //     getSuggestedPlaces(userInterestsList[2].category, userInterestsList[2].categoryTitle, 4)
        // }

    }, [])

    const delayGetSuggestedPlaces = async (userInterestsList) => {
        // bool true selected for delay parameter
        let data = []
        let first = ""
        let second = ""
        let third = ""
        if (userInterestsList.length === 1) {
            // 1 preference ? load 12 suggestions for that one preference
            data = await getSuggestedPlaces(userInterestsList[0].category, userInterestsList[0].categoryTitle, 12, true)
        } else if (userInterestsList.length === 2) {
            // 2 preferences ? load 6 suggestions per preference
            first = await quickGetSuggestedPlaces(userInterestsList[0].category, userInterestsList[0].categoryTitle, 6)
            second = await quickGetSuggestedPlaces(userInterestsList[1].category, userInterestsList[1].categoryTitle, 6)
            // data = first.concat(second)

            // getting rid of repeated place objects from different categories
            let lists = [first, second]
            let placeAddresses = []
            data = []
            for (let i = 0; i < lists.length; i++) {
                for (let j = 0; j < lists[i].length; j++) {
                    if (!placeAddresses.includes(lists[i][j].properties.formatted)) {
                        data.push(lists[i][j])
                    }
                    placeAddresses.push(lists[i][j].properties.formatted)
                }
            }

        } else if (userInterestsList.length === 3) {
            // 3 preferences ? load 4 suggestions per preference
            first = await quickGetSuggestedPlaces(userInterestsList[0].category, userInterestsList[0].categoryTitle, 4)
            second = await quickGetSuggestedPlaces(userInterestsList[1].category, userInterestsList[1].categoryTitle, 4)
            third = await quickGetSuggestedPlaces(userInterestsList[2].category, userInterestsList[2].categoryTitle, 4)
            // console.log(first)
            // data = first.concat(second)
            // data = data.concat(third)


            // getting rid of repeated place objects from different categories
            let lists = [first, second, third]
            let placeAddresses = []
            data = []
            for (let i = 0; i < lists.length; i++) {
                for (let j = 0; j < lists[i].length; j++) {
                    if (!placeAddresses.includes(lists[i][j].properties.formatted)) {
                        data.push(lists[i][j])
                    }
                    placeAddresses.push(lists[i][j].properties.formatted)
                }
            }


        }

        // data is list of all compiled places
        console.log(data)
        // console.log(userInterests)
        data.sort((a, b) => a.properties.distance - b.properties.distance)
        updateSuggestedPlaces(data)

        return "done"
    }



    const getSearchData = async () => {
        if (searchText.length < 2) {
            // console.log('')
        } else {
            const apiKey = "3e9f6f51c89c4d3985be8ab9257924fe"
            let url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${searchText}&bias=countrycode:${country.toLowerCase()}&limit=5&format=json&filter=countrycode:${country.toLowerCase()}&apiKey=${apiKey}`
            // console.log(url)
            const response = await axios.get(url)
            return response.status === 200 ? response.data : null
            // proximity:
        }
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
        let currentTripCopy = { ...currentTrip }
        currentTripCopy.places = []
        setCurrentTrip(currentTripCopy)
    }

    const sendPlaces = async () => {
        let currentTripCopy = { ...currentTrip }
        currentTripCopy.itinerary = null
        setCurrentTrip(currentTripCopy)

        setIsLoading(true)
        let places_serial = {}
        let placesLast = places.length
        for (let i = 0; i < places.length; i++) {
            places_serial[i + 1] = { id: i + 1, ...places[i] }
        }
        let data = {
            tripId: currentTrip.tripID,
            placesLast: placesLast,
            places_serial: places_serial,
        }
        console.log(data)
        const response = axios.post(`https://routewise-backend.onrender.com/itinerary/createdays/${currentTrip.tripID}`, JSON.stringify(data), {
            headers: { "Content-Type": "application/json" }
        }).then((response) => createItinerary(response))
            .catch((error) => {
                console.log(error)
                setIsLoading(false)
                alert('Something went wrong. Please try again')
            })

    }



    const createItinerary = (response) => {
        let currentTripCopy = { ...currentTrip }
        currentTripCopy["itinerary"] = response.data
        console.log(response.data)
        console.log(currentTripCopy)
        setCurrentTrip(currentTripCopy)
        // updateCont()
        // setIsLoading(false)
    }

    const showCurrentTrip = () => {
        console.log(currentTrip)
        console.log(country, bias)
    }
    const togglePopUp = (index) => {
        let popUp = document.getElementById(`popUp-${index}`)
        popUp.classList.toggle('d-none')
    }

    const [isLoading, setIsLoading] = useState(false);
    const stopLoading = () => {
        setIsLoading(false)
    }

    const checkPTC = () => {
        console.log(placeToConfirm)
    }

    const showResult = (result) => {
        console.log(result)
    }

    const toggleSuggestedPlacesInfo = (panel) => {
        if (panel) {
            let suggestPlacesInfo = document.getElementById('suggestedPlacesInfo-panel')
            if (suggestPlacesInfo.classList.contains('d-none')) {
                suggestPlacesInfo.classList.remove('d-none')
            } else {
                suggestPlacesInfo.classList.add('d-none')
            }
        } else {
            let suggestPlacesInfo = document.getElementById('suggestedPlacesInfo')
            if (suggestPlacesInfo.classList.contains('d-none')) {
                suggestPlacesInfo.classList.remove('d-none')
            } else {
                suggestPlacesInfo.classList.add('d-none')
            }
        }
    }

    const placeCardsSizeUp = () => {
        let placeCards = document.getElementById('placeCards')
        placeCards.classList.add('h540')
    }
    const placeCardSizeDown = () => {
        let placeCards = document.getElementById('placeCards')
        placeCards.classList.add('h540')
    }

    const openSuggestedPlacesPanel = () => {
        if (suggestedPlaces.length === 0) {
            let suggestedPanel = document.getElementById('suggestedPanel')
            suggestedPanel.style.transform = 'translateY(200px)'
        } else {
            let suggestedPanel = document.getElementById('suggestedPanel')
            suggestedPanel.style.transform = 'translateY(0px)'
        }
    }
    const closeSuggestedPlacesPanel = () => {
        let suggestedPanel = document.getElementById('suggestedPanel')
        suggestedPanel.style.transform = 'translateY(400px)'
    }


    // star places tooltip code
    const [starPlacesToolTipOpen, setStarPlacesToolTipOpen] = useState(false);
    const openStarPlacesToolTip = async () => {
        let uid = user ? user.uid : "testUser"
        let firstDoc = await getDoc(doc(firestore, `firstTimeUser/${uid}`))
        let firstData = firstDoc.data()
        if (firstData) {
            // does user want tooltip on the first place added?
            if (firstData.firstPlaceAdded) {
                // open tooltip
                setStarPlacesToolTipOpen(true)
            }
        } else {
            setDoc(doc(firestore, `firstTimeUser/${uid}`), {
                firstPlaceAdded: true,
                firstSignIn: false
            })
            // open tooltip
            setStarPlacesToolTipOpen(true)
        }
        setFirstTimeOnPage(false)
    }

    const [selectedPlaceList, setSelectedPlaceList] = useState("Suggested")
    const [suggestedPlacesFilter, setSuggestedPlacesFilter] = useState(null)
    const updateSuggestedPlacesFilter = (num, categoryTitle) => {
        // let category = document.getElementById(`suggestedCategory-${num}`)
        if (categoryTitle === "All") {
            setSuggestedPlacesFilter(null)
        } else {
            setSuggestedPlacesFilter(categoryTitle)
        }
        for (let i = 0; i < userInterests.length + 1; i++) {
            let category = document.getElementById(`suggestedCategory-${i + 1}`)
            if (i + 1 === num) {
                category.classList.add('selected')
            } else {
                category.classList.remove('selected')
            }
        }
    }
    const [blacklist, setBlacklist] = useState([])
    const addToBlacklist = (categoryName) => {
        let blacklistCopy = [...blacklist]
        blacklistCopy.push(categoryName)
        setBlacklist(blacklistCopy)
        // console.log(blacklist)
    }
    const undoHidePlace = () => {
        let blacklistCopy = [...blacklist]
        blacklistCopy.pop()
        setBlacklist(blacklistCopy)
    }

    return (
        <>
            <StarPlacesToolTip open={starPlacesToolTipOpen} currentTrip={currentTrip} onClose={() => setStarPlacesToolTipOpen(false)} />
            <LoadingScreen open={isLoading} loadObject={"itinerary"} loadingMessage={"Please wait while your itinerary is generated..."} waitTime={10000} currentTrip={currentTrip} onClose={stopLoading} />

            <div className="page-container90 mt-4">
                <div className="tripFlow flx-r">
                    <Link to='/dashboard'><p className="m-0 purple-text">Create Trip</p></Link>
                    <span className="material-symbols-outlined">
                        arrow_right
                    </span>
                    <p className="m-0 purple-text bold700">Add Places</p>

                </div>
                {/* <Link to='/dashboard' className=''>
                    <span className="material-symbols-outlined v-tbott mr-2 purple-text">
                        arrow_back
                    </span>
                    <p className="inline large purple-text">Back</p>
                </Link> */}
                <p onClick={() => showCurrentTrip()} className="page-heading-bold m-0 mt-3">Search and add places to your trip to <span className="purple-text">{currentTrip.city ? currentTrip.city : "*city*"}</span></p>
                <div className="flx-r mb-2 align-c gap-2">
                    <span className="material-symbols-outlined o-50">
                        calendar_month
                    </span>
                    <div className="dateBox my-1 font-jakarta px-2">{currentTrip.startDate ? currentTrip.startDate + " - " + currentTrip.endDate : <p className="m-0">Dec 7, 23 &nbsp; - &nbsp; Dec 11, 23</p>}</div>
                    <div className="dateBox my-1 font-jakarta px-2 mx-1"><span className="">{currentTrip.tripDuration ? currentTrip.tripDuration : "4"}</span>&nbsp;days</div>
                    <p className="m-0 purple-text">Edit</p>
                </div>
                <div className="flx-r onHover-fadelite d-none">
                    <p className="mt-1 mb-3 purple-text"><span className="material-symbols-outlined v-bott mr-2 purple-text">
                        add
                    </span>Add hotel or other accommodation***</p>
                </div>
                <div className="body-section flx-r-respond">
                    <div className="map-section flx-5">
                        <div className="gray-box-respond position-relative flx">

                            <div className="searchBar position-absolute w-100 z-10000">
                                <div className="position-relative w-100 h-100">
                                    <div id='autocomplete-container' className="mapSearch-dropdown flx-c">
                                        {/* <div className="inner-box w-96 m-auto h-100 pt-1 flx-c hideOverflow"> */}
                                        {auto ? auto.map((result, i) => {

                                            return result.name ? <div key={i} onClick={() => addPlaceToConfirm(result)} className="result ws-nowrap onHover-option">
                                                <div className="inner-contain flx-r w-96 hideOverflow m-auto">
                                                    <img src="https://i.imgur.com/ukt1lYj.png" alt="" className="small-pic mr-1" />
                                                    <p className="m-0 my-2 large-respond">{result.formatted}</p>
                                                </div>
                                            </div> : null
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

                            {placeToConfirm &&
                                <div className="placeToConfirmCard position-absolute">
                                    <div className="placeCard-PTC w-97 position-relative flx-r my-2">
                                        <span onClick={() => clearPlaceToConfirm()} className="closeBtn-PTC material-symbols-outlined position-absolute showOnHover x-large color-gains">
                                            close
                                        </span>

                                        <div className="placeCard-img-div flx-1">
                                            <img className="placeCard-img" src={placeToConfirm.imgURL} />
                                        </div>
                                        <div className="placeCard-body flx-2">
                                            <div onClick={() => togglePopUp('PTC')} id='popUp-PTC' className="popUp d-none position-absolute">{placeToConfirm.info}</div>
                                            <p className="body-title">{placeToConfirm.placeName}</p>
                                            <p onClick={() => togglePopUp('PTC')} className="body-info pointer mb-1">{placeToConfirm.info}</p>
                                            <p className="body-address-PTC m-0">{placeToConfirm.address}</p>
                                            <div onClick={() => addPlace()} className="flx-r right pr-4 onHover-fadelite ">
                                                <div className="addIcon-small flx pointer mx-2">
                                                    <span className="material-symbols-outlined m-auto medium purple-text">
                                                        add
                                                    </span>
                                                </div>
                                                <div className="flx">
                                                    <p className="purple-text page-text m-auto">Add to places</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            <OpenMap mapCenter={bias} markers={markers} />

                        </div>
                    </div>



                    <div className="places-list flx-c flx-4">
                        <div className="mt-4-respond1024">
                            <div className="placesLists flx-r gap-6">
                                <p onClick={() => setSelectedPlaceList("Added")} className={`${selectedPlaceList === "Added" ? "selectedPlaceList" : "unselectedPlaceList"} page-subsubheading-bold m-0`}>Added places ({places.length})</p>
                                <p onClick={() => setSelectedPlaceList("Suggested")} className={`${selectedPlaceList === "Suggested" ? "selectedPlaceList" : "unselectedPlaceList"} page-subsubheading-bold m-0`}>Suggested places</p>
                            </div>

                            {selectedPlaceList === "Added" &&
                                <>
                                    <p onClick={() => clearAllPlaces()} className="my-2 purple-text pointer z-1 right-text bold500">Clear list</p>
                                    <div className={`placeCards ${places.length > 0 ? "h482" : null}`}>
                                        <Scrollbars autoHide>

                                            {Array.isArray(places) && places.length > 0 ? places.map((place, index) => {
                                                return <div key={index} className="placeCard2 position-relative flx-r my-2">

                                                    <div className="placeCard-img-div flx-3">
                                                        <img className="placeCard2-img" src={place.imgURL} />
                                                    </div>
                                                    <div className="placeCard-body flx-5">
                                                        <div onClick={() => togglePopUp(index)} id={`popUp-${index}`} className="popUp d-none">{place.info}</div>
                                                        <p className="body-title ">{place.placeName}</p>
                                                        <p onClick={() => togglePopUp(index)} className="body-info pointer">{place.info}</p>
                                                        <p className="body-address">{place.address}</p>
                                                    </div>
                                                    <div className="placeCard-starOrDelete flx-c just-sb align-c">

                                                        {place.favorite !== true ?
                                                            <img onClick={() => addStar(index)} id={`star-empty-${index}`} src="https://i.imgur.com/S0wE009.png" alt="" className="star-empty my-2" />
                                                            :
                                                            <img onClick={() => removeStar(index)} id={`star-full-${index}`} src="https://i.imgur.com/Tw0AsU7.png" alt="" className="star-full my-2" />
                                                        }
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
                                                    <p className="large bold700 my-1 o-50">Add some places</p>
                                                    <p className="m-0 w-60 center-text o-50 addPlace-text">Use the search bar on the map to add places that you want to go</p>
                                                </div>
                                            }
                                        </Scrollbars>
                                        <div className="generate-btn-space w-100">
                                            <button onClick={() => sendPlaces()} className={`${places.length > 0 ? "btn-primaryflex" : "btn-primaryflex-disabled"} right-respond1024`}>Generate Itinerary</button>
                                        </div>
                                    </div>
                                </>
                            }

                            {selectedPlaceList === "Suggested" &&
                                <>
                                    {userInterests.length > 0 &&
                                        <div className="suggestedCategories flx-r gap-2 my-2">
                                            <div id='suggestedCategory-1' onClick={() => updateSuggestedPlacesFilter(1, "All")} className="dateBox px-2 pointer selected">All</div>
                                            {userInterests ? userInterests.map((interest, index) => {
                                                return <div key={index} id={`suggestedCategory-${index + 2}`} onClick={() => updateSuggestedPlacesFilter(index + 2, interest.categoryTitle)} className="dateBox px-2 pointer unselected">{interest.categoryTitle}</div>
                                            }) : null}

                                        </div>
                                    }
                                    <div className="flx-r align-r">
                                        {blacklist.length > 0 &&
                                        <div onClick={() => undoHidePlace()} className="flx-r align-c onHover-fadelite">
                                            <span className="material-symbols-outlined purple-text medium mr-1">
                                                undo
                                            </span>
                                            <p className="my-2 purple-text pointer small">Undo Hide</p>
                                        </div>
                                        }

                                        <Link to='/survey-update' className='position-right'><p className="m-0 purple-text pointer my-2">Update Travel Preferences</p></Link>
                                    </div>
                                    <div className={`placeCards ${suggestedPlaces.length > 0 ? "h482" : null}`}>
                                        <Scrollbars autoHide>
                                            {userInterests.length === 0 ?
                                                <div className="add-places-card">
                                                    <span className="material-symbols-outlined xx-large">
                                                        map
                                                    </span>
                                                    <p className="large bold700 my-1 o-50">0 suggested places</p>
                                                    <p className="m-0 w-60 center-text o-50 addPlace-text">Update travel preferences to get place suggestions</p>
                                                </div> : null}
                                            {userInterests.length > 0 && suggestedPlaces.length === 0 &&
                                                <>
                                                    <div className="loadingBox-inline">
                                                        <Loading noMascot={true} innerText={"Loading..."} />
                                                    </div>
                                                </>
                                            }


                                            {suggestedPlaces.length > 0 &&
                                                suggestedPlaces.map((place, index) => {
                                                    let suggestedPlace = place.properties
                                                    let id = 'suggested-' + index
                                                    let filter = suggestedPlacesFilter ? suggestedPlacesFilter : false
                                                    let blacklisted = false
                                                    if (blacklist.includes(suggestedPlace.name)) {
                                                        blacklisted = true
                                                    }
                                                    if (!suggestedPlacesFilter) {
                                                        return suggestedPlace.name && !blacklisted ? <div key={index} className="placeCard2 position-relative flx-r my-2">

                                                            <div className="placeCard-img-div flx-3">
                                                                <img className="placeCard2-img" src={suggestedPlace.imgUrl} />
                                                            </div>
                                                            <div className="placeCard-body flx-5">
                                                                {/* <div onClick={() => togglePopUp(id)} id={`popUp-${id}`} className="popUp d-none">{suggestedPlace.categoryTitle}</div> */}
                                                                <p className="body-title ">{suggestedPlace.name}</p>
                                                                <p className="body-info pointer">{suggestedPlace.categoryTitle}</p>
                                                                <p className="body-address">{suggestedPlace.address_line2}</p>
                                                            </div>
                                                            <div className="placeCard-starOrDelete flx-c just-sb align-c">

                                                                <div onClick={() => addPlaceToList(suggestedPlace)} className="addIcon-small flx pointer mx-2 mt-2 onHover-fadelite">
                                                                    <span className="material-symbols-outlined m-auto medium purple-text">
                                                                        add
                                                                    </span>
                                                                </div>

                                                                <span onClick={() => addToBlacklist(suggestedPlace.name)} className="material-symbols-outlined mx-3 my-2 onHover-50 pointer">
                                                                    visibility_off
                                                                </span>
                                                            </div>
                                                        </div> : null
                                                    } else {
                                                        if (suggestedPlace.categoryTitle === filter) {

                                                            return suggestedPlace.name && !blacklisted ? <div key={index} className="placeCard2 position-relative flx-r my-2">

                                                                <div className="placeCard-img-div flx-3">
                                                                    <img className="placeCard2-img" src={suggestedPlace.imgUrl} />
                                                                </div>
                                                                <div className="placeCard-body flx-5">
                                                                    {/* <div onClick={() => togglePopUp(id)} id={`popUp-${id}`} className="popUp d-none">{suggestedPlace.categoryTitle}</div> */}
                                                                    <p className="body-title ">{suggestedPlace.name}</p>
                                                                    <p className="body-info pointer">{suggestedPlace.categoryTitle}</p>
                                                                    <p className="body-address">{suggestedPlace.address_line2}</p>
                                                                </div>
                                                                <div className="placeCard-starOrDelete flx-c just-sb align-c">

                                                                    <div onClick={() => addPlaceToList(suggestedPlace)} className="addIcon-small flx pointer mx-2 mt-2 onHover-fadelite">
                                                                        <span className="material-symbols-outlined m-auto medium purple-text">
                                                                            add
                                                                        </span>
                                                                    </div>

                                                                    <span className="material-symbols-outlined mx-3 my-2 onHover-50 pointer">
                                                                        visibility_off
                                                                    </span>
                                                                </div>
                                                            </div> : null
                                                        }
                                                    }

                                                })}
                                        </Scrollbars>
                                    </div>

                                </>
                            }

                        </div>
                    </div>

                </div>
            </div>

            <div className="empty-2"></div>
            <div className="empty-2"></div>
            <div className="empty-2"></div>
            <div className="empty-1"></div>

        </>
    )
}
