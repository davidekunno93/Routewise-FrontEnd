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
import GoogleMapBox from '../components/GoogleMap/GoogleMapBox'
import PlaceToConfirmCard from '../components/PlaceToConfirmCard'
import ConfirmationModal from '../components/ConfirmationModal'
import OpeningHoursMap from '../components/OpeningHoursMap'
// import FlowBoxDraggable from '../components/FlowBoxDraggable'

const FlowBoxDraggable = lazy(() => import('../components/FlowBoxDraggable'));

export const Itinerary = ({ selectedPlacesListOnLoad }) => {
  // [imports]
  const { currentTrip, setCurrentTrip, clearCurrentTrip } = useContext(DataContext);
  const { userPreferences, setUserPreferences } = useContext(DataContext);
  const { loadCityImg, geoToLatLng } = useContext(DataContext);
  const { suggestedPlaces, mapBoxCategoryKey } = useContext(DataContext);
  const { mobileMode, mobileModeNarrow, timeFunctions, gIcon, convertInfoToMap } = useContext(DataContext);

  // ['libraries']

  // ['onload functions code'] - controls which tab is showing
  const [selectedPlacesList, setSelectedPlacesList] = useState(selectedPlacesListOnLoad ? selectedPlacesListOnLoad : 'Itinerary') // Itinerary, Suggested Places, Saved Places


  // ['helper functions code']
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
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
        place_id: null,
        rating: 4.2
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
        place_id: null,
        rating: 4.2
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
    saved_places: {
      placesIds: [],
      addresses: []
    },
    "day_order": ["day-1", "day-2", "day-3", "day-4"]
  }
  const [tripState, setTripState] = useState(currentTrip.itinerary ? currentTrip.itinerary : tripTestData);

  const placeFuntions = {
    addPlace: async function (dayNum, placeObj) {
      let tripStateCopy = { ...tripState };
      // add local id
      let place = { ...placeObj, id: parseInt(tripStateCopy.places_last) + 1 }

      if (tripStateCopy.trip_id) {
        // send place details to Kate for db update - return db place_id
        let data = {
          place: place,
          day_id: place.day_id
        }
        console.log("sendPlace: ", place)
        const response = await axios.post(`https://routewise-backend.onrender.com/itinerary/add-one-place/${tripStateCopy.trip_id}`, JSON.stringify(data), {
          headers: { "Content-Type": "application/json" }
        }).then((response) => {
          // console.log(response.status)
          let db_place_id = response.data

          // remove lightbulb key
          if (place.lightbulb_days) {
            delete place.lightbulb_days
          }

          // add db place id
          tripStateCopy.places[parseInt(tripStateCopy.places_last) + 1] = {
            ...place,
            place_id: db_place_id //
          }


          tripStateCopy.places_last = parseInt(tripStateCopy.places_last) + 1
          tripStateCopy.days[dayNum].placeIds.push(tripStateCopy.places_last)
          setTripState(tripStateCopy)
          // confirmPlaceAdded(modifier)
        }).catch((error) => {
          console.log(error)
        })
      } else {
        // we're in playground mode i.e. using test place objects on default itinerary page

        // key made for lightbulb icon purposes only - indicating day w closest activities, can delete now
        if (place.lightbulb_days) {
          delete place.lightbulb_days
        }

        tripStateCopy.places[parseInt(tripStateCopy.places_last) + 1] = place;

        tripStateCopy.places_last = parseInt(tripStateCopy.places_last) + 1
        tripStateCopy.days[dayNum].placeIds.push(tripStateCopy.places_last)
        setTripState(tripStateCopy)
        // confirmPlaceAdded(modifier)
      }
    },
    addPlaceToConfirm: function (placeObj) {
      clearPlaceToConfirm();
      setPlaceToConfirm(placeObj);
      updateMapCenter(placeObj.geocode);
    },
    addToSavedPlaces: function (placeObj) {
      let tripStateCopy = { ...tripState }
      let placesLast = tripStateCopy.places_last;

      placeObj = { ...placeObj, favorite: false, id: placesLast + 1, day_id: null };
      tripStateCopy.places[placesLast + 1] = placeObj;
      tripStateCopy.places_last = placesLast + 1;
      tripStateCopy.saved_places.placesIds.push(placeObj.id)
      tripStateCopy.saved_places.addresses.push(placeObj.address)
      // send added place change to db - need add to saved places route

      setTripState(tripStateCopy);
    },
    removeFromSavedPlaces: function (placeId, address) {
      let tripStateCopy = { ...tripState };

      // if the address is provided instead of placeId
      if (!placeId && address) {
        for (let tripPlace of Object.values(tripStateCopy.places)) {
          if (address === tripPlace.address) {
            let index = tripStateCopy.saved_places.addresses.indexOf(address);
            placeId = tripStateCopy.saved_places.placesIds[index];
          }
        }
      }

      let place = tripStateCopy.places[placeId];
      let indexOfPlaceId = tripStateCopy.saved_places.placesIds.indexOf(placeId);
      let indexOfAddress = tripStateCopy.saved_places.addresses.indexOf(place.address);
      // remove placeId and address from saved places
      tripStateCopy.saved_places.placesIds.splice(indexOfPlaceId, 1);
      tripStateCopy.saved_places.addresses.splice(indexOfAddress, 1);

      // remove from places
      delete tripStateCopy.places[placeId];

      // decrement places_last if possible
      if (tripStateCopy.places_last === placeId) {
        tripStateCopy.places_last = tripStateCopy.places_last - 1;
      };

      // tell Kate - update database
      if (tripStateCopy.trip_id) {
        deletePlaceFromDatabase(placeId);
      };

      // set state
      setTripState(tripStateCopy);
    },
    deletePlace: function (placeObj) {

    },
    updatePlaceDay: function (dayNum, placeObj) {

    },
    toggleSavedPlaces: function (placeObj) {
      let tripStateCopy = { ...tripState };
      if (isSavedPlace(placeObj.address)) {
        for (let tripPlace of Object.values(tripStateCopy.places)) {
          if (placeObj.address === tripPlace.address) {
            placeObj = tripPlace;
          }
        }
        let index = tripStateCopy.saved_places.addresses.indexOf(placeObj.address);
        let placeId = tripStateCopy.saved_places.placesIds[index];
        removeFromSavedPlaces(placeObj.id);
      } else {
        addToSavedPlaces(placeObj);
      }
    },
    isSavedPlace: function (placeOrAddress) {
      let address = "";
      if (typeof placeOrAddress === "object") {
        address = placeOrAddress.address;
      } else if (typeof placeOrAddress === "string") {
        address = placeOrAddress;
      }

      if (tripState.saved_places.addresses.length > 0 && tripState.saved_places.addresses.includes(address)) {
        return true;
      } else {
        return false;
      }
    },
    savedToItinerary: function (dayNum, placeId) {
      // remove id and from saved_places placesIds
      let tripStateCopy = { ...tripState };
      let place = tripStateCopy.places[placeId];
      let indexOfPlaceId = tripStateCopy.saved_places.placesIds.indexOf(placeId);
      let indexOfAddress = tripStateCopy.saved_places.placesIds.indexOf(place.address);
      tripStateCopy.saved_places.placesIds.splice(indexOfPlaceId, 1);
      tripStateCopy.saved_places.addresses.splice(indexOfAddress, 1);


      // places[placeId].day_id = days[dayNum].day_id
      tripStateCopy.places[placeId].day_id = tripStateCopy.days[dayNum].day_id;

      // add placeId to days[dayNum].placeIds
      tripStateCopy.days[dayNum].placeIds.push(placeId);

      // set state
      setTripState(tripStateCopy);

      // send to database
    },
    itineraryToSaved: function (dayNum, placeId) {
      // remove placeId from days[dayNum][placeIds]
      let tripStateCopy = { ...tripState };
      let place = tripStateCopy.places[placeId];
      let indexOfPlaceId = tripStateCopy.days[dayNum].indexOf(placeId);
      tripStateCopy.days[dayNum].placeIds.splice(indexOfPlaceId, 1);

      // remove day_id key
      tripStateCopy.places[placeId].day_id = null;

      // add placeId and address to saved_places
      tripStateCopy.saved_places.placesIds.push(placeId);
      tripStateCopy.saved_places.addresses.push(place.address);

      // set state
      setTripState(tripStateCopy);

      // tell Kate - update database
    }
  };

  const itineraryFunctions = {
    swapDays: function (sourceDayNum, DestinationDayNum) {
      let tripStateCopy = { ...tripState };
      // get destDay placeIds copy them to placeId holder
      // make destDay placeIds = sourceDay placeIds
      // make sourceDay placeIds = held placeIds

      [tripStateCopy[sourceDayNum].placeIds, tripStateCopy[DestinationDayNum].placeIds] = [tripStateCopy[DestinationDayNum].placeIds, tripStateCopy[sourceDayNum].placeIds]
      // setState
      setTripState(tripStateCopy)
    },
    moveAllDays: function () {

    },
  }

  const [showPlaceAddedBox, setShowPlaceAddedBox] = useState(false);
  // add place from map and suggeseted places
  const addPlace = async (dayNum) => {
    let tripStateCopy = { ...tripState }
    let place = placeToConfirm
    // add day_id to place object
    if (tripStateCopy.days[dayNum].day_id) {
      // not sure if day_id key is used anymore
      place['day_id'] = tripStateCopy.days[dayNum].day_id
    } else {
      place['day_id'] = tripStateCopy.days[dayNum].db_id
    }
    place['trip_id'] = tripStateCopy.trip_id
    // console.log(tripStateCopy.trip_id) 
    // console.log(tripStateCopy.days[dayNum]);

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
      const response = await axios.post(`https://routewise-backend.onrender.com/itinerary/add-one-place/${sendPlace.trip_id}`, JSON.stringify(data), {
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
        // confirmPlaceAdded(modifier)
        setPlaceToConfirm(null);
        closeDaySelection();
        setShowPlaceAddedBox(true);
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
      // confirmPlaceAdded(modifier)
      setPlaceToConfirm(null);
      closeDaySelection();
      setShowPlaceAddedBox(true);
    }
  };
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
  // update place in database ($test$)
  const updatePlaceInDatabase = (db_place_id, db_day_id) => {
    let url = `https://routewise-backend.onrender.com/itinerary/update-place/${db_place_id}`
    const response = axios.patch(url, { "day_id": db_day_id, "in_itinerary": db_day_id ? true : false }, {
      headers: { "Content-Type": "application/json" }
    }).then((response) => {
      console.log(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }
  const removePlace = (dayNum, placeId) => {
    // tripState > days[dayNum] > remove placeIds[placeId]
    deletePlaceFromDatabase(placeId);

    const tripStateCopy = { ...tripState };
    let index = tripStateCopy.days[dayNum].placeIds.indexOf(placeId);
    tripStateCopy.days[dayNum].placeIds.splice(index, 1);
    delete tripStateCopy.places[placeId];

    // decrement places_last if possible
    if (tripStateCopy.places_last === placeId) {
      tripStateCopy.places_last = tripState.places_last - 1;
    };

    setTripState(tripStateCopy);
    console.log(tripStateCopy)
  };






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

      let placeCategory = place.properties.category ?? "No Category";

      newPlace = {
        placeName: place.text,
        info: placeInfo,
        address: place.place_name.split(", ").slice(1, -1).join(", "),
        imgURL: imgUrl,
        category: placeCategory.length > 32 ? placeCategory.split(", ")[0] : placeCategory,
        favorite: false,
        lat: place.geometry.coordinates[1],
        long: place.geometry.coordinates[0],
        geocode: [place.geometry.coordinates[1], place.geometry.coordinates[0]],
        placeId: place.id,
      }
    }

    // lightbulb
    let days = {}
    for (let dayNum of tripState.day_order) {
      let day = tripState.days[dayNum]
      let dist = Math.sqrt((newPlace.lat - day.centroid[0]) ** 2 + (newPlace.long - day.centroid[1]) ** 2)
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
    updateMapCenter(newPlace.geocode)
    // setMapCenter(newPlace.geocode);
    // setMapCenterToggle(!mapCenterToggle);
    // resetPanelSearch()
  }


  // observe place to confirm card body
  // useEffect(() => {
  //   if (ptcCardBodyRef.current) {
  //     const observer = new ResizeObserver((entries) => {
  //       // console.log(entries)
  //       let width = entries[0].contentRect.width
  //       let charLimit = calculateCharLimit(width)
  //       setPlaceToConfirmCardTitleCharLimit(charLimit);
  //     })
  //     observer.observe(ptcCardBodyRef.current)
  //   }
  // }, [placeToConfirm])

  const openDaySelection = (modifier) => {
    let daySelection = document.getElementById('daySelection')
    if (modifier) {
      daySelection = document.getElementById(`daySelection-${modifier}`)
      // console.log('bye')
    }
    // console.log("hi")
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
    // let placesCopy = { ...tripState.places };
    // for (let placeId of tripState.saved_places.placesIds) {
    //   delete placesCopy[placeId];
    // }
    // let markersArr = Object.values(placesCopy);

    // if (placeToConfirm && !placeConfirmationAnimation) {
    //   // markersArr.push(placeToConfirm)
    //   setNewPlaceMarker(placeToConfirm);
    // } else if (!placeToConfirm) {
    //   setNewPlaceMarker(null);
    // }
    // setMarkers(markersArr)
    updateMarkers()
  }, [tripState, placeToConfirm])

  /**
   * 
   * @param placeId - use place's local id
   * @param numberOnly - set true to return just the number of the dayId as a string 
   * @returns dayId i.e. "day-2" as a string
   */
  const dayIdOfPlace = (placeId, numberOnly) => {
    // loop thru each day
    for (let dayNum of tripState.day_order) {
      if (tripState.days[dayNum].placeIds.includes(placeId)) {
        if (numberOnly) {
          return tripState.days[dayNum].id.split("-")[1];
        }
        return tripState.days[dayNum].id;
      }
    }
    return null;
  }


  const updateMarkers = () => {
    let placesCopy = Object.values(currentTrip.itinerary ? currentTrip.itinerary.places : tripState.places);
    let markersObj = {};
    for (let i = 0; i < placesCopy.length; i++) {
      let place = placesCopy[i];
      if (dayIdOfPlace(place.id, true) !== null) {
        markersObj[place.id] = {
          id: place.id,
          placeName: place.placeName,
          position: geoToLatLng(place.geocode),
          isPlaceToConfirm: false,
          infoWindowOpen: false,
          dayId: dayIdOfPlace(place.id, true),
        }
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

  // date chosen for place to be added to
  const [dateToConfirm, setDateToConfirm] = useState(null);

  const updateDateToConfirm = (day, date) => {
    setDateToConfirm(day + ", " + date)
    // console.log(day+", "+date)
  }

  // [map & geography code]
  const [markers, setMarkers] = useState(null);
  // const [mapCenter, setMapCenter] = useState(currentTrip.geocode ? currentTrip.geocode : [51.50735, -0.12776])
  const [mapCenter, setMapCenter] = useState(currentTrip.geocode ? geoToLatLng(currentTrip.geocode) : geoToLatLng([51.50735, -0.12776]))
  const [mapCenterToggle, setMapCenterToggle] = useState(false);
  const [country, setCountry] = useState(currentTrip.country_2letter ? currentTrip.country_2letter : 'gb');
  const [mapView, setMapView] = useState(false);
  const updateMapCenter = (geocode) => {
    // console.log(geocode);
    setMapCenter(geoToLatLng(geocode));
    setMapCenterToggle(!mapCenterToggle)
  }


  // ['itinerary code']
  const [itineraryAddressList, setItineraryAddressList] = useState([]);
  const updateItineraryAddressList = () => {
    let itineraryAddressListCopy = [];
    let placesArr = Object.values(tripState.places);
    // loop thru arr 
    for (let i = 0; i < placesArr.length; i++) {
      if (placesArr[i].day_id !== null) {
        itineraryAddressListCopy.push(placesArr[i].address);
      }
    }
    console.log(itineraryAddressListCopy)
    setItineraryAddressList(itineraryAddressListCopy)
  }
  useEffect(() => {
    updateItineraryAddressList()
  }, [tripState])

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
      top: refs.current[refID].offsetTop - 60,
      behavior: "smooth"
    })
  }
  // add place from search in flowbox
  const addPlaceFromFlowBox = async (dayNum, place) => {
    // {run imgquery on place.name + country}
    // let imgQuery = place.text.replace(/ /g, '-');
    // {run place details query with place_id}
    // let placeInfo = await loadPlaceDetails(place.place_id)
    // let placeInfo = "";
    // let imgUrl = await loadCityImg(imgQuery);
    let tripStateCopy = { ...tripState };
    // add day_id to place object
    if (tripStateCopy.days[dayNum].day_id) {
      // not sure if day_id key is used anymore
      place['day_id'] = tripStateCopy.days[dayNum].day_id
    } else {
      place['day_id'] = tripStateCopy.days[dayNum].db_id
    }
    place['trip_id'] = tripStateCopy.trip_id;

    // if database on then procede else do not proceed (create databaseOn in DataProvider?)
    if (tripStateCopy.trip_id) {

      // send place details to Kate for db update - return db place_id
      let sendPlace = { id: parseInt(tripStateCopy.places_last) + 1, ...place }
      let data = {
        place: sendPlace,
        day_id: sendPlace.day_id
      }
      console.log("sendPlace: ", sendPlace)
      const response = await axios.post(`https://routewise-backend.onrender.com/itinerary/add-one-place/${sendPlace.trip_id}`, JSON.stringify(data), {
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
    };
  };

  useEffect(() => {
    // update code: needs to update each time itinerary places changes
    updateCentroids();
  }, []);
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
    console.log(result)
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
  }, []);





  // [saved places code]
  // saved places popup
  const togglePopUp = (index) => {
    let popUp = document.getElementById(`popUp-${index}`)
    popUp.classList.toggle('d-none')
  }

  // switch savedplaces to currentTrip.itinerary.saved_places
  const [savedPlaces, setSavedPlaces] = useState({
    places: [],
    addresses: []
  });
  // saved places operations
  const addToSavedPlaces = async (place) => {
    let tripStateCopy = { ...tripState }
    let placesLast = tripStateCopy.places_last;

    place = { ...place, favorite: false, id: placesLast + 1, day_id: null };

    // send added place to db ($test$)
    if (tripStateCopy.trip_id) {

      // send place details to Kate for db update - return db place_id
      let sendPlace = place
      let data = {
        place: sendPlace,
        day_id: null
      }
      // console.log("sendPlace: ", sendPlace)
      const response = await axios.post(`https://routewise-backend.onrender.com/itinerary/add-one-place/${tripStateCopy.trip_id}`, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      }).then((response) => {
        console.log(response.status)
        let place_id = response.data

        // add db_place_id
        tripStateCopy.places[placesLast + 1] = {
          ...place,
          place_id: place_id
        }

        tripStateCopy.places_last = placesLast + 1
        tripStateCopy.saved_places.placesIds.push(place.id)
        tripStateCopy.saved_places.addresses.push(place.address)

        setTripState(tripStateCopy)
      }).catch((error) => {
        console.log(error)
      })
    } else {
      // we're in playground mode i.e. using test place objects on default itinerary page ($test$)

      tripStateCopy.places[placesLast + 1] = place;
      tripStateCopy.places_last = placesLast + 1;
      tripStateCopy.saved_places.placesIds.push(place.id)
      tripStateCopy.saved_places.addresses.push(place.address)
      setTripState(tripStateCopy)
    }

  };
  const toggleSavedPlaces = (place) => {
    let tripStateCopy = { ...tripState };
    if (isSavedPlace(place.address)) {
      for (let tripPlace of Object.values(tripStateCopy.places)) {
        if (place.address === tripPlace.address) {
          place = tripPlace;
        }
      }
      let index = tripStateCopy.saved_places.addresses.indexOf(place.address);
      let placeId = tripStateCopy.saved_places.placesIds[index];
      removeFromSavedPlaces(place.id);
    } else {
      addToSavedPlaces(place);
    }
  };
  const isSavedPlace = (placeOrAddress) => {
    let address = "";
    if (typeof placeOrAddress === "object") {
      address = placeOrAddress.address;
    } else if (typeof placeOrAddress === "string") {
      address = placeOrAddress;
    }

    if (tripState.saved_places.addresses.length > 0 && tripState.saved_places.addresses.includes(address)) {
      return true;
    } else {
      return false;
    }
  };
  const savedToItinerary = (dayNum, placeId) => {
    // remove id and from saved_places placesIds
    let tripStateCopy = { ...tripState };
    let place = tripStateCopy.places[placeId];
    let indexOfPlaceId = tripStateCopy.saved_places.placesIds.indexOf(placeId);
    let indexOfAddress = tripStateCopy.saved_places.placesIds.indexOf(place.address);
    tripStateCopy.saved_places.placesIds.splice(indexOfPlaceId, 1);
    tripStateCopy.saved_places.addresses.splice(indexOfAddress, 1);


    // places[placeId].day_id = days[dayNum].day_id
    tripStateCopy.places[placeId].day_id = tripStateCopy.days[dayNum].day_id;

    // add placeId to days[dayNum].placeIds
    tripStateCopy.days[dayNum].placeIds.push(placeId);

    // tell Kate - send to database ($test$)
    if (tripStateCopy.trip_id) {
      updatePlaceInDatabase(place.place_id, place.day_id);
    }

    // set state
    setTripState(tripStateCopy);

  }
  const itineraryToSaved = (dayNum, placeId) => {
    // remove placeId from days[dayNum][placeIds]
    let tripStateCopy = { ...tripState };
    let place = tripStateCopy.places[placeId];
    let indexOfPlaceId = tripStateCopy.days[dayNum].placeIds.indexOf(placeId);
    tripStateCopy.days[dayNum].placeIds.splice(indexOfPlaceId, 1);


    // remove day_id key
    tripStateCopy.places[placeId].day_id = null;

    // add placeId and address to saved_places
    tripStateCopy.saved_places.placesIds.push(placeId);
    tripStateCopy.saved_places.addresses.push(place.address);

    // tell Kate - update database ($test$) [db_day_id = null]
    if (tripStateCopy.trip_id) {
      updatePlaceInDatabase(place.place_id, null);
    }

    // set state
    setTripState(tripStateCopy);

  }
  const printSavedPlaces = () => {
    console.log(tripState.saved_places);
  };
  const printItinerary = () => {
    console.log(tripState);
  };
  const removeFromSavedPlaces = (placeId, address) => {
    let tripStateCopy = { ...tripState };

    // if the address is provided instead of placeId
    if (!placeId && address) {
      for (let tripPlace of Object.values(tripStateCopy.places)) {
        if (address === tripPlace.address) {
          let index = tripStateCopy.saved_places.addresses.indexOf(address);
          placeId = tripStateCopy.saved_places.placesIds[index];
        }
      }
    }

    let place = tripStateCopy.places[placeId];
    let indexOfPlaceId = tripStateCopy.saved_places.placesIds.indexOf(placeId);
    let indexOfAddress = tripStateCopy.saved_places.addresses.indexOf(place.address);
    // remove placeId and address from saved places
    tripStateCopy.saved_places.placesIds.splice(indexOfPlaceId, 1);
    tripStateCopy.saved_places.addresses.splice(indexOfAddress, 1);

    // remove from places
    delete tripStateCopy.places[placeId];

    // decrement places_last if possible
    if (tripStateCopy.places_last === placeId) {
      tripStateCopy.places_last = tripStateCopy.places_last - 1;
    };

    // tell Kate - update database
    if (tripStateCopy.trip_id) {
      deletePlaceFromDatabase(placeId);
    };

    // set state
    setTripState(tripStateCopy);
  };

  const openOptionDropdown = (id) => {
    let btn = document.getElementById(`optionBtn-${id}`);
    let dropdown = document.getElementById(`optionDropdown-${id}`);
    btn.classList.add("pressed");
    dropdown.classList.replace("hidden", "shown");
  };
  const closeOptionDropdown = (id) => {
    let btn = document.getElementById(`optionBtn-${id}`);
    let dropdown = document.getElementById(`optionDropdown-${id}`);
    btn.classList.remove("pressed");
    dropdown.classList.replace("shown", "hidden");
  }
  const toggleOptionDropdown = (id) => {
    let btn = document.getElementById(`optionBtn-${id}`);
    if (btn.classList.contains("pressed")) {
      closeOptionDropdown(id);
    } else {
      openOptionDropdown(id);
    }
  };



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
    let popUp = document.getElementById(`suggestedPlace-popUp-${index}`);
    let btn = document.getElementById(`suggestedPlace-btn-${index}`);
    popUp.classList.replace("hidden", "shown");
    btn.classList.add("pressed");

  }
  const closeSuggestedPlacePopUp = (index) => {
    let popUp = document.getElementById(`suggestedPlace-popUp-${index}`)
    let btn = document.getElementById(`suggestedPlace-btn-${index}`);
    popUp.classList.replace("shown", "hidden");
    btn.classList.remove("pressed");
  }
  const toggleSuggestedPlacePopUp = (index) => {
    let popUp = document.getElementById(`suggestedPlace-popUp-${index}`)
    if (popUp.classList.contains("hidden")) {
      openSuggestedPlacePopUp(index);
    } else {
      closeSuggestedPlacePopUp(index)
    }
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
  }, []);

  const [daySelectorOpen, setDaySelectorOpen] = useState(false);
  const [daySelectorStateProps, setDaySelectorStateProps] = useState({
    place: {},
    action: "",
    sideEffectFuntion: null,
    sideEffectVariable: null
  });
  const openDaySelector = (placeObj, action, sideEffectFuntion, sideEffectVariable) => {
    // setPlaceForDaySelector(placeObj);
    // setActionForDaySelector(action);
    setDaySelectorStateProps({
      place: placeObj,
      action: action,
      sideEffectFuntion: sideEffectFuntion,
      sideEffectVariable: sideEffectVariable
    });
    setDaySelectorOpen(true);
  }
  const closeDaySelector = () => {
    // setPlaceForDaySelector({});
    // setActionForDaySelector("");
    setDaySelectorStateProps({
      place: {},
      action: "",
      sideEffectFuntion: null,
      sideEffectVariable: null
    });
    setDaySelectorOpen(false);
  }



  // [sidebar code] - needs to hide on mobile screens
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const expandSidebar = () => {
    // let logo = document.getElementById('sb-logoSpace')
    let arrow = document.getElementById('arrow-icon');
    let vLine = document.getElementById('arrow-v-line');
    let logoSpace = document.getElementById('sb-logoSpace');
    const sidebarPlaceholder = document.getElementById('itinerarySideBarPlaceholder')
    const sidebar = document.getElementById('itinerarySidebar')
    sidebar.style.width = "240px"
    sidebarPlaceholder.style.width = "240px"

    wait(200).then(() => {
      // logo.style.width = "252px"
      arrow.classList.add("rotate-180");
      logoSpace.style.paddingRight = "0px";
      vLine.classList.add("push-left");

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
    // let logo = document.getElementById('sb-logoSpace')
    let arrow = document.getElementById('arrow-icon');
    let vLine = document.getElementById('arrow-v-line');
    let logoSpace = document.getElementById('sb-logoSpace');
    let expandItems = document.getElementsByClassName('sb-expanded')
    const sidebarPlaceholder = document.getElementById('itinerarySideBarPlaceholder')
    const sidebar = document.getElementById('itinerarySidebar')
    // logo.style.width = "34px"
    arrow.classList.remove("rotate-180");
    logoSpace.style.paddingRight = "10px";
    vLine.classList.remove("push-left");

    for (let i = 0; i < expandItems.length; i++) {
      expandItems[i].classList.remove('show')
      wait(200).then(() => {
        expandItems[i].style.display = "none"
      })
    }
    wait(200).then(() => {
      sidebar.style.width = "60px"
      sidebarPlaceholder.style.width = "60px"
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
  const [toolTipIndex, setToolTipIndex] = useState(tripState.saved_places.placesIds.length > 0 ? 0 : 1);
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

  const numberToBgColor = (num) => {
    let lastDigit = num.slice(-1)
    if (lastDigit === "1") {
      return "#FF4856" // RED
    }
    if (lastDigit === "2") {
      return "#FFD84E" // YELLOW
    }
    if (lastDigit === "3") {
      return "#2185F9" // BLUE
    }
    if (lastDigit === "4") {
      return "#4CDE08" // GREEN
    }
    if (lastDigit === "5") {
      return "#FFA80A" // ORANGE
    }
    if (lastDigit === "6") {
      return "#FF52FF" // PINK
    }
    if (lastDigit === "7") {
      return "#14DCDC" // LIGHT BLUE
    }
    if (lastDigit === "8") {
      return "#CECDFE" // PURPLE
    }
    if (lastDigit === "9") {
      return "#A9743A" // BROWN
    }
    if (lastDigit === "0") {
      return "#42F2A8" // LIGHT GREEN
    }
    return null;
  }

  const confirmationModalRef = useRef(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationModalProps, setConfirmationModalProps] = useState({
    confirmAction: null,
    confirmActionParams: null,
    questionText: null,
    descText: null,
    confirmOption: null,
    rejectOption: null
  })
  const openConfirmationModal = (props) => {
    setConfirmationModalProps(props);
    setConfirmationModalOpen(true);
  }

  return (
    <>
      <ConfirmationModal
        open={confirmationModalOpen}
        ref={confirmationModalRef}
        confirmationModalProps={confirmationModalProps}
        onClose={() => setConfirmationModalOpen(false)}
      />

      {mobileMode &&
        <button onClick={() => setMapView(mapView => !mapView)} className={`mapview-btn ${mapView && "light"}`}>
          <span className={`material-symbols-outlined large ${mapView ? "dark-text" : "white-text"}`}>
            map
          </span>
          <p className={`m-0 ${mapView ? "dark-text" : "white-text"}`}>{mapView ? "Close Map" : "Map View"}</p>
        </button>
      }
      <div className={`itinerary-page flx-r ${mobileMode && "overflow-h"}`}>
        {/* <div className={`${mobileMode ? "inner-wide" : "flx-r w-100"}`} style={{ transform: `translateX(-${mobileMode ? mapView ? 1 * 50 : 0 * 50 : 0}%)` }}> */}


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
            <div className={`sidebar-tooltip suggested-places  ${currentTrip.itineraryFirstLoad ? toolTipIndex === 1 ? "shown" : "hidden-o" : "hidden-o"}`}>
              <div className={`dot-indicators just-ce ${tripState.saved_places.placesIds.length === 0 && "hidden"}`}>
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
              <div onClick={() => toggleSidebarExpanded()} className="arrow-icon pointer">
                <span id='arrow-icon' className={gIcon + " darkpurple-text"}>
                  arrow_forward
                </span>
                <span id='arrow-v-line' className="v-line"></span>
              </div>
              {/* <div className="icon-cold">
                    <img onClick={() => toggleSidebarExpanded()} src="https://i.imgur.com/d2FMf3s.png" alt="" className="logo-icon" />
                  </div>

                  <img src="https://i.imgur.com/Eu8Uf2u.png" alt="" className="text-logo-icon" /> */}

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

        <div className="flx-c w-100">

        <div className={`${mobileMode ? "inner-wide" : "flx-r w-100"}`}>
          <div className={`${mobileMode ? "carousel-item-pagewide" : "flx-r flx-4"}`}>

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
                    <Link to='/print-itinerary' className='position-right'><button className="btn-primary-small align-all-items gap-2">
                      <span className="material-symbols-outlined white-text small">share</span>
                      Share
                    </button></Link>
                  </div>
                  {/* calendar edit */}
                  <div className="calendar-edit border-bottom-gains flx-r pb-2 align-c gap-2">
                    <span className="material-symbols-outlined o-50">
                      calendar_month
                    </span>
                    <div className="dark-text font-jakarta">{currentTrip.startDate ? timeFunctions.datify(timeFunctions.datiundash(currentTrip.startDate)) + " - " + timeFunctions.datify(timeFunctions.datiundash(currentTrip.endDate)) : <p className="m-0">November 8, 2023 &nbsp; - &nbsp; November 11, 2023</p>}</div>
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

                  {/* trip days */}
                  <div className="trip-information-div z-1 sticky">
                    <div className="trip-days flx-r gap-2">

                      {/* {tripState.day_order.map((dayNum, id) => {
                        const day = tripState.days[dayNum]
                        return <div key={id} onClick={() => scrollToSection(id)} className={`dateBox-rounder px-2 pointer font-jakarta ${parseInt(flowBoxShowingIndex) === id ? "dateBox-rounder-selected" : null} `}>{day.day_short} {day.date_short}</div>
                      })} */}
                      {tripState.day_order.map((dayNum, id) => {
                        const day = tripState.days[dayNum]
                        return <div key={id} onClick={() => scrollToSection(id)} className={`dateBox-column px-2 pointer font-jakarta ${parseInt(flowBoxShowingIndex) === id ? "dateBox-rounder-selected" : null} `}>
                          <p className="m-0">{day.day_short.toUpperCase()}</p>
                          <p className="m-0">{day.date_short}</p>
                        </div>
                      })}


                    </div>
                  </div>
                  {/* trip days end */}
                  <p onClick={() => printSavedPlaces()} className="m-0 page-subsubheading-bold">Itinerary</p>

                  <div className="itinerary-flow mt-3">


                    <DragDropContext onDragEnd={onDragEndItinerary}>
                      {tripState.day_order.map((dayNum, id) => {
                        const day = tripState.days[dayNum]
                        const places = day.placeIds.map((placeId) => tripState.places[placeId])

                        return <Suspense fallback={<LoadBox />} >
                          <div ref={e => refs.current[id] = e} key={id} className="">
                            <FlowBoxDraggable
                              key={day.id}
                              id={id}
                              tripState={tripState}
                              setTripState={setTripState}
                              mapCenter={mapCenter}
                              addSearchOpen={addSearchOpen}
                              addSearchClose={addSearchClose}
                              toggleFlow={toggleFlow}
                              day={day}
                              places={places}
                              // placesFunctions?
                              removePlace={removePlace}
                              addPlaceFromFlowBox={addPlaceFromFlowBox}
                              addPlaceToConfirm={addPlaceToConfirm}
                              itineraryToSaved={itineraryToSaved}
                              isSavedPlace={isSavedPlace}

                              country={country}
                              openConfirmationModal={openConfirmationModal}
                              confirmationModalRef={confirmationModalRef}
                            />
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
                  <p onClick={() => printItinerary()} className="m-0 page-subheading-bold">Saved Places</p>
                  <p onClick={() => printSavedPlaces()} className="m-0 page-subsubheading-bold my-2">Here are all of your saved places. Don't forget to add them to your itinerary!</p>

                  <div className="placeCards-itinerary">
                    {tripState.saved_places && tripState.saved_places.placesIds.length > 0 ?
                      tripState.saved_places.placesIds.map((placeId, index) => {
                        let savedPlace = tripState.places[placeId]
                        let category = savedPlace.category ? savedPlace.category.split(", ")[0].charAt(0).toUpperCase() + savedPlace.category.split(", ")[0].slice(1) : "No Category";

                        return <div key={index} className="placeCard2 flx-r position-relative">
                          <div className="placeCard-img-div flx-3">
                            <img onClick={() => addPlaceToConfirm(savedPlace)} className="placeCard2-img" src={savedPlace.imgURL} />
                          </div>
                          <div className="placeCard-body flx-5">
                            {/* <div className="popUp d-none">{savedPlace.info}</div> */}
                            <p className="body-title ">{savedPlace.placeName}</p>
                            <p className="body-category">{category}</p>
                            {savedPlace.info &&
                              <>
                                {savedPlace.info.includes(":") ?
                                  <OpeningHoursMap openingHoursObject={convertInfoToMap(savedPlace.info)} />
                                  :
                                  <p className="body-info">{savedPlace.info}</p>
                                }
                              </>
                            }

                            <p className="body-address">{savedPlace.summary ?? savedPlace.address}</p>
                          </div>
                          <div className="placeCard-options py-2h flx-c just-sb align-c">

                            <div id={`optionDropdown-${index}`} className="placeCard-menu hidden">
                              <div onClick={() => { addPlaceToConfirm(savedPlace); closeOptionDropdown(index) }} className="option">
                                <div className="material-symbols-outlined icon">location_on</div>
                                <p className="m-0 text">View on map</p>
                              </div>
                              <div onClick={() => openDaySelector(savedPlace, "savedToItinerary")} className="option">
                                <div className="material-symbols-outlined icon">map</div>
                                <p className="m-0 text">Move to Itinerary</p>
                              </div>
                              <div onClick={() => removeFromSavedPlaces(savedPlace.id)} className="option">
                                <div className="material-symbols-outlined icon red-text">delete</div>
                                <p className="m-0 text red-text">Remove from list</p>
                              </div>
                            </div>


                            <span id={`optionBtn-${index}`} onClick={() => toggleOptionDropdown(index)} className="material-symbols-outlined gray-text more_vert">
                              more_vert
                            </span>
                            <span onClick={() => removeFromSavedPlaces(savedPlace.id)} className="material-symbols-outlined gray-text showOnHover-50 pointer">
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
                              <div id={`suggestedPlace-popUp-${index}`} className="placeCard-popUp hidden">
                                <div onClick={() => { addPlaceToConfirm(suggestedPlace); closeSuggestedPlacePopUp(index) }} className="option">
                                  <span className="material-symbols-outlined icon">
                                    location_on
                                  </span>
                                  <p className="m-0 text">View on Map</p>
                                </div>
                                <div onClick={() => openDaySelector(suggestedPlace, "addPlace", closeSuggestedPlacePopUp, index)} className="option">
                                  <span className="material-symbols-outlined icon">
                                    map
                                  </span>
                                  <p className="m-0 text">Add to itinerary</p>
                                </div>
                                {isSavedPlace(suggestedPlace.address) ?
                                  <div onClick={() => { addToSavedPlaces(suggestedPlace); closeSuggestedPlacePopUp(index) }} className="option">
                                    <span className="material-symbols-outlined icon red-text">
                                      bookmark
                                    </span>
                                    <p className="m-0 text red-text">Remove from Saved Places</p>
                                  </div>
                                  :
                                  <div onClick={() => { addToSavedPlaces(suggestedPlace); closeSuggestedPlacePopUp(index) }} className="option">
                                    <span className="material-symbols-outlined icon">
                                      bookmark
                                    </span>
                                    <p className="m-0 text">Add to Saved Places</p>
                                  </div>
                                }
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
                              <div id={`suggestedPlace-btn-${index}`} onClick={() => { toggleSuggestedPlacePopUp(index) }} className="addIcon-medium flx pointer mx-2 mt-2 onHover-dark">
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
                                  <div onClick={() => { addPlaceToConfirm(suggestedPlace); closeSuggestedPlacePopUp(index) }} className="option">
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

                  <div id='daySelection' className="daySelection map d-none">
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
                          <div className="day-color" style={{ backgroundColor: numberToBgColor(dayNum.split("-")[1]) }}></div>
                          <div className="text">
                            <p className="m-0 bold500"><strong>Day {dayNum.split("-")[1]}:</strong> <span className='gray-text'>{day.day_short}, {day.date_converted.split(",").slice(1)}</span> </p>
                            {/* <p className="m-0 bold500 small gray-text">{day.date_converted.split(",").slice(1)}</p> */}
                          </div>
                          <div className={`day-lightBulb flx ${lightbulbDays && lightbulbDays.includes(dayNum) ? null : "o-none"}`}>
                            <div className="tooltip">This day is recommended because it has the closest activities!</div>
                            {/* <img src="https://i.imgur.com/mplOdwv.png" alt="" className="lightbulb-icon" /> */}
                            {/* <span class="material-symbols-outlined m-auto gray-text normal-cursor">
                              emoji_objects
                            </span> */}
                            <img src="https://i.imgur.com/T3ZIaA5.png" alt="" className="img" />
                          </div>
                        </div>
                      })}


                    </div>
                  </div>




                  {placeToConfirm &&
                    <PlaceToConfirmCard
                      addToSavedPlaces={placeFuntions.addToSavedPlaces}
                      removeFromSavedPlaces={removeFromSavedPlaces}
                      // addToItinerary={addPlace}
                      openDaySelection={openDaySelection}
                      removePlace={removePlace}
                      placeToConfirm={placeToConfirm}
                      clearPlaceToConfirm={clearPlaceToConfirm}
                      addressList={itineraryAddressList}
                      savedAddressList={tripState.saved_places.addresses}

                      forItinerary
                    />
                    // <div id='placeToConfirmCard' className={`placeToConfirmCard position-absolute ${placeToConfirmAnimation ? "show" : "hide"}`}>
                    //   <div className="placeCard-PTC w-97 position-relative flx-r my-2">

                    //     <span onClick={() => clearPlaceToConfirm()} className="closeBtn-PTC material-symbols-outlined position-absolute showOnHover x-large color-gains">
                    //       close
                    //     </span>

                    //     <div onClick={() => toggleSavedPlaces(placeToConfirm)} className="saveBtn">
                    //       <img src={`${isSavedPlace(placeToConfirm.address) ? "https://i.imgur.com/o7IoL2K.png" : "https://i.imgur.com/TcS7RjD.png"}`} alt="" className={`${savedPlaces.addresses.includes(placeToConfirm.address) ? "icon-img-selected" : "icon-img"}`} />
                    //       {/* <span className={`material-symbols-outlined white-text ${savedPlaces.addresses.includes(placeToConfirm.address) ? "purple-text" : null}`}>
                    //     bookmark
                    //   </span> */}

                    //     </div>

                    //     <div className="placeCard-img-div flx-1">
                    //       <img className="placeCard-img" src={placeToConfirm.imgURL} />
                    //     </div>
                    //     <div ref={ptcCardBodyRef} className="placeToConfirmCard-body flx-2">
                    //       <div onClick={() => togglePopUp('PTC')} id='popUp-PTC' className="popUp d-none position-absolute">{placeToConfirm.info}</div>
                    //       <p className="body-title-PTC">{placeToConfirm.placeName.length > charLimit ? placeToConfirm.placeName.slice(0, placeToConfirmCardTitleCharLimit) + "..." : placeToConfirm.placeName}</p>
                    //       {/* <p onClick={() => togglePopUp('PTC')} className="body-info-PTC pointer mb-1">{placeToConfirm.info}</p> */}
                    //       <p className="body-info-PTC pointer mb-1">{placeToConfirm.category ? placeToConfirm.category.split(',')[0].charAt(0).toUpperCase() + placeToConfirm.category.split(',')[0].slice(1) : "No Category"}</p>
                    //       <p className="body-address-PTC m-0">{placeToConfirm.address}</p>

                    //       <div className="flx-r position-bottom">
                    //         <div onClick={() => openDaySelection()} className="add-place-btn onHover-fadelite">
                    //           <div className="flx pointer mx-2">
                    //             <span className="material-symbols-outlined m-auto medium purple-text">
                    //               add
                    //             </span>
                    //           </div>
                    //           <p className="m-0 purple-text">Add to itinerary</p>
                    //         </div>
                    //       </div>

                    //       {/* <div className="flx">
                    //     <div className="addTab">
                    //       <span className="material-symbols-outlined purple-text large">
                    //         add
                    //       </span>
                    //       <p className="m-0 purple-text">Add to places</p>
                    //     </div>
                    //   </div> */}

                    //     </div>
                    //   </div>
                    // </div>
                  }



                  {/* <OpenMap markers={markers} newPlaceMarker={newPlaceMarker} mapCenter={currentTrip.geocode ? currentTrip.geocode : [51.50735, -0.12776]} /> */}
                  {/* <OpenMapBox mapCenter={mapCenter} mapCenterToggle={mapCenterToggle} newPlaceMarker={newPlaceMarker} markers={markers} addPlaceToConfirm={addPlaceToConfirm} /> */}
                  <GoogleMapBox
                    tripMapCenter={currentTrip.geocode ? geoToLatLng(currentTrip.geocode) : ({ lat: 51.50735, lng: -0.12776 })}
                    mapCenter={mapCenter}
                    mapCenterToggle={mapCenterToggle}
                    addPlaceToConfirm={addPlaceToConfirm}
                    markers={markers}
                    setMarkers={setMarkers}
                    showPlaceAddedBox={showPlaceAddedBox}
                    placeAddedBoxText={"Added to Itinerary!"}
                    setShowPlaceAddedBox={setShowPlaceAddedBox}
                    markerColors
                  />

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


        <div className="flx-r">
          <div className="position-right mr-5">

            {/* Completion buttons */}
            < div className="save-btn-row flx-r flx-wrap just-ce mt-5" >
              <Link to='/dashboard'><button className="btn-outlineflex center-text mx-2">Back to Dashboard</button></Link>
              <Link to='/print-itinerary'><button className="btn-primaryflex w-2h center-text mx-2">Share Itinerary</button></Link>
            </div >
            {/* End Completion buttons */}

            <h1 className='empty-3'></h1>


          </div>
        </div>

        </div>
      </div >

    </>
  )
}
