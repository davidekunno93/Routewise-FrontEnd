import { useContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
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
import { auth } from './firebase'
import MyTrips from './views/MyTrips'
import OpenMapBox from './components/OpenMapBox'

function App() {
  const loggedIn = window.localStorage.getItem("isLoggedIn");
  const userData = window.localStorage.getItem("userData")
  const userPref = window.localStorage.getItem("userPref")
  const { user, setUser } = useContext(DataContext);
  const { userPreferences, setUserPreferences } = useContext(DataContext);
  // const [currentTrip, setCurrentTrip] = useState({
  //   tripID: null,
  //   tripName: "",
  //   city: null,
  //   country: "",
  //   country_2letter: null,
  //   startDate: "",
  //   endDate: "",
  //   tripDuration: "",
  //   geocode: null,
  //   imgUrl: null,
  //   places: [],
  //   itinerary: null,
  //   itineraryFirstLoad: false
  // });
  // const clearCurrentTrip = () => {
  //   setCurrentTrip({
  //     tripID: null,
  //     tripName: "",
  //     city: null,
  //     country: "",
  //     country_2letter: null,
  //     startDate: "",
  //     endDate: "",
  //     tripDuration: "",
  //     geocode: null,
  //     imgUrl: null,
  //     places: [],
  //     itinerary: null,
  //     itineraryFirstLoad: false
  //   })
  // }
  // const [tripID, setTripID] = useState(null);
  useEffect(() => {
    wakeUpBackEnd()
    console.log(auth.currentUser)
  }, [])

  const testRedirect = () => {
    let url = 'https://routewise-backend.onrender.com/places/update-trip/12'
    const response = axios.post(url, { data: 'test-data' }, {
      headers: { "Content-Type": "application/json" }
    }).then((response) => {
      console.log(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }

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
          <Route children path='/' element={user ? <Dashboard /> : <Landing />} />
          <Route children path='/landing' element={<Landing />} />
          <Route children path='/survey' element={<Survey />} />
          <Route children path='/survey-update' element={<SurveyUpdate />} />
          <Route children path='/dashboard' element={<Dashboard />} />
          <Route children path='/add-places' element={<AddPlaces />} />
          <Route children path='/itinerary' element={<Itinerary />} />
          <Route children path='/mytrips' element={<MyTrips />} />
          <Route children path='/test' element={<Test />} />
          <Route children path='/map' element={<OpenMap />} />
          <Route children path='/map2' element={<OpenMapBox />} />
          <Route children path='/hero' element={<HeroFade />} />
        </Routes>
        {/* <h1 className='empty-3'></h1> */}
        {/* <h1 className='empty-6'></h1> */}
      </div>

      <Footer />
    </>
  )
}

export default App
