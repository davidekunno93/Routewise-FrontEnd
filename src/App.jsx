import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { SignUp } from './components/auth/SignUp'
import { Navbar } from './components/Navbar/Navbar'
import { Landing } from './views/Landing/Landing'
import { Survey } from './views/Survey/Survey'
import { Dashboard } from './views/Dashboard/Dashboard'
import { Footer } from './components/Footer'
import { AddPlaces } from './views/AddPlaces/AddPlaces'
import { Itinerary } from './views/Itinerary'
import { Test } from './views/Test'
import { OpenMap } from './components/OpenMap'
import { HeroCarousel } from './components/HeroCarousel'
import { HeroFade } from './components/HeroFade'
import { SurveyUpdate } from './views/Survey/SurveyUpdate'
import axios from 'axios'
import { DataContext } from './Context/DataProvider'
import { auth, firestore } from './firebase'
import MyTrips from './views/MyTrips/MyTrips'
import OpenMapBox from './components/OpenMapBox'
import PrintItineraryPage from './views/PrintItineraryPage'
import { doc, getDoc } from 'firebase/firestore'
import ProtectedRoute from './components/Privatizer/ProtectedRoute'
import TestItinerary from './views/TestItinerary'
import AccountSettings from './views/AccountSettings/AccountSettings'
// import Scratch from './views/Scratch/Scratch'

function App() {
  const loggedIn = window.localStorage.getItem("isLoggedIn");
  const userData = window.localStorage.getItem("userData");
  const userPref = window.localStorage.getItem("userPref");
  const { user, setUser, userPreferences, setUserPreferences,
    currentTrip, mapBoxCategoryKey, suggestedPlaces, setSuggestedPlaces, topSites, setTopSites,
    loadCityImg, getGoogleImg, modifyInfo, textFunctions, toLatitudeLongitude,
    getBestCategory, googleCategoryKey, googlePlaceTypeKey } = useContext(DataContext);


  // fetch user details
  useLayoutEffect(() => {
    auth.onAuthStateChanged((userCred) => {
      setUser(userCred);
      // add get name data from firebase code
      setPreferences();
    });
  }, []);


  const setPreferences = async () => {
    if (!auth.currentUser) return;
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
    // console.log("userPref =", userPref)
    setUserPreferences(userPref)
  };

  // [suggested places code]
  const topSitesFunctions = {
    empty: function () {
      let topSitesCopy = { ...topSites };
      topSitesCopy.places = [];
      topSitesCopy.isLoaded = false;
      setTopSites(topSitesCopy);
    },
    reset: function () {
      // currently the same as empty
      setTopSites({
        isLoaded: false,
        places: [],
      });
    },
    returnNone: function () {
      let topSitesCopy = { ...topSites };
      topSitesCopy.places = [];
      topSitesCopy.isLoaded = true;
      setTopSites(topSitesCopy);
    },
    setPlaces: function (resultPlaces) {
      setTopSites({
        isLoaded: true,
        places: resultPlaces,
      });
    },
    setIsLoading: function () {
      let topSitesCopy = { ...topSites };
      topSitesCopy.isLoaded = false;
      setTopSites(topSitesCopy);
    },
    setIsLoaded: function () {
      let topSitesCopy = { ...topSites };
      topSitesCopy.isLoaded = true;
      setTopSites(topSitesCopy);
    },
  };
  const suggestedPlacesFunctions = {
    empty: function () {
      let suggestedPlacesCopy = { ...suggestedPlaces };
      suggestedPlacesCopy.places = [];
      suggestedPlacesCopy.isLoaded = false;
      setSuggestedPlaces(suggestedPlacesCopy);
    },
    reset: function () {
      // currently the same as empty
      setSuggestedPlaces({
        isLoaded: false,
        places: [],
      });
    },
    returnNone: function () {
      let suggestedPlacesCopy = { ...suggestedPlaces };
      suggestedPlacesCopy.places = [];
      suggestedPlacesCopy.isLoaded = true;
      setSuggestedPlaces(suggestedPlacesCopy);
      // setSuggestedPlaces({...suggestedPlaces, places: [], isLoaded: true});
    },
    setPlaces: function (resultPlaces) {
      setSuggestedPlaces({
        isLoaded: true,
        places: resultPlaces,
      });
    },
    setIsLoading: function () {
      let suggestedPlacesCopy = { ...suggestedPlaces };
      suggestedPlacesCopy.isLoaded = false;
      setSuggestedPlaces(suggestedPlacesCopy);
    },
    setIsLoaded: function () {
      let suggestedPlacesCopy = { ...suggestedPlaces };
      suggestedPlacesCopy.isLoaded = true;
      setSuggestedPlaces(suggestedPlacesCopy);
    },
  };

  useEffect(() => {
    // nearbySearch(true);
    // nearbySearch();
    console.log("nearby search was reloaded");
  }, [userPreferences, currentTrip.geocode]);

  const getSelectedPreferences = (userPreferencesObj) => {
    let selectedPreferences = [];
    for (let [key, value] of Object.entries(userPreferencesObj)) {
      if (value === true) {
        selectedPreferences.push(key);
      };
    };
    return selectedPreferences;
  };
  const getCategoryQueries = (selectedPreferencesArr) => {
    let categoryQueries = [];
    for (let i = 0; i < selectedPreferencesArr.length; i++) {
      categoryQueries.push(...googleCategoryKey[selectedPreferencesArr[i]].categoryQueries)
    };
    return categoryQueries;
  }
  const nearbySearch = async (useTravelPreferences) => {
    // console.log(userPreferences);
    if (!auth.currentUser || !auth.currentUser.emailVerified) return;
    if (useTravelPreferences) {
      suggestedPlacesFunctions.setIsLoading();
    } else {
      topSitesFunctions.setIsLoading();
    };
    let selectedPreferences = getSelectedPreferences(userPreferences);
    let categoryQueries = getCategoryQueries(selectedPreferences)
    // console.log(selectedPreferences);
    // console.log(categoryQueries);
    // return "cp"
    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': import.meta.env.VITE_APP_GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.photos,places.id,places.regularOpeningHours,places.editorialSummary,places.location,places.types,places.rating,places.internationalPhoneNumber,places.websiteUri', // address, summary, biz info
      },
      body: JSON.stringify({
        includedTypes: useTravelPreferences ? categoryQueries : undefined,
        excludedTypes: useTravelPreferences ? undefined : ['hospital', 'doctor', 'dentist', 'medical_lab', 'subway_station', 'university', 'department_store', 'bus_station', 'bicycle_store', 'grocery_store', 'airport'],
        maxResultCount: 8,
        // rankPreference: "POPULARITY", // default by POPULARITY
        locationRestriction: {
          circle: {
            center: toLatitudeLongitude(currentTrip.geocode ? currentTrip.geocode : [51.50735, -0.12776]),
            radius: 40000, // ~25 miles
          },
        },
      }),
    }
    let url = `https://places.googleapis.com/v1/places:searchNearby`
    await fetch(url, requestOptions)
      .then(async (response) => {
        let data = await response.json();
        let resultPlaces = await handleNearbySearchData(data);
        if (useTravelPreferences) {
          suggestedPlacesFunctions.setPlaces(resultPlaces);
        } else {
          topSitesFunctions.setPlaces(resultPlaces);
        };
        // console.log(resultPlaces);
      })
      .catch(error => {
        console.log('error', error);
        if (useTravelPreferences) {
          suggestedPlacesFunctions.setIsLoaded();
        } else {
          topSitesFunctions.setIsLoaded();
        };
      });

  };
  const handleNearbySearchData = async (data) => {
    data = data.places;
    console.log("search attempt: ", data)
    let resultPlaces = [];
    let selectedPreferences = getSelectedPreferences(userPreferences);
    let googleCategoryPlaceTypesArr = Object.keys(googlePlaceTypeKey);
    for (let i = 0; i < data.length; i++) {
      let photoName = data[i].photos[0].name;
      let categoryTitles = [];
      for (let j = 0; j < data[i].types.length; j++) {
        // if type match with google keys
        if (googleCategoryPlaceTypesArr.includes(data[i].types[j])) {
          // console.log(data[i].displayName.text, data[i].types[j]);
          // set category Title to google key value if user preference is chosen
          if (selectedPreferences.includes(googlePlaceTypeKey[data[i].types[j]].userPreference)) {
            let categoryTitle = googlePlaceTypeKey[data[i].types[j]].categoryTitle;
            if (!categoryTitles.includes(categoryTitle)) {
              categoryTitles.push(categoryTitle);
            }
          };
        };
      };
      let place = {
        placeName: data[i].displayName.text,
        info: data[i].regularOpeningHours ? modifyInfo(data[i].regularOpeningHours.weekdayDescriptions) : "",
        category: textFunctions.capitalize(getBestCategory(data[i].types).replace(/_/g, " ")),
        categoryTitles: categoryTitles,
        rating: data[i].rating ? data[i].rating.toFixed(1) : null,
        address: data[i].formattedAddress,
        geocode: [data[i].location.latitude, data[i].location.longitude],
        lat: data[i].location.latitude,
        long: data[i].location.longitude,
        placeId: data[i].id,
        imgURL: await getGoogleImg(photoName),
        summary: data[i].editorialSummary ? data[i].editorialSummary.text : "",
        phoneNumber: data[i].internationalPhoneNumber ?? "",
        website: data[i].websiteUri ?? "",
      };
      resultPlaces.push(place);
    }
    return resultPlaces;
  };





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
          <Route children path='/test-itinerary' element={<TestItinerary />} />
          <Route children path='/map' element={<OpenMap />} />
          <Route children path='/map2' element={<OpenMapBox />} />
          <Route children path='/hero' element={<HeroFade />} />
          <Route children path='/print-itinerary' element={<PrintItineraryPage />} />
          {/* <Route children path='/scratch' element={<Scratch />} /> */}
          <Route children path='/account-settings' element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
        </Routes>
        {/* <h1 className='empty-3'></h1> */}
        {/* <h1 className='empty-6'></h1> */}
      </div>

      <Footer />
    </>
  )
}

export default App
