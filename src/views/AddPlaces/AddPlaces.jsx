import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Scrollbars from 'react-custom-scrollbars-2'
import { LoadingScreen } from '../../components/Loading/LoadingScreen'
import { Loading } from '../../components/Loading/Loading'
import { DataContext } from '../../Context/DataProvider'
import StarPlacesToolTip from '../../components/StarPlacesToolTip'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, firestore } from '../../firebase'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal'
import GoogleMapBox from '../../components/GoogleMap/GoogleMapBox'
import PlaceToConfirmCard from '../../components/PlaceToConfirmCard'
import PlaceCard from '../../components/PlaceCard'
import SuggestedPlaceCard from '../../components/PlaceCards/SuggestedPlaceCard/SuggestedPlaceCard'
import LoadingFillElement from '../../components/Loading/LoadingFillElement'
import './addplaces.scoped.css';
import NavigationTabs from '../../components/NavigationTabs/NavigationTabs'


export const AddPlaces = ({ selectedPlacesListOnLoad }) => {
    // Send Kate Data
    const {
        user, setUser, textFunctions,
        userPreferences, currentTrip, setCurrentTrip, clearCurrentTrip,
        setSignUpIsOpen, setAuthIndex, mapBoxCategoryKey, mobileMode, mobileModeNarrow,
        geoToLatLng, gIcon
    } = useContext(DataContext);
    const [firstTimeOnPage, setFirstTimeOnPage] = useState(true);
    const navigate = useNavigate();
    const [places, setPlaces] = useState(currentTrip.places.length > 0 ? currentTrip.places : []);
    const [placeToConfirm, setPlaceToConfirm] = useState(null);
    const [placeToConfirmAnimation, setPlaceToConfirmAnimation] = useState(false);
    useEffect(() => {
        if (placeToConfirm) {
            wait(100).then(() => {
                setPlaceToConfirmAnimation(true);
            })
        } else {
            setPlaceToConfirmAnimation(false);
        }
    }, [placeToConfirm]);

    const [markers, setMarkers] = useState({});
    const [newPlaceMarker, setNewPlaceMarker] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [mapCenter, setMapCenter] = useState(currentTrip.geocode ? { lat: currentTrip.geocode[0], lng: currentTrip.geocode[1] } : { lat: 51.50735, lng: -0.12776 });
    const [mapCenterToggle, setMapCenterToggle] = useState(false);
    const [country, setCountry] = useState(currentTrip.country_2letter ? currentTrip.country_2letter : 'gb');
    // const [suggestedPlaces, setSuggestedPlaces] = useState([]);
    const { suggestedPlaces, topSites } = useContext(DataContext);
    const [auto, setAuto] = useState([]);

    // date functions
    const datinormal = (systemDate) => {
        let day = systemDate.getDate().toString().length === 1 ? "0" + systemDate.getDate() : systemDate.getDate()
        let month = systemDate.getMonth().toString().length + 1 === 1 ? "0" + (systemDate.getMonth() + 1) : systemDate.getMonth() + 1
        if (month.toString().length === 1) {
            month = "0" + month
        }
        // console.log(month)
        let fullYear = systemDate.getFullYear()
        // console.log(month+"/"+day+"/"+fullYear)
        return month + "/" + day + "/" + fullYear
    }
    const datify = (normalDate) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let day = normalDate.slice(3, 5)
        let monthNum = normalDate.slice(0, 2)
        if (monthNum.charAt(0) === "0") {
            monthNum = monthNum[1]
        }
        let fullYear = normalDate.slice(6)
        const month = months[monthNum - 1]
        if (day.charAt(0) === "0") {
            day = day[1]
        }
        let twoYear = fullYear.slice(2)
        return month + " " + day + ", " + twoYear
    }
    // from slash or normal date to dash date
    const datidash = (mmddyyyy) => {
        let year = mmddyyyy.slice(6)
        let month = mmddyyyy.slice(0, 2)
        let day = mmddyyyy.slice(3, 5)
        return year + "-" + month + "-" + day
    }
    // from dash date to slash or normal date
    const datiundash = (dashDate) => {
        let fullyear = dashDate.slice(0, 4)
        let month = dashDate.slice(5, 7)
        let day = dashDate.slice(8)
        return month + "/" + day + "/" + fullyear
    }

    const firstRender = useRef(true);
    const secondRender = useRef(true);

    // useEffect(() => {
    // getSearchData()
    // console.log(searchText)
    // }, [searchText])

    useEffect(() => {
        console.log(currentTrip)
    }, [])

    useEffect(() => {
        updateMarkers()
    }, [places, placeToConfirm])
    const updateMarkers = () => {
        let placesCopy = [...places];
        let markersObj = {};
        for (let i = 0; i < placesCopy.length; i++) {
            let place = placesCopy[i];
            markersObj[place.id] = {
                id: place.id,
                placeName: place.placeName,
                position: geoToLatLng(place.geocode),
                isPlaceToConfirm: false,
                infoWindowOpen: false,
                dayId: null,
            }
        }
        if (placeToConfirm) {
            markersObj[0] = {
                id: 0,
                placeName: placeToConfirm.placeName,
                position: geoToLatLng(placeToConfirm.geocode),
                isPlaceToConfirm: true,
                infoWindowOpen: false,
                dayId: null,
            }
        }
        setMarkers(markersObj);
    }

    // useEffect(() => {
    //     let placeCopy = [...places];
    //     if (placeToConfirm) {
    //         setNewPlaceMarker(placeToConfirm);
    //     } else {
    //         setNewPlaceMarker(null);
    //     }
    //     setMarkers(placeCopy)
    // }, [placeToConfirm, places])


    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
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

    // const getCityImg = async (imgQuery) => {
    //     try {
    //         const response = await axios.get(`https://api.unsplash.com/search/photos/?client_id=S_tkroS3HrDo_0BTx8QtZYvW0IYo0IKh3xNSVrXoDxo&query=${imgQuery}`)
    //         return response.status === 200 ? response.data : "error"
    //     }
    //     catch (error) {
    //         console.log("getCityImg error!")
    //         return getCityImg2(imgQuery)
    //     }
    // }
    // const getCityImg2 = async (imgQuery) => {
    //     try {
    //         const response = await axios.get(`https://api.unsplash.com/search/photos/?client_id=yNFxfJ53K-d6aJhns-ssAkH1Xc5jMDUPLw3ATqWBn3M&query=${imgQuery}`)
    //         return response.status === 200 ? response.data : "error"
    //     }
    //     catch (error) {
    //         console.log("getCityImg2 error!")
    //         return "https://i.imgur.com/QsPqFMb.png"
    //     }

    // }
    // const loadCityImg = async (imgQuery) => {
    //     const data = await getCityImg(imgQuery)
    //     console.log(data);
    //     // console.log(data, imgQuery)
    //     if (typeof data === "string") {
    //         return data
    //     } else if (data.total === 0) {
    //         return "none"
    //     } else {
    //         // console.log(data.results[0].urls.regular)
    //         return data.results[0].urls.regular
    //     }
    // }

    const getPlaceDetails = async (placeDetailsQuery) => {
        const response = await axios.get(`https://api.geoapify.com/v2/place-details?&id=${placeDetailsQuery}&apiKey=3e9f6f51c89c4d3985be8ab9257924fe`)
        return response.status === 200 ? response.data : "error"
        // GET --> get info
        // POST --> change info (update) on the backend
        // 404 --- not found
        // 500 --- internal server 
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
        removeMarker(null, true);
    };

    /** 
     * @param place placeObj
     * @param isPlaceToConfirm boolean
     */
    const addMarker = (place, isPlaceToConfirm) => {
        const markerObj = {
            id: isPlaceToConfirm ? 0 : place.id,
            placeName: place.placeName,
            position: geoToLatLng(place.geocode),
            isPlaceToConfirm: isPlaceToConfirm,
            infoWindowOpen: false,
            dayId: null,
        }
        let markersCopy = { ...markers };
        markersCopy[markerObj.id] = markerObj;
        console.log(markersCopy)
        setMarkers(markersCopy);
    }
    /**
     * @param place placeObj, you can use null if placeToConfirm
     * @param isPlaceToConfirm boolean
     */
    const removeMarker = (place, isPlaceToConfirm) => {
        let markersCopy = { ...markers };
        if (isPlaceToConfirm) {
            delete markersCopy[0]

        } else {
            delete markersCopy[place.id]
        }
        setMarkers(markersCopy);
    }

    const addPlaceToConfirm = async (place) => {
        // clearPlaceToConfirm();
        setPlaceToConfirm(place);
        // addMarker(place, true)
        updateMapCenter(place.geocode);
    };

    const addPlace = async (place) => {
        // let imgQuery = place.name.replace(/ /g, '-')
        // let placeInfo = await loadPlaceDetails(place.place_id)
        // let imgUrl = await loadCityImg(imgQuery)
        let placesCopy = [...places]
        let newPlace = {};
        // console.log(placeToConfirm)
        // console.log(place)
        if (place) {
            newPlace = { ...place, favorite: false, id: placesCopy.length + 1 }
        } else {
            newPlace = { ...placeToConfirm, id: placesCopy.length + 1 }
        }
        // let place_id = await addPlaceInDB(newPlace)
        console.log("new place:", newPlace)

        if (currentTrip.tripID) {

            // add place in database
            let disposition_hosted = "https://routewise-backend.onrender.com"
            let disposition_local = "http://localhost:5000"
            let url = `${disposition_hosted}/places/add-get-place/${currentTrip.tripID}`
            const response = await axios.post(url, newPlace, {
                headers: { "Content-Type": "application/json" }
            }).then((response) => {
                setShowPlaceAddedBox(true);

                console.log("response:", response.data)
                let place_id = response.data
                newPlace = { ...newPlace, place_id: place_id }
                console.log("new Place after db:", newPlace)

                placesCopy.push(newPlace)
                console.log("new places", placesCopy)
                setPlaces(placesCopy)
                let currentTripCopy = { ...currentTrip }
                currentTripCopy.places.push(newPlace)
                // currentTripCopy.places = places
                setCurrentTrip(currentTripCopy)
                clearPlaceToConfirm()
                setScrollDownStandby(true)
                if (firstTimeOnPage) {
                    openStarPlacesToolTip()
                }


            }).catch((error) => {
                console.log(error)
            })
        } else {
            // if just navigating site without login
            setShowPlaceAddedBox(true);

            placesCopy.push(newPlace)
            console.log("new places", placesCopy)
            setPlaces(placesCopy)
            let currentTripCopy = { ...currentTrip }
            currentTripCopy.places.push(newPlace)
            // currentTripCopy.places = places
            setCurrentTrip(currentTripCopy)
            clearPlaceToConfirm()
            setScrollDownStandby(true)
            if (firstTimeOnPage) {
                openStarPlacesToolTip()
            }

        }

    }

    const [showPlaceAddedBox, setShowPlaceAddedBox] = useState(false);


    const addPlaceInDB = async (trip) => {

        let url = `https://routewise-backend.onrender.com/places/add-get-place/${currentTrip.tripID}`
        const response = await axios.post(url, data, {
            headers: { "Content-Type": "application/json" }
        }).then((response) => {
            return response.data
        }).catch((error) => {
            console.log(error)
        })
    }
    const placeCardRefs = useRef([]);
    useEffect(() => {
        // console.log(placeCardRefs.current)
        // console.log(cardBodyRef)
        // if (placeCardRefs.current) {
        //     placeCardRefs.current = placeCardRefs.current.slice(0, places.length);
        // } 
    }, [places])
    const removePlace = async (index) => {
        console.log(placeCardRefs.current[index])
        placeCardRefs.current[index].classList.remove("shown")
        let placeholder = ""
        if (index === 0) {
            placeholder = document.getElementById(`placeholderBefore-${index + 1}`)
        } else {
            placeholder = document.getElementById(`placeholderAfter-${index - 1}`)
        }

        wait(300).then(async () => {

            let placesCopy = [...places]
            let currentTripCopy = { ...currentTrip }

            if (places[index].place_id) {
                let place_id = places[index].place_id
                // console.log(place_id)
                let url = `https://routewise-backend.onrender.com/itinerary/delete-place/${place_id}`
                const response = await axios.delete(url)
                    .then((response) => {
                        console.log(response.data)
                        placesCopy.splice(index, 1)
                        for (let i = 0; i < placesCopy.length; i++) {
                            let place = placesCopy[i];
                            place.id = i + 1
                        }
                        setPlaces(placesCopy)
                        currentTripCopy.places = placesCopy;
                        // currentTripCopy.places.splice(index, 1)
                        setCurrentTrip(currentTripCopy)
                        // try {
                        //     placeCardRefs.current[index].classList.add("shown")
                        //     placeholder.classList.remove("hidden")
                        //     wait(100).then(() => {
                        //         placeholder.classList.add("hidden")
                        //     })
                        // }
                        // catch {

                        // }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } else {
                // places being updated without user sign in
                placesCopy.splice(index, 1)
                for (let i = 0; i < placesCopy.length; i++) {
                    let place = placesCopy[i];
                    place.id = i + 1
                }
                currentTripCopy.places = placesCopy
                setPlaces(placesCopy);
                setCurrentTrip(currentTripCopy)
                // try {
                //     placeCardRefs.current[index].classList.add("shown")
                //     placeholder.classList.remove("hidden")
                //     wait(100).then(() => {
                //         placeholder.classList.add("hidden")
                //     })
                // }
                // catch {

                // }
            }
            placeCardRefs.current[index].classList.add("shown")


        })
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

    const [clearPlacesLoading, setClearPlacesLoading] = useState(false);
    const clearAllPlaces = async () => {
        if (currentTrip.tripID) {
            const dispo_local = "http://localhost:5000";
            const dispo_hosted = "https://routewise-backend.onrender.com";
            let url = `${dispo_hosted}/itinerary/delete-all-places/${currentTrip.tripID}`
            let data = {
                uid: auth.currentUser.uid
            };
            setClearPlacesLoading(true);
            // const response = await axios.delete(url, {
            //     headers: { "Content-Type": "application/json" },
            //     data: data,
            // })
            const response = await axios.delete(url)
                .then((response) => {
                    console.log("successfully cleared places")
                    if (response.status === 200) {
                        setPlaces([]);
                        setCurrentTrip({ ...currentTrip, places: [] });
                        setClearPlacesLoading(false);
                    } else {
                        console.log(response)
                        alert("Action failed. Please try again.");
                        setClearPlacesLoading(false);
                    };
                })
                .catch((error) => {
                    console.log("failed to clear places")
                    console.log(error);
                    alert("Action failed. Please try again.");
                    setClearPlacesLoading(false);
                })
        };
    }

    const sendPlaces = async () => {
        // itinerary handled by communicating with Backend, loadingScreen (from isLoading) pulls up 
        // and waits for itinerary to be set, createItinerary func in the bg waiting for itinerary to be set, once iti is set loadingscreen navigates to iti page anthen response shuttled thru createItinerary func
        // 
        if (places.length > 0) {
            // reset itinerary
            let currentTripCopy = { ...currentTrip }
            currentTripCopy.itinerary = null
            setCurrentTrip(currentTripCopy)

            setIsLoading(true)
            // let places_serial = {}
            // let placesLast = places.length
            // for (let i = 0; i < places.length; i++) {
            //     places_serial[i + 1] = { id: i + 1, ...places[i] }
            // }
            // let data = {
            //     tripId: currentTrip.tripID,
            //     placesLast: placesLast,
            //     places_serial: places_serial,
            // }
            // console.log(data)
            console.log("this is the trip id! = " + currentTrip.tripID)
            const response = await axios.get(`https://routewise-backend.onrender.com/itinerary/createdays/${currentTrip.tripID}`)
                .then((response) => {
                    createItinerary(response)
                    navigate('/itinerary')
                })
                .catch((error) => {
                    console.log(error)
                    setIsLoading(false)
                    alert('Something went wrong. Please try again')
                })

        }
    }

    const createItinerary = (response) => {
        let currentTripCopy = { ...currentTrip }
        currentTripCopy["itinerary"] = response.data
        currentTripCopy["itineraryFirstLoad"] = true
        console.log(response.data)
        console.log(currentTripCopy)
        setCurrentTrip(currentTripCopy)
        // updateCont()
        // setIsLoading(false)
    }

    const showCurrentTrip = () => {
        console.log(currentTrip)
        console.log(country, mapCenter)
    }
    const togglePopUp = (index) => {
        let popUp = document.getElementById(`popUp-${index}`)
        popUp.classList.toggle('d-none')
    }

    const [isLoading, setIsLoading] = useState(false);
    const stopLoading = () => {
        setIsLoading(false)
    };

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


    // [places lists code]
    const [selectedPlacesList, setSelectedPlacesList] = useState(selectedPlacesListOnLoad ?? "Top sites");
    const [navigationIndex, setNavigationIndex] = useState(0);
    const beamRef = useRef(null);
    // notifications
    const [notifications, setNotifications] = useState({
        topSites: {
            isShowing: false,
            isJumping: false,
        },
        suggestedPlaces: {
            isShowing: false,
            isJumping: false,
        },
        addedPlaces: {
            isShowing: false,
            isJumping: false,
        },
    });
    const notificationFunctions = {
        showNotification: function (placeList) {
            setNotifications({
                ...notifications,
                [placeList]: {
                    isShowing: true,
                    isJumping: false,
                },
            });
        },
        jumpNotification: function (placeList) {
            setNotifications({
                ...notifications,
                [placeList]: {
                    isShowing: true,
                    isJumping: true,
                },
            });
            wait(500).then(() => {
                notificationFunctions.resetJumpNotification(placeList);
            });
        },
        hideNotification: function (placeList) {
            setNotifications({
                ...notifications,
                [placeList]: {
                    isShowing: false,
                    isJumping: false,
                },
            });
        },
        resetJumpNotification: function (placeList) {
            setNotifications({
                ...notifications,
                [placeList]: {
                    isShowing: true,
                    isJumping: false,
                },
            });
        },
    };
    useEffect(() => {
        if (places.length > 0 && selectedPlacesList !== "Added Places") {
            if (notifications.addedPlaces.isShowing) {
                notificationFunctions.jumpNotification("addedPlaces");
            } else {
                notificationFunctions.showNotification("addedPlaces");
            };
        };
    }, [places]);
    useEffect(() => {
        if (selectedPlacesList === "Added Places") {
            notificationFunctions.hideNotification("addedPlaces");
        };
    }, [selectedPlacesList]);
    useEffect(() => {
        console.log(notifications)
    }, [notifications])


    // suggested places
    const [suggestedPlacesFilter, setSuggestedPlacesFilter] = useState(null);
    const updateSuggestedPlacesFilter = (num, categoryTitle) => {
        // let category = document.getElementById(`suggestedCategory-${num}`)
        if (categoryTitle === "All") {
            setSuggestedPlacesFilter(null);
        } else {
            setSuggestedPlacesFilter(categoryTitle);
        };

    };
    const [topSiteControls, setTopSiteControls] = useState({
        hiddenPlaces: [],
    });
    const topSiteFunctions = {
        confirmationAnimation: function (index) {
            let addedOverlay = document.getElementById(`added-${index}`);
            if (addedOverlay) {
                addedOverlay.classList.remove('hidden-o');
                wait(1200).then(() => {
                    addedOverlay.classList.add('hidden-o');
                });
            };
        },
        hidePlace: function (placeName) {
            let topSitesControlsCopy = { ...topSiteControls };
            topSitesControlsCopy.hiddenPlaces.push(placeName);
            setTopSiteControls(topSitesControlsCopy);
        },
        undoHidePlace: function () {
            let topSitesControlsCopy = { ...topSiteControls };
            topSitesControlsCopy.hiddenPlaces.pop();
            setTopSiteControls(topSitesControlsCopy);
        },
    };
    const [suggestedPlaceControls, setSuggestedPlaceControls] = useState({
        filter: null,
        hiddenPlaces: [],
    });
    const suggestedPlaceFunctions = {
        confirmationAnimation: function (index) {
            let addedOverlay = document.getElementById(`added-${index}`);
            if (addedOverlay) {
                addedOverlay.classList.remove('hidden-o');
                wait(1200).then(() => {
                    addedOverlay.classList.add('hidden-o');
                });
            };
        },
        hidePlace: function (placeName) {
            let suggestedPlacesControlsCopy = { ...suggestedPlaceControls };
            suggestedPlacesControlsCopy.hiddenPlaces.push(placeName);
            setSuggestedPlaceControls(suggestedPlacesControlsCopy);
        },
        undoHidePlace: function () {
            let suggestedPlacesControlsCopy = { ...suggestedPlaceControls };
            suggestedPlacesControlsCopy.hiddenPlaces.pop();
            setSuggestedPlaceControls(suggestedPlacesControlsCopy);
        },
        updateFilter: function () {
            let suggestedPlacesControlsCopy = { ...suggestedPlaceControls };
            if (categoryTitle === "All") {
                suggestedPlacesControlsCopy.filter(null);
            } else {
                suggestedPlacesControlsCopy.filter(categoryTitle);
            };
            setSuggestedPlaceControls(suggestedPlacesControlsCopy);
        },
    };
    // suggestedPlaceFunctions ? addToPlaces, addToItinerary, addToSaved, addToBlacklist, confirmationAnimation, hidePlace
    const [blacklist, setBlacklist] = useState([])
    const addToBlacklist = (placeName) => {
        let blacklistCopy = [...blacklist]
        blacklistCopy.push(placeName)
        setBlacklist(blacklistCopy)
        console.log(blacklist)
    }
    const undoHidePlace = () => {
        let blacklistCopy = [...blacklist]
        blacklistCopy.pop()
        setBlacklist(blacklistCopy)
    }

    const flashAdded = (index) => {
        let added = document.getElementById(`added-${index}`)

        added.classList.remove('hidden-o')

        wait(1200).then(() => {
            added.classList.add('hidden-o')
        });

    }
    const [scrollDownStandBy, setScrollDownStandby] = useState(false);
    const placesScrollBarRef = useRef(null);
    const scrollDown = (placesList) => {
        if (placesList === "addedPlaces" && placesScrollBarRef.current) {
            placesScrollBarRef.current.scrollToBottom()
        }
    }
    useEffect(() => {
        if (scrollDownStandBy) {
            scrollDown("addedPlaces");
            setScrollDownStandby(false);
        }
    }, [places])



    // added places render 'added to places' button
    const [placesAddressList, setPlacesAddressList] = useState([])
    const updatePlaceAddresses = () => {
        let placesAddressListCopy = []
        if (places.length > 0) {
            for (let i = 0; i < places.length; i++) {
                placesAddressListCopy.push(places[i].address)
            }
        } else {
            placesAddressListCopy = []
        }
        setPlacesAddressList(placesAddressListCopy)
    }

    useEffect(() => {
        updatePlaceAddresses()
    }, [places])

    const printAddedPlaceAddresses = () => {
        console.log(placesAddressList)
    }

    const [selectionRange, setSelectionRange] = useState([{
        startDate: currentTrip.startDate ? new Date(datiundash(currentTrip.startDate)) : new Date("11/08/2023"),
        endDate: currentTrip.endDate ? new Date(datiundash(currentTrip.endDate)) : new Date("11/11/2023"),
        key: "selection"
    }])
    const [sendDataStandby, setSendDataStandby] = useState({
        tripDates: false
    });


    const [calendarOpen, setCalendarOpen] = useState(false);
    const closeCalendar = () => {
        setCalendarOpen(false)
    }
    useEffect(() => {
        window.addEventListener('click', hideCalendarOnClickOutside, true)
    }, [])
    useEffect(() => {

        if (currentTrip.itinerary) {

            console.log("respond")
        }
        if (selectionRange.startDate !== currentTrip.startDate) {

        }
    }, [calendarOpen])

    const refCalendar = useRef(null);
    const hideCalendarOnClickOutside = (e) => {
        if (refCalendar.current && !refCalendar.current.contains(e.target)) {
            setCalendarOpen(false)
        }
    }


    // send new trip dates data to backend
    useEffect(() => {
        if (!firstRender.current) {
            // console.log("first render is false")
            if (!secondRender.current) {
                // console.log("second render is false")
                let sendDataStandbyCopy = { ...sendDataStandby }
                sendDataStandbyCopy.tripDates = true
                setSendDataStandby(sendDataStandbyCopy)
            }
            secondRender.current = false;
        }
        firstRender.current = false;
    }, [selectionRange])
    useEffect(() => {
        if (sendDataStandby.tripDates) {
            // send data to Kate
            console.log('send data now')
            updateTripDatesInDB(datidash(datinormal(selectionRange[0].startDate)), datidash(datinormal(selectionRange[0].endDate)))

            let sendDataStandbyCopy = { ...sendDataStandby }
            sendDataStandbyCopy.tripDates = false
            setSendDataStandby(sendDataStandbyCopy)
        } else {

        }
    }, [calendarOpen])


    const [itineraryUpdatedModalOpen, setItineraryUpdatedModalOpen] = useState(false);
    const updateTripDatesInDB = (startDate, endDate) => {
        console.log(currentTrip.startDate)
        console.log(currentTrip.endDate)

        let url = ""
        let data = {
            start_date: startDate === currentTrip.startDate ? null : startDate,
            end_date: endDate === currentTrip.endDate ? null : endDate
        }
        console.log(data)
        return "c"
        const response = axios.patch(url, data, {
            headers: { "Content-Type": "application/json" }
        }).then((response) => {
            console.log(response.data)
            console.log(response.data.message)
        }).catch((error) => {
            console.log(error)
        })
    }

    const printPlaces = () => {
        console.log(places)
    }
    const printCurrentTrip = () => {
        console.log(currentTrip)
    }



    // PLACE CARD TITLE ELLIPSIS RE-RENDER CODE
    const cardBodyRef = useRef(null);
    const suggestedCardBodyRef = useRef(null);
    const ptcCardBodyRef = useRef(null);
    const [placeCardTitleCharLimit, setPlaceCardTitleCharLimit] = useState(15);
    const [placeToConfirmCardTitleCharLimit, setPlaceToConfirmCardTitleCharLimit] = useState(0);
    const [suggestedCardTitleCharLimit, setSuggestedCardTitleCharLimit] = useState(0);
    const [charLimit, setCharLimit] = useState(18);
    const calculateCharLimit = (width, cardType) => {
        let extraPercent = (Math.floor((width - 213) / 6)) / 1000;
        let charLimit = Math.floor(width * (0.07 + extraPercent));
        // console.log(charLimit);
        return charLimit
    }
    useEffect(() => {
        if (cardBodyRef.current) {
            const observer = new ResizeObserver((entries) => {
                // console.log(entries)
                let width = entries[0].contentRect.width
                let charLimit = calculateCharLimit(width);
                if (charLimit !== 0) {
                    // if charLimit is 0 (due to deleted place) skip charLimit update
                    setPlaceCardTitleCharLimit(charLimit);
                }
            })
            observer.observe(cardBodyRef.current)
        }
    }, [places, selectedPlacesList])
    useEffect(() => {
        if (ptcCardBodyRef.current) {
            const observer = new ResizeObserver((entries) => {
                // console.log(entries)
                let width = entries[0].contentRect.width
                let charLimit = calculateCharLimit(width);
                setPlaceToConfirmCardTitleCharLimit(charLimit);
            })
            observer.observe(ptcCardBodyRef.current)
        }
    }, [placeToConfirm])
    useEffect(() => {
        if (suggestedCardBodyRef.current) {
            const observer = new ResizeObserver((entries) => {
                // console.log(entries)
                let width = entries[0].contentRect.width
                let charLimit = calculateCharLimit(width);
                setSuggestedCardTitleCharLimit(charLimit);
            })
            observer.observe(suggestedCardBodyRef.current)
        }
    }, [suggestedPlacesFilter, selectedPlacesList, suggestedPlaces])

    const scrollingAnim = () => {
        const scrollers = document.querySelectorAll(".scroller");
        const addAnimation = () => {
            scrollers.forEach((scroller) => {
                scroller.setAttribute("data-animated", true)
            })
        }

    }

    // [map code]
    const updateMapCenter = (geocode) => {
        // setMapCenter(geocode);
        setMapCenter(geoToLatLng(geocode));
        setMapCenterToggle(!mapCenterToggle);
    }

    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);


    const [navigationTabs, setNavigationTabs] = useState([
        {
            tabName: "Top Sites",
            conciseTabName: "Top",
            tabPlaceList: "Top sites",
        },
        {
            tabName: "Suggested Places",
            conciseTabName: "Suggested",
            tabPlaceList: "Suggested Places",
        },
        {
            tabName: "Added Places",
            conciseTabName: "Added",
            tabPlaceList: "Added Places",
            quantity: 0,
        },
    ]);
    const placesListRef = useRef(null);


    return (
        <>
            {/* <ItineraryUpdatedModal open={itineraryUpdatedModalOpen} onClose={() => setItineraryUpdateModalOpen(false)} /> */}
            <ConfirmationModal open={confirmationModalOpen} questionText={"Clear list?"} descText={"This action cannot be reversed."} confirmAction={() => clearAllPlaces()} onClose={() => setConfirmationModalOpen(false)} />
            <StarPlacesToolTip open={starPlacesToolTipOpen} currentTrip={currentTrip} onClose={() => setStarPlacesToolTipOpen(false)} />
            <LoadingScreen open={isLoading} loadingMessage={"Please wait..."} waitTime={10000} currentTrip={currentTrip} onClose={stopLoading} />

            <div className="page-container90 mt-4">

                <div className="tripFlow flx-r align-c">
                    <Link to='/dashboard'><p className="m-0 purple-text">Create Trip</p></Link>
                    <span className="material-symbols-outlined">
                        arrow_right
                    </span>
                    <p className="m-0 purple-text bold700">Add Places</p>


                </div>
            </div>

            <div className={`page-container90 ${!mobileMode && "vh-100"} flx-c`}>
                <div className={`add-places-title-row ${mobileMode ? "flx-c mobile" : "flx-r align-c gap-8"}`}>

                    <p onClick={() => { printPlaces(); printCurrentTrip(); scrollDown() }} className="page-subsubheading-bold m-0">Search and add places to your trip to <span className="purple-text">{currentTrip.city ? currentTrip.city : "*city*"}</span></p>
                    <div className={`tripInfo flx-r align-c ${mobileModeNarrow ? "gap-1" : "gap-2"} position-relative`}>
                        <span className={`material-symbols-outlined o-50 ${mobileModeNarrow && "larger"}`}>
                            calendar_month
                        </span>
                        <div onClick={() => printAddedPlaceAddresses()} className={`dateBox my-1 font-jakarta px-2 ${mobileModeNarrow && "smedium"}`}>{currentTrip.startDate ? datify(datiundash(currentTrip.startDate)) + " - " + datify(datiundash(currentTrip.endDate)) : <p className="m-0">{datify(datinormal(selectionRange[0].startDate))} &nbsp; - &nbsp;{datify(datinormal(selectionRange[0].endDate))}</p>}</div>
                        <div className={`dateBox my-1 font-jakarta px-2 mx-1 ${mobileModeNarrow && "smedium"}`}><span>{currentTrip.tripDuration ? currentTrip.tripDuration : (selectionRange[0].endDate.getTime() - selectionRange[0].startDate.getTime()) / (1000 * 3600 * 24) + 1}</span>&nbsp;days</div>
                        <div ref={refCalendar} className="calendarContainer">
                            <p onClick={() => setCalendarOpen(calendarOpen => !calendarOpen)} className={`m-0 purple-text pointer ${mobileModeNarrow && "smedium"}`}>Edit</p>

                            {calendarOpen &&
                                <DateRange
                                    onChange={(item) => setSelectionRange([item.selection])}
                                    ranges={selectionRange}
                                    months={1}
                                    className='calendarElement'
                                />
                            }
                        </div>
                        {/* {mobileMode ? currentTrip.tripID !== null || auth.currentUser ?
                            <button onClick={() => sendPlaces()} className={`${places.length > 0 ? "btn-primaryflex" : "btn-primaryflex-disabled"} position-right`}>Generate Itinerary</button>
                            :
                            <button onClick={() => { setSignUpIsOpen(true); setAuthIndex(0) }} className={`${places.length > 0 ? "btn-primaryflex" : "btn-primaryflex-disabled"} position-right`}>Sign up to save</button>
                            : null} */}


                    </div>
                    {!mobileMode ? currentTrip.tripID !== null || auth.currentUser ?
                        <button onClick={() => sendPlaces()} className={`${places.length > 0 ? "btn-primaryflex" : "btn-primaryflex-disabled"} position-right`}>Generate Itinerary</button>
                        :
                        <button onClick={() => { setSignUpIsOpen(true); setAuthIndex(0) }} className={`${places.length > 0 ? "btn-primaryflex" : "btn-primaryflex-disabled"} position-right`}>Sign up to save</button>
                        : null}

                </div>

                <div className="flx-r onHover-fadelite d-none">
                    <p className="mt-1 mb-3 purple-text"><span className="material-symbols-outlined v-bott mr-2 purple-text">
                        add
                    </span>Add hotel or other accommodation***</p>
                </div>

                <div className={`body-section ${mobileMode ? "flx-c mobile" : "flx-r-reverse"}`}>
                    <div className={`add-places-c1 map-section flx-5`}>
                        <div className={`gray-box fullHeight ${placeToConfirm && "mapbtn-transformation"} ${mobileMode && "fullWidth"} position-relative flx`}>

                            <div className="searchBar position-absolute w-100 z-10000 d-none">
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


                            <PlaceToConfirmCard addPlace={addPlace} removePlace={removePlace} placeToConfirm={placeToConfirm} clearPlaceToConfirm={clearPlaceToConfirm} addressList={placesAddressList} forAddPlaces />

                            {/* <OpenMap mapCenter={mapCenter} markers={markers} newPlaceMarker={newPlaceMarker} /> */}
                            {/* <OpenMapBox addPlaceToConfirm={addPlaceToConfirm} newPlaceMarker={newPlaceMarker} mapCenter={mapCenter} mapCenterToggle={mapCenterToggle} markers={markers} /> */}
                            <GoogleMapBox
                                tripMapCenter={currentTrip.geocode ? geoToLatLng(currentTrip.geocode) : ({ lat: 51.50735, lng: -0.12776 })}
                                mapCenter={mapCenter}
                                mapCenterToggle={mapCenterToggle}
                                addPlaceToConfirm={addPlaceToConfirm}
                                markers={markers}
                                setMarkers={setMarkers}
                                showPlaceAddedBox={showPlaceAddedBox}
                                setShowPlaceAddedBox={setShowPlaceAddedBox}
                            />

                        </div>
                    </div>

                    <div className={`add-places-c2 flx-c ${mobileMode ? "flx-8" : "flx-4"}`}>



                        <div ref={placesListRef} className={`places-section ${mobileMode && "mt-4"}`}>
                        {/* <NavigationTabs
                            tabs={navigationTabs}
                            gap={12}
                            paddingX={0}
                            containerRef={placesListRef}
                            beamBackgroundColor="#F0F0F0"
                            setActiveTabIndex={setSelectedPlacesList(navigationTabs())}
                            maintainGap
                        /> */}

                            <div className="placesList flx-r gap-6">
                                <div className="tab-option">
                                    <p onClick={() => setSelectedPlacesList("Top sites")} className={`${selectedPlacesList === "Top sites" ? "selectedPlacesList" : "unselectedPlacesList"} tab-title ${mobileModeNarrow && "smedium"} bold600 m-0`}>Top Sites</p>
                                </div>
                                <div className="tab-option">
                                    <p onClick={() => setSelectedPlacesList("Suggested Places")} className={`${selectedPlacesList === "Suggested Places" ? "selectedPlacesList" : "unselectedPlacesList"} tab-title ${mobileModeNarrow && "smedium"} bold600 m-0`}>Suggested places</p>
                                </div>
                                <div className="tab-option">
                                    <span className="notification-icon" data-hidden={!notifications.addedPlaces.isShowing} data-jump={notifications.addedPlaces.isJumping}>
                                        <span className={gIcon}>exclamation</span>
                                    </span>
                                    <p onClick={() => setSelectedPlacesList("Added Places")} className={`${selectedPlacesList === "Added Places" ? "selectedPlacesList" : "unselectedPlacesList"} tab-title ${mobileModeNarrow && "smedium"} bold600 m-0`}>Added places <span className={`numberBox ${selectedPlacesList === "Added Places" ? "selected" : ""}`}>{places.length}</span></p>
                                </div>
                            </div>
                            <div className="box-bar">
                                <div ref={beamRef} className={`beam ${mobileModeNarrow && "mobileModeNarrow"} ${selectedPlacesList === "Top sites" && "topSites"} ${selectedPlacesList === "Added Places" && "addedPlaces"} ${selectedPlacesList === "Suggested Places" && "suggestedPlaces"}`}></div>
                            </div>

                            {selectedPlacesList === "Added Places" &&
                                <>
                                    <div className="flx" style={{ height: mobileModeNarrow ? 41 : 44 }}>
                                        {places.length > 0 &&
                                            <p onClick={() => setConfirmationModalOpen(true)} className={`my-2 purple-text pointer z-1 position-right bold500 mr-1 ${mobileModeNarrow && "smedium"}`}>Clear list</p>
                                        }
                                    </div>
                                    <div id='placeCardsList' className={`placeCards ${places.length > 0 ? "h482" : null}`}>
                                        <Scrollbars ref={placesScrollBarRef} autoHide>
                                            {clearPlacesLoading &&
                                                <LoadingFillElement
                                                    color={"whitelite"}
                                                    noText
                                                    noMascot
                                                    fadeIn
                                                />
                                            }
                                            {Array.isArray(places) && places.length > 0 ? places.map((place, index) => {

                                                return <PlaceCard
                                                    ref={e => placeCardRefs.current[index] = e}
                                                    place={place}
                                                    addPlaceToConfirm={addPlaceToConfirm}
                                                    index={index}
                                                    updateMapCenter={updateMapCenter}
                                                    addStar={addStar}
                                                    removeStar={removeStar}
                                                    removePlace={removePlace}
                                                />


                                            })
                                                :
                                                <div className="add-places-card">
                                                    <span className="material-symbols-outlined xx-large">
                                                        location_on
                                                    </span>
                                                    <p className="large bold700 my-1 o-50">Add places</p>
                                                    <p className="m-0 w-60 center-text o-50 addPlace-text">Use the search bar on the map to add places that you want to go</p>
                                                </div>
                                            }
                                        </Scrollbars>
                                        {/* <div className="generate-btn-space w-100">
                                            <button onClick={() => sendPlaces()} className={`${places.length > 0 ? "btn-primaryflex" : "btn-primaryflex-disabled"} right-respond1024`}>Generate Itinerary</button>
                                        </div> */}
                                    </div>
                                    <div className="generate-btn-space w-100">
                                        {/* <button onClick={() => sendPlaces()} className={`${places.length > 0 ? "btn-primaryflex" : "btn-primaryflex-disabled"} right-respond1024`}>Generate Itinerary</button> */}
                                    </div>
                                    {mobileMode ? currentTrip.tripID !== null || auth.currentUser ?
                                        <button onClick={() => sendPlaces()} className={`${places.length > 0 ? "btn-primaryflex" : "btn-primaryflex-disabled"} position-right`}>Generate Itinerary</button>
                                        :
                                        <button onClick={() => { setSignUpIsOpen(true); setAuthIndex(0) }} className={`${places.length > 0 ? "btn-primaryflex" : "btn-primaryflex-disabled"} position-right`}>Sign up to save</button>
                                        : null}
                                </>
                            }

                            {selectedPlacesList === "Suggested Places" &&
                                <>
                                    {Object.values(userPreferences).includes(true) &&
                                        <div className="suggestedCategories flx-r gap-2 my-2">
                                            <div id='suggestedCategory-1' onClick={() => updateSuggestedPlacesFilter(1, "All")} className={`dateBox-rounder px-2 pointer ${!suggestedPlacesFilter || suggestedPlacesFilter === "All" ? "selected" : "unselected"}`}>All</div>
                                            {Object.entries(userPreferences).map((userPreference, index) => {
                                                let category = userPreference[0];
                                                let selected = userPreference[1];
                                                let categoryTitle = mapBoxCategoryKey[category].categoryTitle
                                                return selected && <div key={index} id={`suggestedCategory-${index + 2}`} onClick={() => updateSuggestedPlacesFilter(index + 2, categoryTitle)} className={`dateBox-rounder px-2 pointer ${suggestedPlacesFilter === categoryTitle ? "selected" : "unselected"}`}>{categoryTitle}</div>
                                            })}

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

                                        <Link to='/survey-update' state={{ returnPage: "/add-places/suggested-places" }} className='position-right'><p className={`m-0 purple-text pointer my-2 smedium ${mobileModeNarrow && "smedium"}`}>Update Travel Preferences</p></Link>
                                    </div>
                                    <div className={`placeCards ${suggestedPlaces.places.length > 0 ? "h482" : null}`}>
                                        <Scrollbars autoHide>
                                            {suggestedPlaces.isLoaded && suggestedPlaces.places.length === 0 ?
                                                <div className="add-places-card">
                                                    <span className="material-symbols-outlined xx-large">
                                                        map
                                                    </span>
                                                    <p className="large bold700 my-1 o-50">0 suggested places</p>
                                                    <p className="m-0 w-60 center-text o-50 addPlace-text">Update travel preferences to get place suggestions</p>
                                                </div> : null}
                                            {Object.values(userPreferences).includes(true) && !suggestedPlaces.isLoaded &&
                                                <>
                                                    <div className="loadingBox-inline">
                                                        <Loading noMascot={true} innerText={"Loading..."} />
                                                    </div>
                                                </>
                                            }


                                            {suggestedPlaces.places.length > 0 &&
                                                suggestedPlaces.places.map((suggestedPlace, index) => {
                                                    return <SuggestedPlaceCard
                                                        index={index}
                                                        place={suggestedPlace}

                                                        addPlaceToConfirm={addPlaceToConfirm}
                                                        addPlace={addPlace}
                                                        removePlace={removePlace}

                                                        placesAddressList={placesAddressList}

                                                        suggestedPlacesFilter={suggestedPlacesFilter}
                                                        blacklist={blacklist}
                                                        addToBlacklist={addToBlacklist}
                                                        flashAdded={flashAdded}
                                                    />


                                                })}
                                        </Scrollbars>
                                    </div>

                                </>
                            }
                            {selectedPlacesList === "Top sites" &&
                                <>
                                    <div className="flx-r align-r">
                                        {topSiteControls.hiddenPlaces.length > 0 &&
                                            <div onClick={() => topSiteFunctions.undoHidePlace()} className="flx-r align-c onHover-fadelite">
                                                <span className="material-symbols-outlined purple-text medium mr-1">
                                                    undo
                                                </span>
                                                <p className="m-0 purple-text pointer small">Undo Hide</p>
                                            </div>
                                        }
                                        <p className="m-0 purple-text pointer mt-1 smedium">&nbsp;</p>
                                    </div>
                                    <div className={`placeCards ${topSites.places.length > 0 ? "h482" : null}`}>
                                        <Scrollbars autoHide>

                                            {/* <LoadingFillElement
                                                color={"whitelite"}
                                                innerText={"Loading..."}
                                                noMascot
                                            /> */}
                                            {!topSites.isLoaded ?
                                                <>
                                                    <div className="loadingBox-inline">
                                                        <Loading noMascot={true} innerText={"Loading..."} />
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    {topSites.places.length === 0 ?
                                                        <div className="add-places-card">
                                                            <span className="material-symbols-outlined xx-large">
                                                                location_on
                                                            </span>
                                                            <p className="large bold700 my-1 o-50">0 popular sites in this area</p>
                                                            {/* <p className="m-0 w-60 center-text o-50 addPlace-text">Update travel preferences to get place suggestions</p> */}
                                                        </div>
                                                        :
                                                        <>
                                                            {topSites.places.map((topSite, index) => {
                                                                return <SuggestedPlaceCard
                                                                    index={index}
                                                                    place={topSite}

                                                                    addPlaceToConfirm={addPlaceToConfirm}
                                                                    addPlace={addPlace}
                                                                    removePlace={removePlace}

                                                                    placesAddressList={placesAddressList}

                                                                    blacklist={topSiteControls.hiddenPlaces}
                                                                    addToBlacklist={topSiteFunctions.hidePlace}
                                                                    flashAdded={topSiteFunctions.confirmationAnimation}
                                                                // suggestedPlacesFilter={suggestedPlacesFilter}
                                                                // blacklist={blacklist}
                                                                // addToBlacklist={addToBlacklist}
                                                                // flashAdded={flashAdded}
                                                                />


                                                            })}
                                                        </>
                                                    }

                                                </>
                                            }
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
