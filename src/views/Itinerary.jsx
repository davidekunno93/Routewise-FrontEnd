import React, { Suspense, createRef, useContext, useEffect, useState } from 'react'
import { PlaceCard } from '../components/PlaceCard'
import { Link } from 'react-router-dom'
import { SearchPlace } from '../components/SearchPlace'
import { FlowBox } from '../components/FlowBox'
import { useRef, lazy } from 'react'
import { OpenMap } from '../components/OpenMap'
import { auth } from '../firebase'
// import { DragDropContext } from 'react-beautiful-dnd'
import { DragDropContext } from '@hello-pangea/dnd'
import Scrollbars from 'react-custom-scrollbars-2'
import axios from 'axios'
import LoadBox from '../components/LoadBox'
import DaySelected from '../components/DaySelected'
import { DataContext } from '../Context/DataProvider'
import { Loading } from '../components/Loading'
import OpenMapBox from '../components/OpenMapBox'
// import FlowBoxDraggable from '../components/FlowBoxDraggable'

const FlowBoxDraggable = lazy(() => import('../components/FlowBoxDraggable'));

export const Itinerary = ({ selectedPlacesListOnLoad }) => {
  // if (!currentTrip.tripID) return null ?
  const { currentTrip, setCurrentTrip, clearCurrentTrip } = useContext(DataContext);
  const { userPreferences, setUserPreferences } = useContext(DataContext);
  const { loadCityImg } = useContext(DataContext);
  const { suggestedPlaces, mapBoxCategoryKey } = useContext(DataContext);
  const { mobileMode, mobileModeNarrow } = useContext(DataContext);

  // ['libraries']

  // ['onload functions code']
  const [selectedPlacesList, setSelectedPlacesList] = useState(selectedPlacesListOnLoad ? selectedPlacesListOnLoad : 'Itinerary') // Itinerary, Suggested Places, Saved Places


  // ['other functions code']
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  // date conversion functions
  const datinormal = (systemDate) => {
    // system date => mm/dd/yyyy
    let day = systemDate.getDate().toString().length === 1 ? "0" + systemDate.getDate() : systemDate.getDate()
    let month = systemDate.getMonth().toString().length + 1 === 1 ? "0" + (systemDate.getMonth() + 1) : systemDate.getMonth() + 1
    if (month.toString().length === 1) {
      month = "0" + month
    }
    // console.log(month)
    let fullYear = systemDate.getFullYear()
    // console.log(systemDate)
    // console.log(month+"/"+day+"/"+fullYear)
    return month + "/" + day + "/" + fullYear
  }
  const datify = (normalDate) => {
    // mm/dd/yyyy => mmm dd, yy
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
  const datidash = (mmddyyyy) => {
    // mm/dd/yyyy => yyyy-mm-dd
    let year = mmddyyyy.slice(6)
    let month = mmddyyyy.slice(0, 2)
    let day = mmddyyyy.slice(3, 5)
    return year + "-" + month + "-" + day
  }
  const datiundash = (dashDate) => {
    // yyyy-mm-dd => mm/dd/yyyy
    let fullyear = dashDate.slice(0, 4)
    let month = dashDate.slice(5, 7)
    let day = dashDate.slice(8)
    return month + "/" + day + "/" + fullyear
  }


  // ['elements code']

  // [trip information code]
  const tripNameInputRef = useRef(null);
  const tripNameSpanRef = useRef(null);
  const tripNameWrapperRef = useRef(null);
  const [tripName, setTripName] = useState(currentTrip.tripName ? currentTrip.tripName : "Londo-Fundo!")
  const [tripNameIsUpdating, setTripNameIsUpdating] = useState(false);
  const [tripNameSendStandby, setTripNameSendStandby] = useState(false);
  useEffect(() => {
    if (tripNameIsUpdating) {
      console.log('tripName is updating...');
      setTripNameSendStandby(true);
      tripNameInputRef.current.focus()
    } else if (!tripNameIsUpdating && tripNameSendStandby) {
      let oldName = currentTrip.tripName
      // console.log("old name: "+oldName)
      if (tripName.trim() !== oldName) {

        console.log("tripName: Send data now")
        // tripUpdate function -> tripName
        // if failed revert tripName back to oldName
      } else {
        console.log("tripName: False alarm")
      }
    }
  }, [tripNameIsUpdating])
  const loadTripName = () => {
    if (tripNameInputRef.current) {
      // declare initial input value
      tripNameInputRef.current.value = tripName;
      // resize input to span width
      tripNameInputRef.current.style.width = tripNameSpanRef.current.offsetWidth + 'px';
    }
  }
  const updateTripName = (e) => {
    // name char limit: 24
    if (e.target.value.length <= 24) {
      setTripName(e.target.value)
    } else {
      tripNameInputRef.current.value = tripName
    }
  }
  useEffect(() => {
    loadTripName()
  }, [selectedPlacesList])
  useEffect(() => {
    // console.log(tripNameSpanRef.current.offsetWidth)
    if (tripNameInputRef.current) {
      tripNameInputRef.current.style.width = tripNameSpanRef.current.offsetWidth + 'px';
    }
  }, [tripName])

  // issues with cleanup ?
  useEffect(() => {
    window.addEventListener('click', clickOutsideTripName);
    return () => window.removeEventListener('click', clickOutsideTripName);
  }, [])
  const clickOutsideTripName = (e) => {
    if (tripNameWrapperRef.current && !tripNameWrapperRef.current.contains(e.target)) {
      setTripNameIsUpdating(false);
    }
  }


  // [places code]
  // drag n drop code test data
  const tripTestData = {
    tripID: "",
    places_last: 8,
    places: {
      1: {
        id: 1,
        placeName: "Trafalgar Square",
        info: "Open 24 hours",
        address: "Trafalgar Sq, London WC2N 5DS, UK",
        category: "tourist area",
        imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
        lat: 51.50806,
        long: -0.12806,
        geocode: [51.50806, -0.12806],
        favorite: true,
        place_id: null
      },
      2: {
        id: 2,
        placeName: "Tate Modern",
        info: "Mon-Sun 10 AM-6 PM",
        address: "Bankside, London SE1 9TG, UK",
        category: "art & entertainment",
        imgURL: "https://i.imgur.com/FYc6OB3.jpg",
        lat: 51.507748,
        long: -0.099469,
        geocode: [51.507748, -0.099469],
        favorite: false,
        place_id: null
      },
      3: {
        id: 3,
        placeName: "Hyde Park",
        info: "Mon-Sun 5 AM-12 AM",
        address: "Hyde Park, London W2 2UH, UK",
        category: "nature",
        imgURL: "https://i.imgur.com/tZBnXz4.jpg",
        lat: 51.502777,
        long: -0.151250,
        geocode: [51.502777, -0.151250],
        favorite: false,
        place_id: null
      },
      4: {
        id: 4,
        placeName: "Buckingham Palace",
        info: "Tours Start at 9am",
        address: "Buckingham Palace, London SW1A 1AA, UK",
        category: "landmarks",
        imgURL: "https://i.imgur.com/lw40mp9.jpg",
        lat: 51.501476,
        long: -0.140634,
        geocode: [51.501476, -0.140634],
        favorite: true,
        place_id: null
      },
      5: {
        id: 5,
        placeName: "Borough Market",
        info: "Closed Mondays, Tues-Sun 10 AM-5 PM",
        address: "Borough Market, London SE1 9AL, UK",
        category: "tourist area",
        imgURL: "https://i.imgur.com/9KiBKqI.jpg",
        lat: 51.50544,
        long: -0.091249,
        geocode: [51.50544, -0.091249],
        favorite: true,
        place_id: null
      },
      6: {
        id: 6,
        placeName: "Trafalgar Square",
        info: "Open 24 hours",
        address: "Trafalgar Sq, London WC2N 5DS, UK",
        category: "tourist area",
        imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
        lat: 51.50806,
        long: -0.12806,
        geocode: [51.50806, -0.12806],
        favorite: false,
        place_id: null
      },
      7: {
        id: 7,
        placeName: "Borough Market",
        info: "Closed Mondays, Tues-Sun 10 AM-5 PM",
        address: "Borough Market, London SE1 9AL, UK",
        category: "tourist area",
        imgURL: "https://i.imgur.com/9KiBKqI.jpg",
        lat: 51.50544,
        long: -0.091249,
        geocode: [51.50544, -0.091249],
        favorite: false,
        place_id: null
      },
      8: {
        id: 8,
        placeName: "Trafalgar Square",
        info: "Open 24 hours",
        address: "Trafalgar Sq, London WC2N 5DS, UK",
        category: "tourist area",
        imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
        lat: 51.50806,
        long: -0.12806,
        geocode: [51.50806, -0.12806],
        favorite: false,
        place_id: null
      }
    },
    days: {
      "day-1": {
        id: "day-1",
        date_converted: "Wednesday, November 8",
        day_short: "Wed",
        date_short: "11/8",
        dayName: "",
        placeIds: [1, 2]
      },
      "day-2": {
        id: "day-2",
        date_converted: "Thursday, November 9",
        day_short: "Thurs",
        date_short: "11/9",
        dayName: "",
        placeIds: [3, 4]
      },
      "day-3": {
        id: "day-3",
        date_converted: "Friday, November 10",
        dayName: "",
        day_short: "Fri",
        date_short: "11/10",
        placeIds: [5, 6]
      },
      "day-4": {
        id: "day-4",
        date_converted: "Saturday, November 11",
        dayName: "",
        day_short: "Sat",
        date_short: "11/11",
        placeIds: [7, 8]
      }

    },
    "day_order": ["day-1", "day-2", "day-3", "day-4"]
  }
  const [tripState, setTripState] = useState(currentTrip.itinerary ? currentTrip.itinerary : tripTestData);

  const placeFuntions = {
    addPlace: function (dayNum, place) {

    },
    addPlaceToConfirm: function (place) {

    },
    addToSavedPlaces: function (place) {

    },
    deletePlace: function (place) {

    },
    updatePlaceDay: function (dayNum, place) {

    },
  };

  // add place from map and suggeseted places
  const addPlace = async (dayNum, modifier) => {
    let tripStateCopy = { ...tripState }
    let place = placeToConfirm
    // add day_id to place object
    place['day_id'] = tripStateCopy.days[dayNum].day_id
    place['trip_id'] = tripStateCopy.trip_id
    // console.log(tripStateCopy.trip_id) 
    console.log(place);

    // key made for lightbulb icon purposes only - indicating day w closest activities
    if (place.lightbulb_days) {
      delete place.lightbulb_days
    }

    if (tripStateCopy.trip_id) {

      // send place details to Kate for db update - return db place_id
      let sendPlace = { id: parseInt(tripStateCopy.places_last) + 1, ...place }
      let data = {
        place: sendPlace,
        day_id: sendPlace.day_id
      }
      console.log("sendPlace: ", sendPlace)
      const response = await axios.post(`http://routewise-backend.onrender.com/itinerary/add-one-place/${sendPlace.trip_id}`, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      }).then((response) => {
        console.log(response.status)
        let place_id = response.data

        // create a new place id for the place
        tripStateCopy.places[parseInt(tripStateCopy.places_last) + 1] = {
          id: parseInt(tripStateCopy.places_last) + 1,
          ...place,
          place_id: place_id // also adding place_id from database (from Kate response)
        }
        tripStateCopy.places_last = parseInt(tripStateCopy.places_last) + 1
        tripStateCopy.days[dayNum].placeIds.push(tripStateCopy.places_last)
        setTripState(tripStateCopy)
        // closeDaySelection()
        // clearPlaceToConfirm()
        // console.log(tripStateCopy)
        confirmPlaceAdded(modifier)
      }).catch((error) => {
        console.log(error)
      })
    } else {
      // we're in playground mode i.e. using test place objects on default itinerary page
      tripStateCopy.places[parseInt(tripStateCopy.places_last) + 1] = {
        id: parseInt(tripStateCopy.places_last) + 1,
        ...place,
      }
      tripStateCopy.places_last = parseInt(tripStateCopy.places_last) + 1
      tripStateCopy.days[dayNum].placeIds.push(tripStateCopy.places_last)
      setTripState(tripStateCopy)
      confirmPlaceAdded(modifier)
    }
  }
  // Sending Kate added place code
  const sendAddPlace = async (place, day_id) => {
    let data = {
      place: place,
      day_id: day_id
    }
    const response = await axios.post(`http://localhost:5000/itinerary/add-one-place/${place.trip_id}`, JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    }).then((response) => {
      console.log(response.status)
      return response.status === 200 ? response.data : null
    }).catch((error) => {
      console.log(error)
    })
  }
  // delete place from database
  const deletePlaceFromDatabase = (placeId) => {
    let place_id = tripState.places[placeId].place_id
    const response = axios.delete(`https://routewise-backend.onrender.com/itinerary/delete-place/${place_id}`)
      .then((response) => {
        console.log(response.data)
      }).catch((error) => {
        console.log(error)
      })
  }
  // update place in database
  const updatePlaceInDatabase = (place_id, day_id) => {
    console.log(place_id)
    console.log(day_id)
    let url = `https://routewise-backend.onrender.com/itinerary/update-place/${place_id}`
    const response = axios.patch(url, { "day_id": day_id }, {
      headers: { "Content-Type": "application/json" }
    }).then((response) => {
      console.log(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }
  const removePlace = (dayNum, placeId) => {
    // tripState > days[dayNum] > remove placeIds[placeId]
    deletePlaceFromDatabase(placeId)

    const tripStateCopy = { ...tripState }
    let index = tripStateCopy.days[dayNum].placeIds.indexOf(placeId)
    tripStateCopy.days[dayNum].placeIds.splice(index, 1)
    delete tripStateCopy.places[placeId]
    setTripState(tripStateCopy)
    console.log(tripStateCopy)
  }




  // [place to confirm code]
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
  }, [placeToConfirm])
  const [lightbulbDays, setLightbulbDays] = useState([]);
  const clearPlaceToConfirm = () => {
    setPlaceToConfirm(null)
  }
  const addPlaceToConfirm = async (place) => {
    let newPlace = {}
    if (place.placeName) {
      newPlace = { ...place, favorite: false };
    } else {
      let imgQuery = place.text.replace(/ /g, '-');
      let imgUrl = await loadCityImg(imgQuery);
      // let placeInfo = await loadPlaceDetails(place.place_id)
      let placeInfo = "";

      newPlace = {
        placeName: place.text,
        info: placeInfo,
        address: place.place_name.split(", ").slice(1, -1).join(", "),
        imgURL: imgUrl,
        category: place.properties.category,
        favorite: false,
        lat: place.geometry.coordinates[1],
        long: place.geometry.coordinates[0],
        geocode: [place.geometry.coordinates[1], place.geometry.coordinates[0]],
        placeId: place.id,
      }
    }

    let days = {}
    for (let dayNum of tripState.day_order) {
      let day = tripState.days[dayNum]
      let dist = Math.sqrt((newPlace.lat - day.centroid[0]) ** 2 + (newPlace.long - day.centroid[1]) ** 2)
      days[dayNum] = dist
    }
    let min_dist = 99999999999
    let dist_list = Object.values(days)
    console.log(dist_list)
    for (let i = 0; i < dist_list.length; i++) {
      // console.log(parseFloat(dist_list[i]))
      if (min_dist > parseFloat(dist_list[i])) {
        min_dist = dist_list[i]
      }
    }
    // console.log("min dist =", min_dist)
    let lightbulb_days = []
    for (let [dayNum, dist] of Object.entries(days)) {
      if (dist === min_dist) {
        lightbulb_days.push(dayNum)
      }
    }
    // console.log("lightbulb days are = ", lightbulb_days);
    newPlace["lightbulb_days"] = lightbulb_days;
    setLightbulbDays(lightbulb_days);
    setPlaceToConfirm(newPlace);
    setMapCenter(newPlace.geocode);
    setMapCenterToggle(!mapCenterToggle);
    // resetPanelSearch()
  }
  // const [placeCardTitleCharLimit, setPlaceCardTitleCharLimit] = useState(0);
  const [placeToConfirmCardTitleCharLimit, setPlaceToConfirmCardTitleCharLimit] = useState(0);
  const [charLimit, setCharLimit] = useState(18);
  const ptcCardBodyRef = useRef(null);
  const calculateCharLimit = (width) => {
    let extraPercent = (Math.floor((width - 213) / 6)) / 1000;
    let charLimit = Math.floor(width * (0.07 + extraPercent));
    // console.log(charLimit);
    return charLimit
  }
  // observe place to confirm card body
  useEffect(() => {
    if (ptcCardBodyRef.current) {
      const observer = new ResizeObserver((entries) => {
        // console.log(entries)
        let width = entries[0].contentRect.width
        let charLimit = calculateCharLimit(width)
        setPlaceToConfirmCardTitleCharLimit(charLimit);
      })
      observer.observe(ptcCardBodyRef.current)
    }
  }, [placeToConfirm])
  useEffect(() => {
    // if (cardBodyRef.current) {
    //   const observer = new ResizeObserver((entries) => {
    //     // console.log(cardBodyRef.current)
    //     let width = entries[0].contentRect.width
    //     calculateCharLimit(width, "placeCard")
    //   })
    //   observer.observe(cardBodyRef.current)
    // }
  }, [])
  const openDaySelection = (modifier) => {
    let daySelection = document.getElementById('daySelection')
    if (modifier) {
      daySelection = document.getElementById(`daySelection-${modifier}`)
      console.log('bye')
    }
    console.log("hi")
    daySelection.classList.remove('d-none')
  }
  const closeDaySelection = (modifier) => {
    let daySelection = document.getElementById(`daySelection`)
    if (modifier) {
      daySelection = document.getElementById(`daySelection-${modifier}`)
    }
    daySelection.classList.add('d-none')
  }
  const [openDaySelected, setOpenDaySelected] = useState(false);

  const confirmPlaceAdded = (modifier) => {
    let daySelection = document.getElementById(`daySelection`)
    let placeToConfirmCard = document.getElementById(`placeToConfirmCard`)
    let day_option = document.getElementById('day-option')
    setPlaceConfirmationAnimation(true)

    if (modifier) {
      daySelection = document.getElementById(`daySelection-${modifier}`)
      placeToConfirmCard = document.getElementById(`placeToConfirmCard-${modifier}`)
    }
    daySelection.style.height = '280px';
    setOpenDaySelected(true)

    wait(2000).then(() => {
      placeToConfirmCard.classList.add('o-none')
      daySelection.classList.add('o-none')
    })
    wait(3000).then(() => {
      setOpenDaySelected(false)
      closeDaySelection(modifier)
      clearPlaceToConfirm()
      daySelection.style.removeProperty('height')
    })
    wait(3500).then(() => {
      placeToConfirmCard.classList.remove('o-none')
      daySelection.classList.remove('o-none')
      setPlaceConfirmationAnimation(false)
    })
  }
  // place confirm animation
  const [placeConfirmationAnimation, setPlaceConfirmationAnimation] = useState(false);
  // update map markers upon adding new place from PTC to trip
  useEffect(() => {
    let markersArr = Object.values(tripState.places)
    if (placeToConfirm && !placeConfirmationAnimation) {
      // markersArr.push(placeToConfirm)
      setNewPlaceMarker(placeToConfirm);
    } else if (!placeToConfirm) {
      setNewPlaceMarker(null);
    }
    setMarkers(markersArr)
  }, [tripState, placeToConfirm, placeConfirmationAnimation])

  // date chosen for place to be added to
  const [dateToConfirm, setDateToConfirm] = useState(null);

  const updateDateToConfirm = (day, date) => {
    setDateToConfirm(day + ", " + date)
    // console.log(day+", "+date)
  }

  // [map & geography code]
  const [markers, setMarkers] = useState(null);
  const [newPlaceMarker, setNewPlaceMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState(currentTrip.geocode ? currentTrip.geocode : [51.50735, -0.12776])
  const [mapCenterToggle, setMapCenterToggle] = useState(false);
  const [country, setCountry] = useState(currentTrip.country_2letter ? currentTrip.country_2letter : 'gb');
  const [searchText, setSearchText] = useState('');
  const [panelSearchText, setPanelSearchText] = useState('');
  const [auto, setAuto] = useState([]);
  const [mapView, setMapView] = useState(false);



  // [flowbox operations code]
  const rotateSymbol = (id, deg) => {
    const symbol = document.getElementById(`expandArrow-${id}`)
    symbol.style.transform = `rotate(${deg}deg)`
  }
  const expandFlow = (id) => {
    const flowZero = document.getElementById(`flow-${id}`)
    const flowBodyZero = document.getElementById(`flowBody-${id}`)
    const placeCount = document.getElementById(`placeCount-${id}`)
    flowBodyZero.classList.remove('d-none')
    flowZero.style.height = `${flowBodyZero.offsetHeight}px`
    rotateSymbol(id, '0')
    wait(100).then(() => {
      flowBodyZero.classList.remove('o-none')
      placeCount.classList.add('o-none')
      wait(500).then(() => {
        flowZero.style.removeProperty('height')
      })
    })
  }
  const collapseFlow = (id) => {
    const flowZero = document.getElementById(`flow-${id}`)
    const flowBodyZero = document.getElementById(`flowBody-${id}`)
    const placeCount = document.getElementById(`placeCount-${id}`)
    flowBodyZero.classList.add('o-none')
    flowZero.style.height = `${flowBodyZero.offsetHeight}px`
    wait(100).then(() => {
      flowZero.style.height = '0px'
      placeCount.classList.remove('o-none')
      rotateSymbol(id, '-90')
      wait(500).then(() => {
        flowBodyZero.classList.add('d-none')
      })
    })
  }
  const toggleFlow = (id) => {
    const flowZero = document.getElementById(`flow-${id}`)
    const flowBodyZero = document.getElementById(`flowBody-${id}`)
    console.log(id)
    if (flowZero.style.height === '0px') {
      expandFlow(id)
    } else {
      collapseFlow(id)
    }
  }
  const addSearchOpen = (id) => {
    const addPlacesBtn = document.getElementById(`addPlacesBtn-${id}`)
    const searchBar = document.getElementById(`searchBar-${id}`)
    const addPlaceExpand = document.getElementById(`addPlace-expand-${id}`)
    addPlacesBtn.classList.add('d-none')
    searchBar.classList.remove('d-none')
    addPlaceExpand.style.height = '70px'
    wait(100).then(() => {
      searchBar.classList.remove('o-none')
    })
  }
  const addSearchClose = (id) => {
    const addPlacesBtn = document.getElementById(`addPlacesBtn-${id}`)
    const searchBar = document.getElementById(`searchBar-${id}`)
    const addPlaceExpand = document.getElementById(`addPlace-expand-${id}`)
    searchBar.classList.add('o-none')
    wait(100).then(() => {
      addPlacesBtn.classList.remove('d-none')
      searchBar.classList.add('d-none')
      addPlaceExpand.style.height = '30px'
    })
  }
  // creating refs for each day (flowbox)
  let refs = useRef([])
  // scroll to flowbox
  useEffect(() => {
    refs.current = refs.current.slice(0, tripState.day_order.length)
  }, [])
  const scrollToSection = (refID) => {
    // console.log('scrolling')
    // console.log(refs)
    window.scrollTo({
      top: refs.current[refID].offsetTop - 100,
      behavior: "smooth"
    })
  }
  // add place from search in flowbox
  const addPlaceFromFlowBox = async (dayNum, place) => {
    // {run imgquery on place.name + country}
    let imgQuery = place.text.replace(/ /g, '-');
    // {run place details query with place_id}
    // let placeInfo = await loadPlaceDetails(place.place_id)
    let placeInfo = "";
    let imgUrl = await loadCityImg(imgQuery);
    let tripStateCopy = { ...tripState };

    // let newPlace = {
    //   placeName: place.name,
    //   info: placeInfo,
    //   address: place.formatted,
    //   imgURL: imgUrl,
    //   category: place.category ? place.category : "none",
    //   favorite: false,
    //   lat: place.lat,
    //   long: place.lon,
    //   geocode: [place.lat, place.lon],
    //   placeId: place.place_id,
    //   day_id: tripStateCopy.days[dayNum].day_id,
    //   trip_id: tripStateCopy.trip_id
    // }
    let newPlace = {
      placeName: place.text,
      info: placeInfo,
      address: place.place_name.split(", ").slice(1, -1).join(", "),
      imgURL: imgUrl,
      category: place.properties.category,
      favorite: false,
      lat: place.geometry.coordinates[1],
      long: place.geometry.coordinates[0],
      geocode: [place.geometry.coordinates[1], place.geometry.coordinates[0]],
      placeId: place.id,
      day_id: tripStateCopy.days[dayNum].day_id,
      trip_id: tripStateCopy.trip_id
    }

    // if database on then procede else do not proceed (create databaseOn in DataProvider?)
    if (tripState.trip_id) {

      // send place details to Kate for db update - return db place_id
      let place_id = null
      let sendPlace = { id: parseInt(tripStateCopy.places_last) + 1, ...newPlace }
      let data = {
        place: sendPlace,
        day_id: sendPlace.day_id
      }
      const response = await axios.post(`https://routewise-backend.onrender.com/itinerary/add-one-place/${sendPlace.trip_id}`, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      }).then((response) => {
        console.log(response.status)
        place_id = response.data

        // create a new place id for the place by incrementing places_last, and add the id key to the place object
        tripStateCopy.places[parseInt(tripStateCopy.places_last) + 1] = {
          id: parseInt(tripStateCopy.places_last) + 1,
          ...newPlace,
          place_id: place_id ? place_id : null // also adding place_id from database (from Kate response)
        }
        // increment places_last
        tripStateCopy.places_last = parseInt(tripStateCopy.places_last) + 1
        // add place to the desired day
        tripStateCopy.days[dayNum].placeIds.push(tripStateCopy.places_last)
        setTripState(tripStateCopy)
      })
    } else {
      // no trip_id therefore we're in the playground with test data
      tripStateCopy.places[parseInt(tripStateCopy.places_last) + 1] = {
        id: parseInt(tripStateCopy.places_last) + 1,
        ...newPlace,
        place_id: null // place_id comes from database (from Kate response)
      }
      // increment places_last
      tripStateCopy.places_last = parseInt(tripStateCopy.places_last) + 1
      // add place to the desired day
      tripStateCopy.days[dayNum].placeIds.push(tripStateCopy.places_last)
      setTripState(tripStateCopy)
    }
  }

  useEffect(() => {
    // update code: needs to update each time itinerary places changes
    updateCentroids()
  }, [])
  const updateCentroids = () => {
    let tripStateCopy = { ...tripState }
    for (let dayNum of tripStateCopy.day_order) {
      let day = tripStateCopy.days[dayNum]
      let place_lats = []
      let place_lons = []
      // console.log(day)
      for (let placeId of tripStateCopy.days[dayNum].placeIds) {
        let place = tripStateCopy.places[placeId]
        place_lats.push(place.geocode[0])
        place_lons.push(place.geocode[1])
      }
      let sum_lats = 0
      let sum_lons = 0
      for (let i = 0; i < place_lats.length; i++) {
        sum_lats += place_lats[i]
        sum_lons += place_lons[i]
      }
      // console.log(place_lats, "sum of lats =", sum_lats)
      // console.log(place_lons, "sum of lons =", sum_lons)
      let center_lat = sum_lats / place_lats.length
      let center_lon = sum_lons / place_lons.length
      // console.log(center_lat, center_lon)
      day["centroid"] = [center_lat, center_lon]
    }
    // console.log(tripStateCopy)
    setTripState(tripStateCopy)
  }
  // flowbox drag n drop
  const reorderDayList = (sourceDay, startIndex, endIndex) => {
    const newPlaceIds = Array.from(sourceDay.placeIds);
    const [removed] = newPlaceIds.splice(startIndex, 1)
    newPlaceIds.splice(endIndex, 0, removed)
    const newDay = {
      ...sourceDay,
      placeIds: newPlaceIds
    }
    return newDay;
  }
  const onDragEndItinerary = (result) => {
    const { destination, source } = result
    // if user tries to drop outside scope
    if (!destination) return;

    // if user drops in same position (same day)
    if (destination.droppableId === source.droppableId && destination.index === source.index) { return; }

    // if user drops in same container but different position (same day)*** order of places in day matters!
    const sourceDay = tripState.days[source.droppableId];
    const destinationDay = tripState.days[destination.droppableId];

    if (sourceDay.id === destinationDay.id) {
      const newDay = reorderDayList(
        sourceDay,
        source.index,
        destination.index
      );

      const newTripState = {
        ...tripState,
        days: {
          ...tripState.days,
          [newDay.id]: newDay,
        }
      };
      setTripState(newTripState);
      return;
    }

    // if user drops in different container (different day)
    const startPlaceIds = Array.from(sourceDay.placeIds);
    const [removed] = startPlaceIds.splice(source.index, 1);
    const newStartDay = {
      ...sourceDay,
      placeIds: startPlaceIds,
    }
    // send db_place_id to Kate with updated day_id
    // tripState.places[removed].day_id = destinationDay.day_id
    updatePlaceInDatabase(tripState.places[removed].place_id, destinationDay.db_id)

    const endPlaceIds = Array.from(destinationDay.placeIds)
    endPlaceIds.splice(destination.index, 0, removed);
    const newEndDay = {
      ...destinationDay,
      placeIds: endPlaceIds,
    }
    const updatedPlace = { ...tripState.places[removed], day_id: destinationDay.db_id }
    const newState = {
      ...tripState,
      places: {
        ...tripState.places,
        [removed]: updatedPlace
      },
      days: {
        ...tripState.days,
        [newStartDay.id]: newStartDay,
        [newEndDay.id]: newEndDay,
      }
    }
    setTripState(newState);
  }

  // flowBox intersection highlights respective day
  const [flowBoxShowingIndex, setFlowBoxShowingIndex] = useState([])
  useEffect(() => {
    // console.log(flowBoxShowingIndex)
  }, [flowBoxShowingIndex])
  const flowBoxes = document.getElementsByClassName('flow-box')
  const observer = new IntersectionObserver(entries => {
    // console.log(entries)
    entries.forEach((entry, i) => {
      // console.log(entry.target.id+" = "+entry.isIntersecting)
      if (entry.isIntersecting) {
        let flowBoxShowingIndexCopy = [...flowBoxShowingIndex]
        if (!flowBoxShowingIndexCopy.includes(entry.target.id[8])) {
          flowBoxShowingIndexCopy.push(entry.target.id[8])
          setFlowBoxShowingIndex(flowBoxShowingIndexCopy)
        }
      } else if (!entry.isIntersecting) {
        let flowBoxShowingIndexCopy = [...flowBoxShowingIndex]
        if (flowBoxShowingIndexCopy.includes(entry.target.id[8])) {
          let index = flowBoxShowingIndexCopy.indexOf(entry.target.id[8])
          flowBoxShowingIndexCopy.splice(index, 1)
          setFlowBoxShowingIndex(flowBoxShowingIndexCopy)
        }
      }
      // console.log(entry)
    })
  },
    {
      threshold: 0.5,
    })
  const observeFlowBoxes = () => {
    for (let i = 0; i < flowBoxes.length; i++) {
      observer.observe(flowBoxes[i])
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', observeFlowBoxes)
    return window.removeEventListener('scroll', observeFlowBoxes)
  }, [])
  // place card title char limit code
  const cardBodyRef = useRef();
  const [placeCardTitleCharLimit, setPlaceCardTitleCharLimit] = useState(0);
  useEffect(() => {
    // first place in first day calculates char limit and mutates charLimit in itinerary
    if (cardBodyRef.current) {
      const observer = new ResizeObserver((entries) => {
        // console.log(cardBodyRef.current)
        let width = entries[0].contentRect.width
        let charLimit = calculateCharLimit(width)
        setPlaceCardTitleCharLimit(charLimit);
        // console.log(charLimit);
      })
      observer.observe(cardBodyRef.current)
    }
  }, [tripState, selectedPlacesList])




  // [saved places code]
  // saved places popup
  const togglePopUp = (index) => {
    let popUp = document.getElementById(`popUp-${index}`)
    popUp.classList.toggle('d-none')
  }
  // catch saved places from itinerary generated
  useEffect(() => {
    // console.log(currentTrip)
    if (currentTrip.itinerary && Object.keys(currentTrip.itinerary).includes("saved_places")) {
      console.log("saved places: " + currentTrip.itinerary.saved_places);
      let savedPlacesCopy = { ...savedPlaces };
      savedPlacesCopy.places = currentTrip.itinerary.saved_places;
      setSavedPlaces(savedPlacesCopy);
      // let saved_places = currentTrip.itinerary.saved_places
      // for (let i = 0; i < saved_places.length; i++) {

      // }
    }
  }, [])
  // switch savedplaces to currentTrip.itinerary.saved_places
  const [savedPlaces, setSavedPlaces] = useState({
    places: [],
    addresses: []
  })
  // saved places operations
  const addToSavedPlaces = (place, convertFrom) => {
    let savedPlacesCopy = { ...savedPlaces }
    // if (convertFrom === "suggestedPlace") {
    //   let placeConverted = {
    //     address: place.formatted,
    //     category: place.categories,
    //     favorite: false,
    //     geocode: [place.lat, place.lon],
    //     imgURL: place.imgUrl,
    //     info: "To be updated",
    //     lat: place.lat,
    //     long: place.lon,
    //     placeId: place.place_id,
    //     placeName: place.name
    //   }
    //   place = placeConverted
    // }
    place = { ...place, favorite: false }

    if (!savedPlaces.addresses.includes(place.address)) {
      savedPlacesCopy.places.push(place)
      savedPlacesCopy.addresses.push(place.address)
    }
    setSavedPlaces(savedPlacesCopy)
  }
  const toggleSavedPlaces = (place) => {
    let savedPlacesCopy = { ...savedPlaces }
    if (!savedPlaces.addresses.includes(place.address)) {
      addToSavedPlaces(place)
    } else {
      removeFromSavedPlaces(place)
    }
  }
  const printSavedPlaces = () => {
    console.log(savedPlaces)
  }
  const removeFromSavedPlaces = (place) => {
    let savedPlacesCopy = { ...savedPlaces }
    if (savedPlacesCopy.addresses.includes(place.address)) {
      let placeIndex = savedPlacesCopy.addresses.indexOf(place.address)
      savedPlacesCopy.places.splice(placeIndex, 1)
      savedPlacesCopy.addresses.splice(placeIndex, 1)
    }
    setSavedPlaces(savedPlacesCopy)
  }





  // [suggested places code]

  const categoryKeyConverter = (categoryName) => {
    // returns api category search query and category title for each category key
    const categoryKey = {
      landmarks: { category: "landmarks", searchQuery: "tourism.attraction,tourism.sights", categoryTitle: "Landmarks & Attractions" },
      nature: { category: "nature", searchQuery: "natural,entertainment.zoo,entertainment.aquarium", categoryTitle: "Nature" },
      shopping: { category: "shopping", searchQuery: "commercial.shopping_mall,commercial.clothing,commercial.gift_and_souvenir", categoryTitle: "Shopping" },
      food: { category: "food", searchQuery: "catering%adult.nightclub", categoryTitle: "Food & Nightlife" },
      relaxation: { category: "relaxation", searchQuery: "service.beauty.spa,service.beauty.massage", categoryTitle: "Spa & Relaxation" },
      entertainment: { category: "entertainmnet", searchQuery: "entertainment.cinema,entertainment.amusement_arcade,entertainment.escape_game,entertainment.miniature_golf,entertainment.bowling_alley,entertainment.theme_park,entertainment.activity_park", categoryTitle: "Music & Entertainment" },
      arts: { category: "arts", searchQuery: "entertainment.culture,entertainment.museum", categoryTitle: "Arts & Culture" }
    }
    return categoryKey[categoryName]
  }
  const [userInterests, setUserInterests] = useState([])
  const [userInterestsTEST, setUserInterestsTEST] = useState([
    { category: "landmarks", searchQuery: "tourism.attraction,tourism.sights", categoryTitle: "Landmarks & Attractions" },
    { category: "shopping", searchQuery: "commercial.shopping_mall,commercial.clothing,commercial.gift_and_souvenir", categoryTitle: "Shopping" },
    { category: "relaxation", searchQuery: "service.beauty.spa,service.beauty.massage", categoryTitle: "Spa & Relaxation" },
  ])


  // filter suggested places by category title
  const [suggestedPlacesFilter, setSuggestedPlacesFilter] = useState(null);
  const updateSuggestedPlacesFilter = (num, categoryTitle) => {
    // let category = document.getElementById(`suggestedCategory-${num}`)
    if (categoryTitle === "All") {
      setSuggestedPlacesFilter(null)
    } else {
      setSuggestedPlacesFilter(categoryTitle)
    }
  }
  const [blacklist, setBlacklist] = useState([])
  const addToBlacklist = (placeName) => {
    let blacklistCopy = [...blacklist]
    blacklistCopy.push(placeName)
    setBlacklist(blacklistCopy)
    // console.log(blacklist)
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
    })
  }
  // suggested place popup code
  const openSuggestedPlacePopUp = (index) => {
    let popUp = document.getElementById(`suggestedPlace-popUp-${index}`)
    popUp.classList.remove('hidden-o')
  }
  const closeSuggestedPlacePopUp = (index) => {
    let popUp = document.getElementById(`suggestedPlace-popUp-${index}`)
    popUp.classList.add('hidden-o')

  }
  const toggleSuggestedPlacePopUp = (index) => {
    let popUp = document.getElementById(`suggestedPlace-popUp-${index}`)
    popUp.classList.toggle('hidden-o')
  }
  const hideAllSuggestedPlacePopUps = () => {
    let popUps = document.getElementsByClassName('placeCard-popUp')
    for (let i = 0; i < popUps.length; i++) {
      popUps[i].classList.add('hidden-o')
      // console.log(popUps[i])
    }
  }
  useEffect(() => {
    window.addEventListener('click', hideAllSuggestedPlacePopUps)
  }, [])



  // [sidebar code] - needs to hide on mobile screens
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const expandSidebar = () => {
    let logo = document.getElementById('sb-logoSpace')
    const sidebarPlaceholder = document.getElementById('itinerarySideBarPlaceholder')
    const sidebar = document.getElementById('itinerarySidebar')
    sidebar.style.width = "300px"
    sidebarPlaceholder.style.width = "300px"

    wait(200).then(() => {
      logo.style.width = "252px"
      let expandItems = document.getElementsByClassName('sb-expanded')
      for (let i = 0; i < expandItems.length; i++) {
        expandItems[i].style.display = "block"
        wait(200).then(() => {
          expandItems[i].classList.add('show')
        })
      }
    })

    setSidebarExpanded(true)
  }
  const collapseSidebar = () => {
    let logo = document.getElementById('sb-logoSpace')
    let expandItems = document.getElementsByClassName('sb-expanded')
    const sidebarPlaceholder = document.getElementById('itinerarySideBarPlaceholder')
    const sidebar = document.getElementById('itinerarySidebar')
    logo.style.width = "34px"

    for (let i = 0; i < expandItems.length; i++) {
      expandItems[i].classList.remove('show')
      wait(200).then(() => {
        expandItems[i].style.display = "none"
      })
    }
    wait(200).then(() => {
      sidebar.style.width = "92px"
      sidebarPlaceholder.style.width = "92px"
    })
    setSidebarExpanded(false)
  }
  const toggleSidebarExpanded = () => {
    if (sidebarExpanded) {
      collapseSidebar()
    } else {
      expandSidebar()
    }
  }
  const sidebarOptions = [
    {
      title: "Itinerary",
      iconUrl: "https://i.imgur.com/UeFtCUp.png"
    },
    {
      title: "Saved Places",
      iconUrl: "https://i.imgur.com/YnFB61Q.png"
    },
    {
      title: "Suggested Places",
      iconUrl: "https://i.imgur.com/YoB68Vw.png"
    },
  ]
  // if saved places in itinerary make initial value = 0, else = null
  const [toolTipIndex, setToolTipIndex] = useState(0);
  const updateToolTipIndex = (index) => {
    if (index || index === 0) {
      setToolTipIndex(index);
    } else if (index === null) {
      setToolTipIndex(null);
    }
  }
  // make firstLoad key in itinerary false so the tooltip no pops up
  const removeItineraryFirstLoad = () => {
    let currentTripCopy = { ...currentTrip }
    currentTripCopy.itineraryFirstLoad = false;
    setCurrentTrip(currentTripCopy);
  }




  // ['functions in the works']
  const updateDayName = (e, dayNum) => {
    let tripStateCopy = { ...tripState }
    tripStateCopy.days[dayNum].dayName = e.target.value
  }
  // map panel
  const showMapPanel = () => {
    let mapPanel = document.getElementById('map-panel')
    let panelBtns = document.getElementById('panelBtns')
    let placeToConfirmCard = document.getElementById('placeToConfirmCard-map-panel')
    if (placeToConfirmCard) {
      placeToConfirmCard.classList.remove('o-none')
    }
    panelBtns.style.transform = "translateY(60px)"
    mapPanel.style.height = "80vh"
  }
  const hideMapPanel = () => {
    let mapPanel = document.getElementById('map-panel')
    let panelBtns = document.getElementById('panelBtns')
    let placeToConfirmCard = document.getElementById('placeToConfirmCard-map-panel')
    if (placeToConfirmCard) {
      placeToConfirmCard.classList.add('o-none')
    }
    mapPanel.style.height = "0vh"
    panelBtns.style.transform = "translateY(0px)"
  }
  

  // added places render 'added to places' button ?
  const [addedPlaceAddresses, setAddedPlaceAddresses] = useState([])
  const updatePlaceAddresses = () => {
    let addedPlaceAddressesCopy = []
    // let places = Object.values({...tripState.places})
    // if (places.length > 0) {
    //   for (let i = 0; i < places.length; i++) {
    //     addedPlaceAddressesCopy.push(places[i].address)
    //   }
    // } else {
    //   addedPlaceAddressesCopy = []
    // }
    // setAddedPlaceAddresses(addedPlaceAddressesCopy)
    // console.log('updated added place addresses')
  }
  // useEffect(() => {
  //   // updatePlaceAddresses()
  //   // console.log(tripState.places)
  // }, [tripState])





  // ['print statements']
  const printTripObject = () => {
    console.log(tripState)
  }
  useEffect(() => {
    console.log(currentTrip)
  }, [])

  // ['vestigial code']
  const showDayPanel = () => {
    const dayPanel = document.getElementById('dayPanel')
    const dayPanelBody = document.getElementById('dayPanelBody')
    const showDayPanelBtn = document.getElementById('showDayPanelBtn')
    const leftPanelOpen = document.getElementById('leftPanelOpen')
    const leftPanelClose = document.getElementById('leftPanelClose')
    leftPanelOpen.classList.add('d-none')
    leftPanelClose.classList.remove('d-none')
    dayPanel.style.width = '200px'
    dayPanel.style.borderRight = '2px solid gainsboro'
    showDayPanelBtn.classList.add('o-none')
    dayPanelBody.classList.remove('d-none')
    wait(200).then(() => {
      dayPanelBody.classList.remove('o-none')
    })
  }
  const hideDayPanel = () => {
    const dayPanel = document.getElementById('dayPanel')
    const dayPanelBody = document.getElementById('dayPanelBody')
    const showDayPanelBtn = document.getElementById('showDayPanelBtn')
    const leftPanelOpen = document.getElementById('leftPanelOpen')
    const leftPanelClose = document.getElementById('leftPanelClose')
    leftPanelOpen.classList.remove('d-none')
    leftPanelClose.classList.add('d-none')
    dayPanelBody.classList.add('o-none')
    wait(200).then(() => {
      // for some reason you have to set the parameter to <= 770 for this to work at 768 width 
      if (window.innerWidth <= 768) {
        dayPanel.style.width = '0px'
      } else {
        dayPanel.style.width = '30px'
      }
      dayPanel.style.borderRight = 'none'
      dayPanelBody.classList.add('d-none')
      showDayPanelBtn.classList.remove('o-none')
    })
  }

  return (
    <>
      {mobileMode &&
        <button onClick={() => setMapView(mapView => !mapView)} className={`mapview-btn ${mapView && "light"}`}>
          <span className={`material-symbols-outlined large ${mapView ? "dark-text" : "white-text"}`}>
            map
          </span>
          <p className={`m-0 ${mapView ? "dark-text" : "white-text"}`}>{mapView ? "Close Map" : "Map View"}</p>
        </button>
      }
      <div className={`itinerary-page ${mobileMode && "overflow-h"}`}>
        <div className={`${mobileMode ? "inner-wide" : "flx-r w-100"}`} style={{ transform: `translateX(-${mobileMode ? mapView ? 1 * 50 : 0 * 50 : 0}%)` }}>
          <div className={`${mobileMode ? "carousel-item-pagewide" : "flx-r flx-4"}`}>

            {/* itinerary sidebar */}
            <div id='itinerarySideBarPlaceholder' className="itinerary-sidebar-placeholder sticky">
              <div id='itinerarySidebar' className="itinerary-sidebar-expanded sticky position-fixe">
                {/* tooltip for saved places */}
                <div className={`sidebar-tooltip saved-places ${currentTrip.itineraryFirstLoad ? toolTipIndex === 0 ? "shown" : "hidden-o" : "hidden-o"}`}>
                  <div className="dot-indicators just-ce">
                    <div className="dot selected"></div>
                    <div onClick={() => updateToolTipIndex(1)} className="dot"></div>
                  </div>
                  <div className="title align-all-items gap-2 my-2">
                    <span className="material-symbols-outlined lightpurple-text">bookmark</span>
                    <p className="m-0 lightpurple-text">Find more in Saved Places</p>
                  </div>
                  <div className="body-text">
                    <p className="m-0 white-text">We couldn't fit all of your places in the itinerary, but don't worry-they're
                      in your Saved Places folder!</p>
                    <br />
                    <p className="m-0 white-text">Feel free to add them to your itinerary as you wish and use this folder for
                      additional places you're interested in but not ready to add to your itinerary just yet.</p>
                  </div>
                  <div className="btns flx-r just-en mt-2">
                    <button onClick={() => updateToolTipIndex(1)} className="btn-primaryflex">Got it</button>
                  </div>
                </div>

                {/* tooltip for suggested places */}
                <div className={`sidebar-tooltip suggested-places  ${toolTipIndex === 1 ? "shown" : "hidden-o"}`}>
                  <div className="dot-indicators just-ce">
                    <div onClick={() => updateToolTipIndex(0)} className="dot"></div>
                    <div className="dot selected"></div>
                  </div>
                  <div className="title align-all-items gap-2 my-2">
                    <span className="material-symbols-outlined lightpurple-text">emoji_objects</span>
                    <p className="m-0 lightpurple-text">Suggested Places</p>
                  </div>
                  <div className="body-text">
                    <p className="m-0 white-text">Find personalized recommendations based on your travel preferences.</p>
                  </div>
                  <div className="btns flx-r just-en mt-2">
                    <button onClick={() => { updateToolTipIndex(null); removeItineraryFirstLoad() }} className="btn-primaryflex">Close</button>
                  </div>
                </div>

                <div id='sb-logoSpace' className="logo-space">
                  <div className="icon-cold">
                    <img onClick={() => toggleSidebarExpanded()} src="https://i.imgur.com/d2FMf3s.png" alt="" className="logo-icon" />
                  </div>

                  <img src="https://i.imgur.com/Eu8Uf2u.png" alt="" className="text-logo-icon" />

                </div>

                {sidebarOptions.map((option, index) => {
                  let selected = selectedPlacesList === option.title ? true : false
                  return <div key={index} onClick={() => setSelectedPlacesList(option.title)} className={`${selected ? "option-selected" : "option"}`}>
                    <img src={option.iconUrl} alt="" className="icon" />
                    <p className="m-0 darkpurple-text sb-expanded">{option.title}</p>
                  </div>
                })}

              </div>
            </div>
            {/* itinerary sidebar end */}


            {/* Itinerary Display */}
            {selectedPlacesList === "Itinerary" &&
              <div className="itinerary-c2 flx-2 ws-normal">
                <div className="page-container96">
                  <div className="align-all-items my-1 gap-2">
                    {/* <p className="page-heading-bold m-0">{currentTrip.tripName ? currentTrip.tripName : "Londo-Fundo!"}</p> */}
                    <div ref={tripNameWrapperRef} className="tripName-wrapper flx align-c gap-2">
                      <span ref={tripNameSpanRef} onClick={() => setTripNameIsUpdating(true)} className={`page-subheading-bold input-text ${tripNameIsUpdating && "hidden-away"}`}>{tripName}</span>
                      <input ref={tripNameInputRef} onChange={(e) => updateTripName(e)} onClick={() => setTripNameIsUpdating(true)} id='tripNameInput' type="text" className={`page-subheading-bold input-edit ${!tripNameIsUpdating && "hidden-away"}`} autoComplete='off' />
                      <span onClick={() => setTripNameIsUpdating(true)} className={`material-symbols-outlined large gains-text pointer ${tripNameIsUpdating && "d-none"}`}>edit</span>
                    </div>
                  </div>
                  {/* calendar edit */}
                  <div className="calendar-edit border-bottom-gains flx-r mb-2 pb-2 align-c gap-2">
                    <span className="material-symbols-outlined o-50">
                      calendar_month
                    </span>
                    <div className="dark-text font-jakarta">{currentTrip.startDate ? datify(datiundash(currentTrip.startDate)) + " - " + datify(datiundash(currentTrip.endDate)) : <p className="m-0">November 8, 2023 &nbsp; - &nbsp; November 11, 2023</p>}</div>
                    <p className="m-0">&bull;</p>
                    <div className="dark-text font-jakarta"><span className="dark-text">{currentTrip.tripDuration ? currentTrip.tripDuration : "4"}</span>&nbsp;days</div>
                    {/* <p className="m-0 purple-text">Edit</p> */}
                  </div>
                  {/* calendar edit end */}
                  {/* trip flow */}
                  {/* <div className="tripFlow flx-r">
                    <Link to='/dashboard'><p className="m-0 purple-text">Create Trip</p></Link>
                    <span className="material-symbols-outlined">
                      arrow_right
                    </span>
                    <Link to='/add-places'><p className="m-0 purple-text">Add Places</p></Link>
                    <span className="material-symbols-outlined">
                      arrow_right
                    </span>
                    <p className="m-0 purple-text bold700">Itinerary</p>
                  </div> */}
                  {/* trip flow end */}
                  <p onClick={() => printSavedPlaces()} className="m-0 page-subsubheading-bold">Itinerary</p>

                  {/* trip days */}
                  <div className="trip-information-div z-1 sticky">
                    <div className="trip-days flx-r flx-wrap gap-2">

                      {tripState.day_order.map((dayNum, id) => {
                        const day = tripState.days[dayNum]
                        return <div key={id} onClick={() => scrollToSection(id)} className={`dateBox-rounder px-2 pointer font-jakarta ${parseInt(flowBoxShowingIndex) === id ? "dateBox-rounder-selected" : null} `}>{day.day_short} {day.date_short}</div>
                      })}

                    </div>
                  </div>
                  {/* trip days end */}

                  <div className="itinerary-flow mt-3">


                    <DragDropContext onDragEnd={onDragEndItinerary}>
                      {tripState.day_order.map((dayNum, id) => {
                        const day = tripState.days[dayNum]
                        const places = day.placeIds.map((placeId) => tripState.places[placeId])

                        return <Suspense fallback={<LoadBox />} >
                          <div ref={e => refs.current[id] = e} key={id} className="">
                            <FlowBoxDraggable key={day.id} id={id} dayNum={dayNum} addSearchOpen={addSearchOpen} addSearchClose={addSearchClose} toggleFlow={toggleFlow} day={day} places={places} removePlace={removePlace} addPlaceFromFlowBox={addPlaceFromFlowBox} country={country} placeCardTitleCharLimit={placeCardTitleCharLimit} setPlaceCardTitleCharLimit={setPlaceCardTitleCharLimit} cardBodyRef={cardBodyRef} />
                          </div>
                        </Suspense>
                      })}
                    </DragDropContext>


                  </div>


                </div>
              </div>
            }
            {/* End Itinerary Display */}

            {/* Saved Places Display */}
            {selectedPlacesList === "Saved Places" &&
              <div className="itinerary-c2 flx-2 ws-normal">
                <div className="page-container96">
                  <p className="m-0 page-subheading-bold">Saved Places</p>
                  <p onClick={() => printSavedPlaces()} className="m-0 page-subsubheading-bold my-2">Here are all of your saved places. Don't forget to add them to your itinerary!</p>

                  <div className="placeCards-itinerary">
                    {savedPlaces.places.length > 0 ?
                      savedPlaces.places.map((savedPlace, index) => {
                        return <div key={index} className="placeCard2 flx-r position-relative">
                          <div className="placeCard-img-div flx-3">
                            <img className="placeCard2-img" src={savedPlace.imgURL} />
                          </div>
                          <div className="placeCard-body flx-5">
                            {/* <div className="popUp d-none">{savedPlace.info}</div> */}
                            <p className="body-title ">{savedPlace.placeName}</p>
                            {/* <p onClick={() => togglePopUp(index)} className="body-info pointer">{savedPlace.info}</p> */}
                            <p className="body-address">{savedPlace.address}</p>
                          </div>
                          <div className="placeCard-starOrDelete flx-c just-sb align-c">
                            <span className="material-symbols-outlined gray-text">
                              more_vert
                            </span>
                            <span onClick={() => removeFromSavedPlaces(savedPlace)} className="material-symbols-outlined gray-text showOnHover-50 pointer">
                              delete
                            </span>
                          </div>
                        </div>
                      })
                      :
                      <div className="add-places-card">
                        <span className="material-symbols-outlined xx-large">
                          bookmark
                        </span>
                        <p className="large bold700 my-1 o-50">Save places</p>
                        <p className="m-0 w-60 center-text o-50 addPlace-text">Want to revisit places that aren't in your itinerary? Add them to your saved places</p>
                      </div>
                    }

                  </div>

                </div>
              </div>
            }
            {/* End Saved Places Display */}

            {/* Suggested Places Display */}
            {selectedPlacesList === "Suggested Places" &&
              <div className="itinerary-c2 flx-2 ws-normal">
                <div className="page-container96">
                  <p className="m-0 page-subheading-bold">Suggested Places</p>

                  <p className="page-subsubheading-bold m-0 my-2">Here are some places in <span className="purple-text">{currentTrip.city ? currentTrip.city : "*city*"}</span> that you might like based on your travel preferences</p>

                  <div className="suggested-header-div sticky z-1">
                    {Object.values(userPreferences).includes(true) ?
                      <div className="suggestedCategories flx-r gap-2 my-2">
                        <div id='suggestedCategory-1' onClick={() => updateSuggestedPlacesFilter(1, "All")} className={`dateBox-rounder px-2 pointer ${suggestedPlacesFilter ? "unselected" : "selected"}`}>All</div>
                        {Object.entries(userPreferences).map((userPreference, index) => {
                          let category = userPreference[0];
                          let selected = userPreference[1];
                          let categoryTitle = mapBoxCategoryKey[category].categoryTitle
                          return selected && <div key={index} id={`suggestedCategory-${index + 2}`} onClick={() => updateSuggestedPlacesFilter(index + 2, categoryTitle)} className={`dateBox-rounder large px-2 pointer ${suggestedPlacesFilter === categoryTitle ? "selected" : "unselected"}`}>{categoryTitle}</div>
                        })}
                      </div>
                      : null}
                    {/* {Object.values(userPreferences).includes(true) ?
                  <div className="suggestedCategories flx-r gap-4 my-2">
                    <div id='suggestedCategory-1' onClick={() => updateSuggestedPlacesFilter(1, "All")} className={`option px-2 pointer ${suggestedPlacesFilter ? "unselected" : "selecte"}`}>
                      <span className="material-symbols-outlined xx-large mt-1 o-50">
                        globe
                        </span>
                        <p className="m-0 x-small">All</p>
                      </div>
                    {Object.entries(userPreferences).map((userPreference, index) => {
                      let category = userPreference[0];
                      let selected = userPreference[1];
                      let categoryTitle = mapBoxCategoryKey[category].categoryTitle
                      let imgUrl = mapBoxCategoryKey[category].imgUrl
                      return selected && <div key={index} id={`suggestedCategory-${index + 2}`} onClick={() => updateSuggestedPlacesFilter(index + 2, categoryTitle)} className={`option large px-2 pointer ${suggestedPlacesFilter === categoryTitle ? "selected" : "unselected"}`}>
                        <img src={imgUrl} alt="" className="option-img" />
                        <p className="m-0 x-small">{categoryTitle}</p>
                      </div>
                    })}
                  </div>
                  : null} */}
                    <div className="flx-r align-c">
                      {blacklist.length > 0 &&
                        <div onClick={() => undoHidePlace()} className="flx-r mt-2 align-c onHover-fadelite">
                          <span className="material-symbols-outlined purple-text medium mr-1">
                            undo
                          </span>
                          <p className="m-0 purple-text pointer small">Undo Hide</p>
                        </div>
                      }
                      <Link to='/survey-update' state={{ returnPage: "/itinerary/suggested-places" }} className='position-right'><p className="m-0 purple-text pointer my-2">Update Travel Preferences</p></Link>
                    </div>
                  </div>

                  <div className="placeCards-itinerary">

                    {/* {userInterestsTEST.length === 0 ?
                  <div className="add-places-card">
                    <span className="material-symbols-outlined xx-large">
                      map
                    </span>
                    <p className="large bold700 my-1 o-50">0 suggested places</p>
                    <p className="m-0 w-60 center-text o-50 addPlace-text">Update travel preferences to get place suggestions</p>
                  </div> : null} */}
                    {!Object.values(userPreferences).includes(true) &&
                      <div className="add-places-card">
                        <span className="material-symbols-outlined xx-large">
                          map
                        </span>
                        <p className="large bold700 my-1 o-50">0 suggested places</p>
                        <p className="m-0 w-60 center-text o-50 addPlace-text">Update travel preferences to get place suggestions</p>
                      </div>
                    }
                    {Object.values(userPreferences).includes(true) && suggestedPlaces.places.length === 0 &&
                      <div className="loadingBox-inline">
                        <Loading noMascot={true} innerText={"Loading..."} />
                      </div>
                    }
                    {suggestedPlaces.places.length > 0 &&
                      suggestedPlaces.places.map((suggestedPlace, index) => {
                        let filter = suggestedPlacesFilter ? suggestedPlacesFilter : false
                        let blacklisted = blacklist.includes(suggestedPlace.placeName) ? true : false
                        let added = false

                        if (!suggestedPlacesFilter) {
                          return suggestedPlace.placeName && !blacklisted ? <div key={index} className="placeCard2 position-relative flx-r my-2">

                            <div id={`added-${index}`} className="added-overlay abs-center font-jakarta x-large hidden-o">
                              <p className="m-0 purple-text">Added!</p>
                            </div>
                            <div className="placeCard-img-div flx-3">
                              <img onClick={() => addPlaceToConfirm(suggestedPlace)} className="placeCard2-img" src={suggestedPlace.imgURL} />
                            </div>
                            <div className="placeCard-body flx-5">
                              {/* <div onClick={() => togglePopUp(id)} id={`popUp-${id}`} className="popUp d-none">{suggestedPlace.categoryTitle}</div> */}
                              <p className="body-title ">{suggestedPlace.placeName}</p>
                              <p className="body-info pointer">{suggestedPlace.categoryTitle}</p>
                              <p className="body-address">{suggestedPlace.address}</p>
                            </div>
                            <div className="placeCard-starOrDelete position-relative flx-c just-sb align-c">
                              {/* suggested place popup */}
                              <div id={`suggestedPlace-popUp-${index}`} className="placeCard-popUp hidden-o">
                                <div onClick={() => addPlaceToConfirm(suggestedPlace)} className="option">
                                  <span className="material-symbols-outlined">
                                    map
                                  </span>
                                  <p className="m-0">View on Map</p>
                                </div>
                                <div onClick={() => addToSavedPlaces(suggestedPlace, "suggestedPlace")} className="option">
                                  <span className="material-symbols-outlined">
                                    bookmark
                                  </span>
                                  <p className="m-0">Add to Saved Places</p>
                                </div>
                              </div>
                              {/* End suggested place popup */}
                              {/* {added ?
                          <div onClick={() => { removePlace(addedPlaceAddresses.indexOf(suggestedPlace.address)) }} className="addIcon-filled-green-small flx mx-2 mt-2 pointer">
                            <span className="material-symbols-outlined m-auto mt-h medium white-text">
                              done
                            </span>
                          </div>
                          : 
                          }
                          */}
                              <div onClick={() => { toggleSuggestedPlacePopUp(index) }} className="addIcon-medium flx pointer mx-2 mt-2 onHover-dark">
                                <span className="material-symbols-outlined m-auto large">
                                  add
                                </span>
                              </div>

                              <span onClick={() => addToBlacklist(suggestedPlace.placeName)} className="material-symbols-outlined mx-3 my-2 onHover-50 pointer">
                                visibility_off
                              </span>
                            </div>
                          </div> : null
                        } else {
                          if (suggestedPlace.categoryTitle === filter) {

                            return suggestedPlace.placeName && !blacklisted ? <div key={index} className="placeCard2 position-relative flx-r my-2">

                              <div className="placeCard-img-div flx-3">
                                <img className="placeCard2-img" src={suggestedPlace.imgURL} />
                              </div>
                              <div className="placeCard-body flx-5">
                                {/* <div onClick={() => togglePopUp(id)} id={`popUp-${id}`} className="popUp d-none">{suggestedPlace.categoryTitle}</div> */}
                                <p className="body-title ">{suggestedPlace.placeName}</p>
                                <p className="body-info pointer">{suggestedPlace.categoryTitle}</p>
                                <p className="body-address">{suggestedPlace.address}</p>
                              </div>
                              <div className="placeCard-starOrDelete position-relative flx-c just-sb align-c">
                                {/* filtered suggested place popup */}
                                <div id={`suggestedPlace-popUp-${index}`} className="placeCard-popUp hidden-o">
                                  <div onClick={() => addPlaceToConfirm(suggestedPlace)} className="option">
                                    <span className="material-symbols-outlined">
                                      map
                                    </span>
                                    <p className="m-0">Add to Map</p>
                                  </div>
                                  <div className="option">
                                    <span className="material-symbols-outlined">
                                      bookmark
                                    </span>
                                    <p className="m-0">Add to Saved Places</p>
                                  </div>
                                </div>
                                {/* End filtered suggested place popup */}
                                {added ?
                                  <div onClick={() => { removePlace(addedPlaceAddresses.indexOf(suggestedPlace.address)) }} className="addIcon-filled-green-small flx mx-2 mt-2 pointer">
                                    <span className="material-symbols-outlined m-auto mt-h medium white-text">
                                      done
                                    </span>
                                  </div>
                                  :
                                  <div onClick={() => { toggleSuggestedPlacePopUp(index) }} className="addIcon-medium flx pointer mx-2 mt-2 onHover-fadelite">
                                    <span className="material-symbols-outlined m-auto medium">
                                      add
                                    </span>
                                  </div>}

                                <span className="material-symbols-outlined mx-3 my-2 onHover-50 pointer">
                                  visibility_off
                                </span>
                              </div>
                            </div> : null
                          }
                        }
                      })}


                  </div>
                </div>
              </div>
            }
            {/* End Suggeseted Places Display */}
          </div>



          

          <div className={`${mobileMode ? "carousel-item-pagewide" : "flx-5"}`}>
            {/* Side Map display */}
            <div className="itinerary-c3 ws-normal sticky">

              <div className={`sticky ${mobileMode && "flx"}`}>

                <div className={`it-map position-relative ${mobileMode && "m-auto"}`}>

                  <div id='daySelection' className="daySelection d-none">
                    <div className="day-selector">
                      <DaySelected open={openDaySelected} placeToConfirm={placeToConfirm} dateToConfirm={dateToConfirm} />
                      {/* <div className="daySelected position-absolute white-bg">
                    <p className="m-0 mt-3 mb-2 bold700">Added!</p>
                    <img className="daySelected-img" src={placeToConfirm.imgURL} />
                    <div className="daySelected-text"><span className="purple-text bold700">{placeToConfirm.placeName}</span> was added to <span className="purple-text bold700">DAY NAME</span> in your itinerary!</div>
                  </div> */}
                      <span onClick={() => closeDaySelection()} className="closeBtn2 material-symbols-outlined position-absolute x-large color-gains">
                        close
                      </span>
                      <div className="titleDiv">
                        <p className="title">Add to</p>
                      </div>
                      {tripState.day_order.map((dayNum, i) => {
                        const day = tripState.days[dayNum]
                        // const lightbulb_days = placeToConfirm ? placeToConfirm.lightbulb_days : []
                        // const lightbulb = lightbulb_days.includes(dayNum) ? true : false
                        return <div id='day-option' onClick={() => { addPlace(`day-${i + 1}`), updateDateToConfirm(day.day_short, day.date_short) }} className="day-option">
                          {/* <div className={`day-lightBulb flx ${placeToConfirm && placeToConfirm.lightbulb_days.includes(dayNum) ? null : "o-none"} tooltip`}> */}
                          <div className={`day-lightBulb flx ${lightbulbDays && lightbulbDays.includes(dayNum) ? null : "o-none"} tooltip`}>
                            <div className="tooltiptext">The lightbulb icon indicates the day that has the closest activities</div>
                            <span class="material-symbols-outlined m-auto gray-text normal-cursor">
                              emoji_objects
                            </span>
                            {/* <img src="https://i.imgur.com/mplOdwv.png" alt="" className="lightbulb-icon" /> */}
                          </div>
                          <div className="text">
                            <p className="m-0 bold500">{day.date_converted.split(",")[0]}</p>
                            <p className="m-0 bold500 small gray-text">{day.date_converted.split(",").slice(1)}</p>
                          </div>
                        </div>
                      })}


                    </div>
                  </div>




                  {placeToConfirm &&
                    <div id='placeToConfirmCard' className={`placeToConfirmCard position-absolute ${placeToConfirmAnimation ? "show" : "hide"}`}>
                      <div className="placeCard-PTC w-97 position-relative flx-r my-2">

                        <span onClick={() => clearPlaceToConfirm()} className="closeBtn-PTC material-symbols-outlined position-absolute showOnHover x-large color-gains">
                          close
                        </span>

                        <div onClick={() => toggleSavedPlaces(placeToConfirm)} className="saveBtn">
                          <img src={`${savedPlaces.addresses.includes(placeToConfirm.address) ? "https://i.imgur.com/o7IoL2K.png" : "https://i.imgur.com/TcS7RjD.png"}`} alt="" className={`${savedPlaces.addresses.includes(placeToConfirm.address) ? "icon-img-selected" : "icon-img"}`} />
                          {/* <span className={`material-symbols-outlined white-text ${savedPlaces.addresses.includes(placeToConfirm.address) ? "purple-text" : null}`}>
                        bookmark
                      </span> */}

                        </div>

                        <div className="placeCard-img-div flx-1">
                          <img className="placeCard-img" src={placeToConfirm.imgURL} />
                        </div>
                        <div ref={ptcCardBodyRef} className="placeToConfirmCard-body flx-2">
                          <div onClick={() => togglePopUp('PTC')} id='popUp-PTC' className="popUp d-none position-absolute">{placeToConfirm.info}</div>
                          <p className="body-title-PTC">{placeToConfirm.placeName.length > charLimit ? placeToConfirm.placeName.slice(0, placeToConfirmCardTitleCharLimit) + "..." : placeToConfirm.placeName}</p>
                          {/* <p onClick={() => togglePopUp('PTC')} className="body-info-PTC pointer mb-1">{placeToConfirm.info}</p> */}
                          <p className="body-info-PTC pointer mb-1">{placeToConfirm.category.split(',')[0].charAt(0).toUpperCase() + placeToConfirm.category.split(',')[0].slice(1)}</p>
                          <p className="body-address-PTC m-0">{placeToConfirm.address}</p>

                          <div className="flx-r position-bottom">
                            <div onClick={() => openDaySelection()} className="add-place-btn onHover-fadelite">
                              <div className="flx pointer mx-2">
                                <span className="material-symbols-outlined m-auto medium purple-text">
                                  add
                                </span>
                              </div>
                              <p className="m-0 purple-text">Add to itinerary</p>
                            </div>
                          </div>

                          {/* <div className="flx">
                        <div className="addTab">
                          <span className="material-symbols-outlined purple-text large">
                            add
                          </span>
                          <p className="m-0 purple-text">Add to places</p>
                        </div>
                      </div> */}

                        </div>
                      </div>
                    </div>
                  }



                  {/* <OpenMap markers={markers} newPlaceMarker={newPlaceMarker} mapCenter={currentTrip.geocode ? currentTrip.geocode : [51.50735, -0.12776]} /> */}
                  <OpenMapBox mapCenter={currentTrip.geocode ? currentTrip.geocode : [51.50735, -0.12776]} mapCenterToggle={mapCenterToggle} newPlaceMarker={newPlaceMarker} markers={markers} addPlaceToConfirm={addPlaceToConfirm} />
                </div>


                {/* Suggested places */}
                {/* <div className="page-subheading-bold my-3 dark-text">Suggested places</div>

            <div className="hideOverFlow flx-c">

              <div className="suggestion-row flx-">



                <div className="card-model inflex position-relative flx-c mr-3">
                  <div className="addIcon position-absolute flx onHover-fade pointer">
                    <span className="material-symbols-outlined m-auto">
                      add
                    </span>
                  </div>
                  <img src="https://i.imgur.com/lw40mp9.jpg" alt="" className="cardModel-img" />
                  <div className="cardModel-text">
                    <p className="m-0 page-subsubheading">Title of place</p>
                    <p className="m-0">Info</p>
                  </div>
                </div>

                <div className="card-model inflex position-relative flx-c mr-3">
                  <div className="addIcon position-absolute flx onHover-fade pointer">
                    <span className="material-symbols-outlined m-auto">
                      add
                    </span>
                  </div>
                  <img src="https://i.imgur.com/lw40mp9.jpg" alt="" className="cardModel-img" />
                  <div className="cardModel-text">
                    <p className="m-0 page-subsubheading">Title of place</p>
                    <p className="m-0">Info</p>
                  </div>
                </div>

                <div className="card-model inflex position-relative flx-c mr-3">
                  <div className="addIcon position-absolute flx onHover-fade pointer">
                    <span className="material-symbols-outlined m-auto">
                      add
                    </span>
                  </div>
                  <img src="https://i.imgur.com/lw40mp9.jpg" alt="" className="cardModel-img" />
                  <div className="cardModel-text">
                    <div className="page-subsubheading">Title of place</div>
                    <p className="m-0">Info</p>
                  </div>

                </div>

              </div>
            </div> */}



              </div>


              <div className="empty-6"></div>


            </div>
            {/* End Side Map display */}
          </div>

        </div>
      </div >

      <div className="flx-r">
        <div className="itinerary-sidebar-placeholder">

        </div>

        <div className="position-right mr-5">

          {/* Completion buttons */}
          < div className="save-btn-row flx-r flx-wrap just-ce mt-5" >
            <button className="btn-outlineflex large center-text mx-2">Back to Dashboard</button>
            <button className="btn-primaryflex w-2h large center-text mx-2">Share Itinerary</button>
          </div >
          {/* End Completion buttons */}

          <h1 className='empty-3'></h1>


        </div>
      </div>

    </>
  )
}
