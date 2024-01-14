import React, { Suspense, createRef, useEffect, useState } from 'react'
import { PlaceCard } from '../components/PlaceCard'
import { Link } from 'react-router-dom'
import { SearchPlace } from '../components/SearchPlace'
import { FlowBox } from '../components/FlowBox'
import { useRef, lazy } from 'react'
import { OpenMap } from '../components/OpenMap'
import { auth } from '../firebase'
import { DragDropContext } from 'react-beautiful-dnd'
import Scrollbars from 'react-custom-scrollbars-2'
import axios from 'axios'
import LoadBox from '../components/LoadBox'
import DaySelected from '../components/DaySelected'
// import FlowBoxDraggable from '../components/FlowBoxDraggable'

const FlowBoxDraggable = lazy(() => import('../components/FlowBoxDraggable'));

export const Itinerary = ({ tripId, setTripID, currentTrip, setCurrentTrip, clearCurrentTrip }) => {
  // if (!currentTrip) return null
  const [placeToConfirm, setPlaceToConfirm] = useState(null);
  const [lightbulbDays, setLightbulbDays] = useState([]);
  const [markers, setMarkers] = useState(null);
  const [country, setCountry] = useState(currentTrip.country_2letter ? currentTrip.country_2letter : 'gb');
  const [searchText, setSearchText] = useState('');
  const [panelSearchText, setPanelSearchText] = useState('');
  const [auto, setAuto] = useState([]);
  const tripDays =
  {
    tripID: "",
    days: [
      {
        date_converted: "Wednesday, November 8",
        day_short: "Wed",
        date_short: "11/8",
        dayName: "",
        places: [
          {
            placeName: "Traflagar Square",
            info: "Open 24 hours",
            address: "Trafalgar Sq, London WC2N 5DS, UK",
            imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
            lat: 51.50806,
            long: -0.12806,
            geocode: [51.50806, -0.12806]
          },
          {
            placeName: "Tate Modern",
            info: "Mon-Sun 10 AM-6 PM",
            address: "Bankside, London SE1 9TG, UK",
            imgURL: "https://i.imgur.com/FYc6OB3.jpg",
            lat: 51.507748,
            long: -0.099469,
            geocode: [51.507748, -0.099469]
          }
        ]
      },
      {
        date_converted: "Thursday, November 9",
        day_short: "Thurs",
        date_short: "11/9",
        dayName: "",
        places: [
          {
            placeName: "Hyde Park",
            info: "Mon-Sun 5 AM-12 AM",
            address: "Hyde Park, London W2 2UH, UK",
            imgURL: "https://i.imgur.com/tZBnXz4.jpg",
            lat: 51.502777,
            long: -0.151250,
            geocode: [51.502777, -0.151250]
          },
          {
            placeName: "Buckingham Palace",
            info: "Tours Start at 9am",
            address: "Buckingham Palace, London SW1A 1AA, UK",
            imgURL: "https://i.imgur.com/lw40mp9.jpg",
            lat: 51.501476,
            long: -0.140634,
            geocode: [51.501476, -0.140634]
          }
        ]
      },
      {
        date_converted: "Friday, November 10",
        dayName: "",
        day_short: "Fri",
        date_short: "11/10",
        places: [
          {
            placeName: "Borough Market",
            info: "Closed Mondays, Tues-Sun 10 AM-5 PM",
            address: "Borough Market, London SE1 9AL, UK",
            imgURL: "https://i.imgur.com/9KiBKqI.jpg",
            lat: 51.50544,
            long: -0.091249,
            geocode: [51.50544, -0.091249]
          },
          {
            placeName: "Trafalgar Square",
            info: "Open 24 hours",
            address: "Trafalgar Sq, London WC2N 5DS, UK",
            imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
            lat: 51.50806,
            long: -0.12806,
            geocode: [51.50806, -0.12806]
          }
        ]
      },
      {
        date_converted: "Saturday, November 11",
        dayName: "",
        day_short: "Sat",
        date_short: "11/11",
        places: [
          {
            placeName: "Borough Market",
            info: "Closed Mondays, Tues-Sun 10 AM-5 PM",
            address: "Borough Market, London SE1 9AL, UK",
            imgURL: "https://i.imgur.com/9KiBKqI.jpg",
            lat: 51.50544,
            long: -0.091249,
            geocode: [51.50544, -0.091249]
          },
          {
            placeName: "Trafalgar Square",
            info: "Open 24 hours",
            address: "Trafalgar Sq, London WC2N 5DS, UK",
            imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
            lat: 51.50806,
            long: -0.12806,
            geocode: [51.50806, -0.12806]
          }
        ]
      }
    ]
  }
  // useEffect(() => {
  //   // for loop thru each day index
  //   // merge each day.places to larger list called allDays.places
  //   // [ {gc: } {gc: } {gc: } {gc: } ]
  //   tripDays['allDays'] = {
  //     places: []
  //   }
  //   for (let i = 0; i < tripDays.days.length; i++) {
  //     // console.log(tripDays.days[i])
  //     for (let j = 0; j < tripDays.days[i].places.length; j++) {
  //       tripDays.allDays.places.push(tripDays.days[i].places[j])
  //       // console.log(tripDays.days[i].places[j])
  //     }
  //   }
  //   setMarkers(Object.values(tripState.places))
  //   // console.log(tripDays)
  // }, [])




  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

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

  const flowBoxSize = (id) => {
    const flowBox = document.getElementById(`flowBox-${id}`)
    let height = flowBox.offsetHeight
    console.log(height)
  }

  let refs = useRef([])
  useEffect(() => {
    refs.current = refs.current.slice(0, tripData.day_order.length)
  }, [])

  // const myRef  = useRef(null);
  // const executeScroll = () => myRef.current.scrollIntoView();
  const scrollToSection = (refID) => {
    // console.log('scrolling')
    // console.log(refs)
    window.scrollTo({
      top: refs.current[refID].offsetTop,
      behavior: "smooth"
    })
  }

  const getCityImg = async (imgQuery) => {
    const response = await axios.get(`https://api.unsplash.com/search/photos/?client_id=S_tkroS3HrDo_0BTx8QtZYvW0IYo0IKh3xNSVrXoDxo&query=${imgQuery}`)
    return response.status === 200 ? response.data : "error"

  }
  const loadCityImg = async (imgQuery) => {
    const data = await getCityImg(imgQuery)
    // console.log(data)
    console.log(data.results[0].urls.regular)
    return data.results[0].urls.regular
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
    let imgQuery = place.name.replace(/ /g, '-')
    let placeInfo = await loadPlaceDetails(place.place_id)
    let imgUrl = await loadCityImg(imgQuery)
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
    let days = {}
    for (let dayNum of tripState.day_order) {
      let day = tripState.days[dayNum]
      let dist = Math.sqrt((place.lat - day.centroid[0]) ** 2 + (place.lon - day.centroid[1]) ** 2)
      days[dayNum] = dist
    }
    let min_dist = 99999999999
    let dist_list = Object.values(days)
    // console.log(dist_list)
    for (let i = 0; i < dist_list.length; i++) {
      // console.log(parseFloat(dist_list[i]))
      if (min_dist > parseFloat(dist_list[i])) {
        min_dist = dist_list[i]
      }
    }
    console.log("min dist =", min_dist)
    let lightbulb_days = []
    for (let [dayNum, dist] of Object.entries(days)) {
      if (dist === min_dist) {
        lightbulb_days.push(dayNum)
      }
    }
    console.log("lightbulb days are = ", lightbulb_days)
    newPlace["lightbulb_days"] = lightbulb_days
    setLightbulbDays(lightbulb_days)
    setPlaceToConfirm(newPlace)
    resetSearch()
    resetPanelSearch()
  }
  const [currentTimeout, setCurrentTimeout] = useState(null);
  useEffect(() => {

    if (currentTimeout) {
      clearTimeout(currentTimeout)
    }
    if (searchText) {
      if (searchText.length > 2) {
        setCurrentTimeout(setTimeout(loadSearchData, 500))
      }
    } else if (searchText === '') {
      let autoComplete = document.getElementById('autocomplete-container')
      autoComplete.classList.add('d-none')
    }
  }, [searchText])
  useEffect(() => {

    if (currentTimeout) {
      clearTimeout(currentTimeout)
    }
    if (panelSearchText) {
      if (panelSearchText.length > 2) {
        setCurrentTimeout(setTimeout(loadSearchDataForPanel, 500))
      }
    } else if (panelSearchText === '') {
      let autoComplete = document.getElementById('autocomplete-container-map-panel')
      autoComplete.classList.add('d-none')
    }
  }, [panelSearchText])

  const getSearchData = async () => {
    if (searchText.length < 2) {
      // console.log('')
      resetSearch()
    } else {
      const apiKey = "3e9f6f51c89c4d3985be8ab9257924fe"
      let url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${searchText}&bias=countrycode:${country.toLowerCase()}&limit=5&format=json&filter=countrycode:${country.toLowerCase()}&apiKey=${apiKey}`
      console.log(url)
      const response = await axios.get(url)
      return response.status === 200 ? response.data : null
      // proximity:
    }
  }
  const getPanelSearchData = async () => {
    if (panelSearchText.length < 2) {
      // console.log('')
      resetPanelSearch()
    } else {
      const apiKey = "3e9f6f51c89c4d3985be8ab9257924fe"
      let url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${panelSearchText}&bias=countrycode:${country.toLowerCase()}&limit=5&format=json&filter=countrycode:${country.toLowerCase()}&apiKey=${apiKey}`
      console.log(url)
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
  const loadSearchDataForPanel = async () => {
    let data = await getPanelSearchData()
    console.log(data)
    setAuto(data.results)
    // open search box
    let autoComplete = document.getElementById('autocomplete-container-map-panel')
    autoComplete.classList.remove('d-none')
  }

  const updateSearchText = (e) => {
    setSearchText(e.target.value)
  }
  const updatePanelSearchText = (e) => {
    setPanelSearchText(e.target.value)
  }
  const resetSearch = (modifier) => {
    let searchInput = document.getElementById('searchInput')
    let autoComplete = document.getElementById('autocomplete-container')
    if (modifier) {
      searchInput = document.getElementById(`searchInput-${modifier}`)
      autoComplete = document.getElementById(`autocomplete-container-${modifier}`)
    }
    searchInput.value = ""
    setSearchText('');
    autoComplete.classList.add('d-none')
  }

  const resetPanelSearch = () => {
    let searchInput = document.getElementById('searchInput-map-panel')
    let autoComplete = document.getElementById('autocomplete-container-map-panel')
    searchInput.value = ""
    setPanelSearchText('');
    autoComplete.classList.add('d-none')
  }



  const togglePopUp = (index) => {
    let popUp = document.getElementById(`popUp-${index}`)
    popUp.classList.toggle('d-none')
  }

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

  const addPlaceFromFlowBox = async (dayNum, place) => {
    // {run imgquery on place.name + country}
    let imgQuery = place.name.replace(/ /g, '-')
    // {run place details query with place_id}
    let placeInfo = await loadPlaceDetails(place.place_id)
    let imgUrl = await loadCityImg(imgQuery)

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


    let tripStateCopy = { ...tripState }
    // create a new place id for the place by incrementing places_last, and add the id key to the place object
    tripStateCopy.places[parseInt(tripStateCopy.places_last) + 1] = {
      id: parseInt(tripStateCopy.places_last) + 1,
      ...newPlace,
    }
    // increment places_last
    tripStateCopy.places_last = parseInt(tripStateCopy.places_last) + 1
    // add place to the desired day
    tripStateCopy.days[dayNum].placeIds.push(tripStateCopy.places_last)
    setTripState(tripStateCopy)

    // {update place object w/ info and imgUrl}
    // {add place to tripState}
    // {use placesLast + 1 as id of place and add to day[dayNum]}
    // {increment placesLast}
  }

  const addPlace = (dayNum, modifier) => {
    let place = placeToConfirm
    if (place.lightbulb_days) {
      delete place.lightbulb_days
    }
    let tripStateCopy = { ...tripState }
    // create a new place id for the place
    tripStateCopy.places[parseInt(tripStateCopy.places_last) + 1] = {
      id: parseInt(tripStateCopy.places_last) + 1,
      ...place,
    }
    tripStateCopy.places_last = parseInt(tripStateCopy.places_last) + 1
    tripStateCopy.days[dayNum].placeIds.push(tripStateCopy.places_last)
    setTripState(tripStateCopy)
    // closeDaySelection()
    // clearPlaceToConfirm()
    console.log(tripStateCopy)
    confirmPlaceAdded(modifier)
  }

  const removePlace = (dayNum, placeId) => {
    // tripState > days[dayNum] > remove placeIds[placeId]
    const tripStateCopy = { ...tripState }
    let index = tripStateCopy.days[dayNum].placeIds.indexOf(placeId)
    tripStateCopy.days[dayNum].placeIds.splice(index, 1)
    delete tripStateCopy.places[placeId]
    setTripState(tripStateCopy)
    console.log(tripStateCopy)
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
    wait(5000).then(() => {
      setOpenDaySelected(false)
      closeDaySelection(modifier)
      clearPlaceToConfirm()
      daySelection.style.removeProperty('height')
    })
    wait(5500).then(() => {
      placeToConfirmCard.classList.remove('o-none')
      daySelection.classList.remove('o-none')
      setPlaceConfirmationAnimation(false)
    })

  }



  // drag n drop code test data
  const tripTestData = {
    tripID: "",
    places_last: 8,
    places: {
      1: {
        id: 1,
        placeName: "Traflagar Square",
        info: "Open 24 hours",
        address: "Trafalgar Sq, London WC2N 5DS, UK",
        imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
        lat: 51.50806,
        long: -0.12806,
        geocode: [51.50806, -0.12806]
      },
      2: {
        id: 2,
        placeName: "Tate Modern",
        info: "Mon-Sun 10 AM-6 PM",
        address: "Bankside, London SE1 9TG, UK",
        imgURL: "https://i.imgur.com/FYc6OB3.jpg",
        lat: 51.507748,
        long: -0.099469,
        geocode: [51.507748, -0.099469]
      },
      3: {
        id: 3,
        placeName: "Hyde Park",
        info: "Mon-Sun 5 AM-12 AM",
        address: "Hyde Park, London W2 2UH, UK",
        imgURL: "https://i.imgur.com/tZBnXz4.jpg",
        lat: 51.502777,
        long: -0.151250,
        geocode: [51.502777, -0.151250]
      },
      4: {
        id: 4,
        placeName: "Buckingham Palace",
        info: "Tours Start at 9am",
        address: "Buckingham Palace, London SW1A 1AA, UK",
        imgURL: "https://i.imgur.com/lw40mp9.jpg",
        lat: 51.501476,
        long: -0.140634,
        geocode: [51.501476, -0.140634]
      },
      5: {
        id: 5,
        placeName: "Borough Market",
        info: "Closed Mondays, Tues-Sun 10 AM-5 PM",
        address: "Borough Market, London SE1 9AL, UK",
        imgURL: "https://i.imgur.com/9KiBKqI.jpg",
        lat: 51.50544,
        long: -0.091249,
        geocode: [51.50544, -0.091249]
      },
      6: {
        id: 6,
        placeName: "Traflagar Square",
        info: "Open 24 hours",
        address: "Trafalgar Sq, London WC2N 5DS, UK",
        imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
        lat: 51.50806,
        long: -0.12806,
        geocode: [51.50806, -0.12806]
      },
      7: {
        id: 7,
        placeName: "Borough Market",
        info: "Closed Mondays, Tues-Sun 10 AM-5 PM",
        address: "Borough Market, London SE1 9AL, UK",
        imgURL: "https://i.imgur.com/9KiBKqI.jpg",
        lat: 51.50544,
        long: -0.091249,
        geocode: [51.50544, -0.091249]
      },
      8: {
        id: 8,
        placeName: "Traflagar Square",
        info: "Open 24 hours",
        address: "Trafalgar Sq, London WC2N 5DS, UK",
        imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
        lat: 51.50806,
        long: -0.12806,
        geocode: [51.50806, -0.12806]
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



  const tripData = currentTrip.itinerary ? currentTrip.itinerary : tripTestData

  useEffect(() => {
    console.log(currentTrip.itinerary)
    console.log(currentTrip)
  }, [])


  const [tripState, setTripState] = useState(currentTrip.itinerary ? currentTrip.itinerary : tripTestData);
  useEffect(() => {
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
    console.log(tripStateCopy)
    setTripState(tripStateCopy)
  }


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

    // if user drops in same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) { return; }

    // if user drops in same container but different position
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

    // if user drops in different container
    const startPlaceIds = Array.from(sourceDay.placeIds);
    const [removed] = startPlaceIds.splice(source.index, 1);
    const newStartDay = {
      ...sourceDay,
      placeIds: startPlaceIds,
    }

    const endPlaceIds = Array.from(destinationDay.placeIds)
    endPlaceIds.splice(destination.index, 0, removed);
    const newEndDay = {
      ...destinationDay,
      placeIds: endPlaceIds,
    }

    const newState = {
      ...tripState,
      days: {
        ...tripState.days,
        [newStartDay.id]: newStartDay,
        [newEndDay.id]: newEndDay,
      }
    }
    setTripState(newState);
  }

  const [placeConfirmationAnimation, setPlaceConfirmationAnimation] = useState(false);

  useEffect(() => {
    let markersArr = Object.values(tripState.places)
    if (placeToConfirm && !placeConfirmationAnimation) {
      markersArr.push(placeToConfirm)
    } 
    setMarkers(markersArr)
  }, [tripState, placeToConfirm, placeConfirmationAnimation])



  const [dateToConfirm, setDateToConfirm] = useState(null);


  const updateDateToConfirm = (day, date) => {
    setDateToConfirm(day + ", " + date)
    // console.log(day+", "+date)
  }

  const updateDayName = (e, dayNum) => {
    tripStateCopy = { ...tripState }
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

  useEffect(() => {
    window.addEventListener("resize", resizeDayPanel, false)
    hideDayPanel()
    hideMapPanel()
  }, [])

  const resizeDayPanel = () => {
    // let dayPanel = document.getElementById('dayPanel')
    if (window.innerWidth <= 768) {
      hideDayPanel()
    } else {
      hideDayPanel()
    }
  }



  return (
    <>
      <div className="itinerary-page flx-r">
        <div id='dayPanel' className="itinerary-c1">



          <div onClick={() => showDayPanel()} id='showDayPanelBtn' className="arrowToOpen">
            <span className="material-symbols-outlined o-50 xx-large onHover-fade position-fixed z-1 top-128">
              keyboard_double_arrow_right
            </span>
          </div>

          <div className="dayPanelContainer">
            <div id='dayPanelBody' className="it-column1 white-bg position-fixed ml-3 flx-c align-c o-none d-none">
              <img src="https://i.imgur.com/46q31Cx.png" alt="" className="vertical-logo" />

              <div onClick={() => hideDayPanel()} className="arrowToClose my-2">
                <span className="material-symbols-outlined o-50 xx-large right onHover-fade">
                  keyboard_double_arrow_left
                </span>
              </div>

              <button className="btn-secondaryflex">
                <span className="material-symbols-outlined btn-symbol v-align x-large white-text">
                  expand_more
                </span>
                <p className="inline v-align white-text">Itinerary &nbsp;&nbsp;</p>
              </button>

              <div className="it-datesPanel w-100 flx-c mt-3">
                {/* {Array.isArray(tripDays.days) ? tripDays.days.map((day, id) => {
                  return <div key={id} onClick={() => scrollToSection(id)} className="day-date flx-r onHover-fade pointer">
                    <p className="it-dateBlock my-1 flx-1 gray-text">{day.day_short}</p>
                    <p className="it-dayBlock my-1 flx-1 gray-text">{day.date_short}</p>
                  </div>
                }) : null
                } */}

                {tripState.day_order.map((dayNum, id) => {
                  const day = tripState.days[dayNum]

                  return <div key={id} onClick={() => scrollToSection(id)} className="day-date flx-r onHover-fade pointer">
                    <p className="it-dateBlock my-1 flx-1 gray-text">{day.day_short}</p>
                    <p className="it-dayBlock my-1 flx-1 gray-text">{day.date_short}</p>
                  </div>
                })}
              </div>
            </div>
          </div>

        </div>

        <div className="itinerary-c2 flx-1">
          <div className="page-container96">
            <div className="tripFlow flx-r">
              <Link to='/dashboard'><p className="m-0 purple-text">Create Trip</p></Link>
              <span className="material-symbols-outlined">
                arrow_right
              </span>
              <Link to='/add-places'><p className="m-0 purple-text">Add Places</p></Link>
              <span className="material-symbols-outlined">
                arrow_right
              </span>
              <p className="m-0 purple-text bold700">Itinerary</p>
            </div>
            {/* <Link to='/add-places' className=''>
              <span className="material-symbols-outlined v-tbott mr-2 purple-text">
                arrow_back
              </span>
              <p className="inline large purple-text">Back</p>
            </Link> */}
            <p className="page-heading-bold m-0">Hey {auth.currentUser ? auth.currentUser.displayName : "Josh"},</p>
            <p className="page-heading-bold m-0 mb-2">Here's your trip itinerary!</p>
            {/* <div className="flx-r onHover-fadelite">
              <p className="mt-1 mb-3 purple-text"><span className="material-symbols-outlined v-bott mr-2 purple-text">
                add
              </span>Add hotel or other accommodation***</p>
            </div> */}

            <div className="itinerary-flow mt-3">

              {/* {Array.isArray(tripDays.days) ? tripDays.days.map((day, i) => {
                return <div ref={el => refs.current[i] = el} key={i}>
                  <FlowBox id={i} toggleFlow={toggleFlow} addSearchOpen={addSearchOpen} addSearchClose={addSearchClose} day={day} />
                </div>
              }) : null
              } */}


              <DragDropContext onDragEnd={onDragEndItinerary}>
                {tripState.day_order.map((dayNum, id) => {
                  const day = tripState.days[dayNum]
                  const places = day.placeIds.map((placeId) => tripState.places[placeId])

                  return <Suspense fallback={<LoadBox />} >
                    <div ref={el => refs.current[id] = el} key={id} className="">
                      <FlowBoxDraggable key={day.id} id={id} dayNum={dayNum} addSearchOpen={addSearchOpen} addSearchClose={addSearchClose} toggleFlow={toggleFlow} day={day} places={places} removePlace={removePlace} addPlaceFromFlowBox={addPlaceFromFlowBox} country={country} />
                    </div>
                  </Suspense>
                })}
              </DragDropContext>


            </div>


          </div>
        </div>

        {/* Map Panel */}
        <div id='panelBtns' className="position-absolute panel-btns">
          <span id='leftPanelOpen' onClick={() => showDayPanel()} className="material-symbols-outlined mx-3 mt-1 white-text">
            left_panel_open
          </span>
          <span id='leftPanelClose' onClick={() => hideDayPanel()} className="material-symbols-outlined mx-3 mt-1 white-text d-none">
            left_panel_close
          </span>
          <span onClick={() => showMapPanel()} className="material-symbols-outlined mt-1 white-text mx-3">
            map
          </span>
        </div>
        <div id='map-panel' className="map-panel flx-c">
          <div className="closeMap flx-r just-en">
            <div className="closeMap-btn">
              <span onClick={() => hideMapPanel()} className="material-symbols-outlined mx-2">close</span>
            </div>
          </div>
          <div className="map-panelContent flx">
            <div className="it-panelMap position-relative">
              <div className="searchBar position-absolute w-100 z-1000">
                <div className="position-relative w-100 h-100">
                  <div id='autocomplete-container-map-panel' className="mapSearch-dropdown flx-c">
                    {auto ? auto.map((result, i) => {
                      return <div key={i} onClick={() => addPlaceToConfirm(result)} className="result ws-nowrap onHover-option">
                        <div className="inner-contain flx-r w-96 hideOverflow m-auto">
                          <img src="https://i.imgur.com/ukt1lYj.png" alt="" className="small-pic mr-1" />
                          <p className="m-0 my-2 large">{result.formatted}</p>
                        </div>
                      </div>
                    }) : null}

                  </div>
                  <span className="material-symbols-outlined position-absolute location-icon-placeholder">
                    location_on
                  </span>

                  {panelSearchText.length > 0 ?
                    <span onClick={() => resetPanelSearch()} className="material-symbols-outlined position-absolute search-icon-overlay pointer onHover-black">
                      close
                    </span>
                    :
                    <span className="material-symbols-outlined position-absolute search-icon-overlay">
                      search
                    </span>
                  }
                  <input onChange={(e) => updatePanelSearchText(e)} id='searchInput-map-panel' type='text' className="input-search-map-overlay position-absolute" placeholder='Search places...' />
                </div>
              </div>

              <div id='daySelection-map-panel' className="daySelection position-absolute d-none">
                <div className="position-relative flx-c align-c w-100">
                  <DaySelected open={openDaySelected} placeToConfirm={placeToConfirm} dateToConfirm={dateToConfirm} />
                  <span onClick={() => closeDaySelection('map-panel')} className="closeBtn2 material-symbols-outlined position-absolute x-large color-gains">
                    close
                  </span>
                  <p className="m-0 mt-3 mb-2 bold700">Add to:</p>
                  {tripState.day_order.map((dayNum, i) => {
                    const day = tripState.days[dayNum]
                    return <div id='day-option' className="day-option w-100 flx-r">
                      <div className={`day-lightBulb flx ${lightbulbDays && lightbulbDays.includes(dayNum) ? null : "o-none"} tooltip`}>
                        <div className="tooltiptext">The lightbulb icon indicates the day that has the closest activities</div>
                        <span class="material-symbols-outlined m-auto">
                          lightbulb
                        </span>
                      </div>
                      <button onClick={() => { addPlace(`day-${i + 1}`, "map-panel"), updateDateToConfirm(day.day_short, day.date_short) }} className="dayOption my-h">{day.day_short}, {day.date_short}</button>
                    </div>
                  })}
                  <div className="mb-3"></div>
                </div>
              </div>

              {placeToConfirm &&
                <div id='placeToConfirmCard-map-panel' className="placeToConfirmCard position-absolute">
                  <div className="placeCard-PTC w-97 position-relative flx-r my-2">

                    <span onClick={() => clearPlaceToConfirm()} className="closeBtn material-symbols-outlined position-absolute showOnHover x-large color-gains">
                      close
                    </span>

                    <div className="placeCard-img-div flx-1">
                      <img className="placeCard-img" src={placeToConfirm.imgURL} />
                    </div>
                    <div className="placeCard-body flx-2">
                      <div onClick={() => togglePopUp('PTC-map-panel')} id='popUp-PTC-map-panel' className="popUp d-none position-absolute">{placeToConfirm.info}</div>
                      <p className="body-title">{placeToConfirm.placeName}</p>
                      <p onClick={() => togglePopUp('PTC-map-panel')} className="body-info pointer mb-1">{placeToConfirm.info}</p>
                      <p className="body-address-PTC m-0">{placeToConfirm.address}</p>
                      <div onClick={() => openDaySelection('map-panel')} className="flx right pr-4 onHover-fadelite">
                        <div className="addIcon-small flx pointer mx-2">
                          <span className="material-symbols-outlined m-auto medium purple-text">
                            add
                          </span>
                        </div>
                        <p className="m-0 purple-text">Add to places</p>
                      </div>
                    </div>
                  </div>
                </div>
              }


              <OpenMap markers={markers} mapCenter={currentTrip.geocode ? currentTrip.geocode : [51.50735, -0.12776]} />
            </div>
          </div>

        </div>
        {/* End Map Panel */}



        <div className="itinerary-c3">


          <div className="sticky">


            <div className="it-map position-relative">



              <div className="searchBar position-absolute w-100 z-1000">
                <div className="position-relative w-100 h-100">
                  <div id='autocomplete-container' className="mapSearch-dropdown flx-c">
                    {auto ? auto.map((result, i) => {
                      return <div key={i} onClick={() => addPlaceToConfirm(result)} className="result ws-nowrap onHover-option">
                        <div className="inner-contain flx-r w-96 hideOverflow m-auto">
                          <img src="https://i.imgur.com/ukt1lYj.png" alt="" className="small-pic mr-1" />
                          <p className="m-0 my-2 large">{result.formatted}</p>
                        </div>
                      </div>
                    }) : null}

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




              <div id='daySelection' className="daySelection position-absolute d-none">
                <div className="position-relative flx-c align-c w-100">
                  <DaySelected open={openDaySelected} placeToConfirm={placeToConfirm} dateToConfirm={dateToConfirm} />
                  {/* <div className="daySelected position-absolute white-bg">
                    <p className="m-0 mt-3 mb-2 bold700">Added!</p>
                    <img className="daySelected-img" src={placeToConfirm.imgURL} />
                    <div className="daySelected-text"><span className="purple-text bold700">{placeToConfirm.placeName}</span> was added to <span className="purple-text bold700">DAY NAME</span> in your itinerary!</div>
                  </div> */}
                  <span onClick={() => closeDaySelection()} className="closeBtn2 material-symbols-outlined position-absolute x-large color-gains">
                    close
                  </span>
                  <p className="m-0 mt-3 mb-2 bold700">Add to:</p>
                  {tripState.day_order.map((dayNum, i) => {
                    const day = tripState.days[dayNum]
                    // const lightbulb_days = placeToConfirm ? placeToConfirm.lightbulb_days : []
                    // const lightbulb = lightbulb_days.includes(dayNum) ? true : false
                    return <div id='day-option' className="day-option w-100 flx-r">
                      {/* <div className={`day-lightBulb flx ${placeToConfirm && placeToConfirm.lightbulb_days.includes(dayNum) ? null : "o-none"} tooltip`}> */}
                      <div className={`day-lightBulb flx ${lightbulbDays && lightbulbDays.includes(dayNum) ? null : "o-none"} tooltip`}>
                        <div className="tooltiptext">The lightbulb icon indicates the day that has the closest activities</div>
                        <span class="material-symbols-outlined m-auto">
                          lightbulb
                        </span>
                      </div>
                      <button onClick={() => { addPlace(`day-${i + 1}`), updateDateToConfirm(day.day_short, day.date_short) }} className="dayOption my-h">{day.day_short}, {day.date_short}</button>
                    </div>
                  })}
                  {/* {tripDays.days.map((day, i) => (
                    <button onClick={() => { addPlace(`day-${i + 1}`), updateDateToConfirm(day.day_short, day.date_short) }} className="dayOption my-h">{day.day_short}, {day.date_short}</button>
                  ))} */}
                  <div className="mb-3"></div>
                </div>
              </div>




              {placeToConfirm &&
                <div id='placeToConfirmCard' className="placeToConfirmCard position-absolute">
                  <div className="placeCard-PTC w-97 position-relative flx-r my-2">

                    <span onClick={() => clearPlaceToConfirm()} className="closeBtn material-symbols-outlined position-absolute showOnHover x-large color-gains">
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
                      <div onClick={() => openDaySelection()} className="flx right pr-4 onHover-fadelite">
                        <div className="addIcon-small flx pointer mx-2">
                          <span className="material-symbols-outlined m-auto medium purple-text">
                            add
                          </span>
                        </div>
                        <p className="m-0 purple-text">Add to places</p>
                      </div>
                    </div>
                  </div>
                </div>
              }



              <OpenMap markers={markers} mapCenter={currentTrip.geocode ? currentTrip.geocode : [51.50735, -0.12776]} />
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

      </div >
      <div className="save-btn-row flx-r just-ce mt-5">
        <button className="btn-outlineflex w-1h large center-text mx-2">Save</button>
        <button className="btn-primaryflex w-2h large center-text mx-2">Complete Itinerary</button>
      </div>
    </>
  )
}
