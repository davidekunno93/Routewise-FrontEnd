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

function App() {
  const loggedIn = window.localStorage.getItem("isLoggedIn");
  const userData = window.localStorage.getItem("userData")
  const userPref = window.localStorage.getItem("userPref")
  const { user, setUser } = useContext(DataContext);
  const { userPreferences, setUserPreferences } = useContext(DataContext);
  const [currentTrip, setCurrentTrip] = useState({
    tripID: null,
    tripName: "",
    city: null,
    country: "",
    country_2letter: null,
    startDate: "",
    endDate: "",
    tripDuration: "",
    geocode: null,
    imgUrl: null,
    places: [],
    itinerary: null
  });
  const clearCurrentTrip = () => {
    setCurrentTrip({
      tripID: null,
      tripName: "",
      city: null,
      country: "",
      country_2letter: null,
      startDate: "",
      endDate: "",
      tripDuration: "",
      geocode: null,
      imgUrl: null,
      itinerary: null
    })
  }
  // const [tripID, setTripID] = useState(null);
  useEffect(() => {
    wakeUpBackEnd()
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


  const [sidebarExpanded, setSidebarExpanded] = useState(false)
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


  // other functions
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const [sidebarDisplayed, setSidebarDisplayed] = useState(false);
  const showSidebar = () => {
    setSidebarDisplayed(true)
  }
  const hideSidebar = () => {
    setSidebarDisplayed(false)
  }

  // for itinerary page only - decides which list is being displayed
  const [placeListDisplay, setPlaceListDisplay] = useState('Itinerary') // Suggested Places, Saved Places
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


  return (
    <>
      <div className={`${sidebarDisplayed ? "flx-r" : null}`}>

        <div id='itinerarySideBarPlaceholder' className="itinerary-sidebar-placeholder" style={{ display: sidebarDisplayed ? "flex" : "none" }}>
          <div id='itinerarySidebar' className="itinerary-sidebar-expanded position-fixed" style={{ display: sidebarDisplayed ? "flex" : "none" }}>
            <div id='sb-logoSpace' className="logo-space">
              <div className="icon-cold">
                <img onClick={() => toggleSidebarExpanded()} src="https://i.imgur.com/d2FMf3s.png" alt="" className="logo-icon" />
              </div>

              <img src="https://i.imgur.com/Eu8Uf2u.png" alt="" className="text-logo-icon" />

            </div>
            <div className="option">
              <div className="icon">
                <img src={auth.currentUser ? auth.currentUser.photoURL : "https://i.imgur.com/Cd8150t.png"} alt="" className="icon-profile" />
              </div>

              <div className="flx-c sb-expanded">
                <p className="m-0 darkpurple-text small">{auth.currentUser ? auth.currentUser.displayName : "Josh"}</p>
                <p className="m-0 x-small gray-text">View Profile</p>
              </div>

            </div>
            <div className="option">
              <img src="https://i.imgur.com/46TY6aA.png" alt="" className="icon" />

              <p className="m-0 darkpurple-text sb-expanded">Dashboard</p>

            </div>
            <hr className='w-100' />
            {sidebarOptions.map((option, index) => {
              let selected = placeListDisplay === option.title ? true : false
              return <div onClick={() => setPlaceListDisplay(option.title)} className={`${selected ? "option-selected" : "option"}`}>
              <img src={option.iconUrl} alt="" className="icon" />
              <p className="m-0 darkpurple-text sb-expanded">{option.title}</p>
            </div>
            })}
            

            {/* <div onClick={() => setPlaceListDisplay("Itinerary")} className="option-selected">
              <img src="https://i.imgur.com/UeFtCUp.png" alt="" className="icon" />

              <p className="m-0 darkpurple-text sb-expanded">Itinerary</p>

            </div>
            <div className="option">
              <img src="https://i.imgur.com/YnFB61Q.png" alt="" className="icon" />

              <p className="m-0 darkpurple-text sb-expanded ws-nowrap">Saved Places</p>

            </div>
            <div onClick={() => setPlaceListDisplay("Suggested Places")} className="option">
              <img src="https://i.imgur.com/YoB68Vw.png" alt="" className="icon" />

              <div className="sb-expanded">
                <p className="m-0 darkpurple-text ws-nowrap">Suggested Places</p>
              </div>

            </div> */}

          </div>
        </div>


        <div className="flx-1 flx-c">
          <Navbar sidebarDisplayed={sidebarDisplayed} placeListDisplay={placeListDisplay} />
          <Routes>
            <Route children path='/register' element={<SignUp />} />
            <Route children path='/' element={loggedIn ? <Dashboard /> : <Landing />} />
            <Route children path='/landing' element={<Landing />} />
            <Route children path='/survey' element={<Survey />} />
            <Route children path='/survey-update' element={<SurveyUpdate />} />
            <Route children path='/dashboard' element={<Dashboard currentTrip={currentTrip} setCurrentTrip={setCurrentTrip} clearCurrentTrip={clearCurrentTrip} />} />
            <Route children path='/add-places' element={<AddPlaces currentTrip={currentTrip} setCurrentTrip={setCurrentTrip} clearCurrentTrip={clearCurrentTrip} />} />
            <Route children path='/itinerary' element={<Itinerary currentTrip={currentTrip} setCurrentTrip={setCurrentTrip} clearCurrentTrip={clearCurrentTrip} showSidebar={showSidebar} hideSidebar={hideSidebar} sidebarOptions={sidebarOptions} placeListDisplay={placeListDisplay} setPlaceListDisplay={setPlaceListDisplay} />} />
            <Route children path='/test' element={<Test />} />
            <Route children path='/map' element={<OpenMap />} />
            <Route children path='/hero' element={<HeroFade />} />
          </Routes>
          <h1 className='empty-3'></h1>
          {/* <h1 className='empty-6'></h1> */}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default App
