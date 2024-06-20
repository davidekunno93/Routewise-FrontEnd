import { useContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { SignUp } from './components/auth/SignUp'
import { Navbar } from './components/Navbar'
import { Landing } from './views/Landing'
import { Survey } from './views/Survey'
import { Dashboard } from './views/Dashboard'
import { Footer } from './components/Footer'
import { AddPlaces } from './views/AddPlaces'
import { Itinerary } from './views/Itinerary'
import { Test } from './views/Test'
import { OpenMap } from './components/OpenMap'
import { HeroCarousel } from './components/HeroCarousel'
import { HeroFade } from './components/HeroFade'
import { SurveyUpdate } from './views/SurveyUpdate'
import axios from 'axios'
import { DataContext } from './Context/DataProvider'
import { auth, firestore } from './firebase'
import MyTrips from './views/MyTrips'
import OpenMapBox from './components/OpenMapBox'
import PrintItineraryPage from './views/PrintItineraryPage'
import { doc, getDoc } from 'firebase/firestore'
import ProtectedRoute from './components/Privatizer/ProtectedRoute'

function App() {
  const loggedIn = window.localStorage.getItem("isLoggedIn");
  const userData = window.localStorage.getItem("userData");
  const userPref = window.localStorage.getItem("userPref");
  const { user, setUser } = useContext(DataContext);
  const { userPreferences, setUserPreferences } = useContext(DataContext);
  const { currentTrip, mapBoxCategoryKey, suggestedPlaces, setSuggestedPlaces } = useContext(DataContext);
  const { loadCityImg } = useContext(DataContext);

  // wakeup function
  useEffect(() => {
    wakeUpBackEnd()
    // console.log(auth.currentUser)
    // docRef = doc, docSnap = getDoc, if docSnap.exists() --> docSnap.data()
    // fetch user details
    auth.onAuthStateChanged((userCred) => 
    {setUser(userCred)
  });
  

  }, [])
  const wakeUpBackEnd = async () => {
    let url = "https://routewise-backend.onrender.com/profile/test"
    let data = "wakeUp"
    console.log("waking up...")
    const response = await axios.post(url, JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    })
    console.log('woken up')
    return response.status === 200 ? response.data : null
  }

  // [user preferences code]
  // useEffect(() => {
  //   if (auth.currentUser) {
  //     setPreferences()
  //   }
  // }, [auth])
  const setPreferences = async () => {
    let prefs = await getDoc(doc(firestore, `userPreferences/${auth.currentUser.uid}`))
    // console.log(prefs.data())
    prefs = prefs.data()
    let userPref = {
      landmarks: prefs ? prefs.landmarks : false,
      nature: prefs ? prefs.nature : false,
      shopping: prefs ? prefs.shopping : false,
      food: prefs ? prefs.food : false,
      nightclub: prefs ? prefs.nightclub ? prefs.nightclub : false : false,
      relaxation: prefs ? prefs.relaxation : false,
      entertainment: prefs ? prefs.entertainment : false,
      arts: prefs ? prefs.arts : false
    }
    console.log("userPref =", userPref)
    setUserPreferences(userPref)
  }

  // [suggested places code]
  const suggestedPlacesFunctions = {
    empty: function () {
      let suggestedPlacesCopy = { ...suggestedPlaces };
      suggestedPlacesCopy.places = [];
      suggestedPlacesCopy.loaded = false;
      setSuggestedPlaces(suggestedPlacesCopy);
    },
    reset: function () {
      // currently the same as empty
      setSuggestedPlaces({
        loaded: false,
        places: [],
      });
    },
    returnNone: function () {
      let suggestedPlacesCopy = { ...suggestedPlaces };
      suggestedPlacesCopy.places = [];
      suggestedPlacesCopy.loaded = true;
      setSuggestedPlaces(suggestedPlacesCopy);
      // setSuggestedPlaces({...suggestedPlaces, places: [], loaded: true});
    },
    setPlaces: function (placeSuggestions) {
      setSuggestedPlaces({
        loaded: true,
        places: placeSuggestions,
      });
    }
  }

  // suggested places api call
  const loadSuggestedPlaces = async () => {
    suggestedPlacesFunctions.empty()

    let placeSuggestions = [];
    let userPreferencesCount = 0;
    for (let userPreference of Object.entries(userPreferences)) {
      // userPreference = [category: bool]
      let category = userPreference[0]
      let selected = userPreference[1]
      // console.log(userPreference)
      if (selected) {
        userPreferencesCount++
        let resultPlaces = await getSuggestedPlaces(category);
        if (resultPlaces.length > 0) {

          for (let place of resultPlaces) {
            let imgUrl = await loadCityImg(place.properties.name)
            let placeSuggestion = {
              placeName: place.properties.name,
              info: "",
              address: place.properties.full_address.split(", ").slice(0, -1).join(", "),
              imgURL: imgUrl,
              category: place.properties.poi_category.join(", "),
              categoryTitle: mapBoxCategoryKey[category].categoryTitle,
              // favorite: false,
              lat: place.geometry.coordinates[1],
              long: place.geometry.coordinates[0],
              geocode: [place.geometry.coordinates[1], place.geometry.coordinates[0]],
              placeId: place.properties.mapbox_id,
            }
            if (!placeSuggestions.includes(placeSuggestion)) {
              placeSuggestions.push(placeSuggestion)
            }
          }
        }
      }
    }
    if (userPreferencesCount === 0) {
      // no user preferences currently selected
      suggestedPlacesFunctions.returnNone()
    } else {
      console.log(placeSuggestions)
      if (placeSuggestions.length === 0) {
        // no places found for the user (even though they have selected preferences)
        suggestedPlacesFunctions.returnNone()
      } else {
        // suggested places found
        suggestedPlacesFunctions.setPlaces(placeSuggestions);
      }
    }
  }
  const getSuggestedPlaces = async (category) => {
    // implement try / catch block for errors
    const categoryQueries = mapBoxCategoryKey[category].categoryQueries;
    const apiKey = "pk.eyJ1Ijoicm91dGV3aXNlMTAyMyIsImEiOiJjbHZnMGo4enEwcHMxMmpxZncxMzJ6cXJuIn0.becg64t48O9U4HViiduAGA"
    const bias = currentTrip.geocode ? currentTrip.geocode : [51.50735, -0.12776];
    const lat = bias[0];
    const lon = bias[1];
    const limit = 5;
    const country_2letter = currentTrip.country_2letter ? currentTrip.country_2letter.toLowerCase() : "gb";
    console.log("new country code: " + country_2letter.toLowerCase());
    console.log("new geocode: " + bias);
    const url = `https://api.mapbox.com/search/searchbox/v1/category/${categoryQueries.join(",")}?access_token=${apiKey}&language=en&limit=${limit}&proximity=${lon}%2C${lat}&country=${country_2letter}`;
    const response = await axios.get(url)
    return response.status === 200 ? response.data.features : "error"
  }
  useEffect(() => {
    loadSuggestedPlaces();
    // console.log("user preferences was updated")
  }, [userPreferences, currentTrip.geocode])


  // other functions
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }


  return (
    <>

      <div className="flx-1 flx-c">
        <Navbar />
        <Routes>
          <Route children path='/register' element={<SignUp />} />
          <Route children path='/' element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route children path='/landing' element={<Landing />} />
          <Route children path='/survey' element={<Survey />} />
          <Route children path='/survey-update' element={<SurveyUpdate />} />
          <Route children path='/dashboard' element={<Dashboard />} />

          <Route children path='/add-places' element={<ProtectedRoute><AddPlaces /></ProtectedRoute>} />
          <Route children path='/add-places/suggested-places' element={<ProtectedRoute><AddPlaces selectedPlacesListOnLoad={"Suggested Places"} /></ProtectedRoute>} />
          <Route children path='/itinerary' element={<ProtectedRoute><Itinerary /></ProtectedRoute>} />
          <Route children path='/itinerary/suggested-places' element={<ProtectedRoute><Itinerary selectedPlacesListOnLoad={"Suggested Places"} /></ProtectedRoute>} />
          
          <Route children path='/mytrips' element={<MyTrips />} />
          <Route children path='/test' element={<Test />} />
          <Route children path='/map' element={<OpenMap />} />
          <Route children path='/map2' element={<OpenMapBox />} />
          <Route children path='/hero' element={<HeroFade />} />
          <Route children path='/print-itinerary' element={<PrintItineraryPage />} />
        </Routes>
        {/* <h1 className='empty-3'></h1> */}
        {/* <h1 className='empty-6'></h1> */}
      </div>

      <Footer />
    </>
  )
}

export default App
