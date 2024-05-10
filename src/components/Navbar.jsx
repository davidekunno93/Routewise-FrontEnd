import React, { useContext, useDebugValue, useEffect, useRef, useState } from 'react'
import { AuthModal } from './auth/AuthModal';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { DataContext } from '../Context/DataProvider';
import { signOut } from 'firebase/auth';
import axios from 'axios';
import SurveyModal from './SurveyModal';
import PassCodeModal from './PassCodeModal';

export const Navbar = () => {
  const { mobileMode, mobileModeNarrow } = useContext(DataContext);
  const { showNavbar } = useContext(DataContext);
  const { sidebarDisplayed, placeListDisplay } = useContext(DataContext);
  const { pageOpen, setPageOpen } = useContext(DataContext);
  const { user, setUser } = useContext(DataContext);
  // auth modal open and close states
  const { signUpIsOpen, setSignUpIsOpen } = useContext(DataContext);
  const { authIndex, setAuthIndex } = useContext(DataContext);


  // load user
  useEffect(() => {
    auth.currentUser ? setUser(auth.currentUser) : null
  }, [auth])

  const checkAuth = () => {
    if (!user && auth.currentUser) {
      setUser(auth.currentUser)
    }
  }
  useEffect(() => {
    window.addEventListener('click', checkAuth)
  }, [])


  // show auth modal
  const openSignUp = () => {
    setAuthIndex(0);
    setSignUpIsOpen(true);
  }
  const openSignIn = () => {
    setAuthIndex(1);
    setSignUpIsOpen(true);
  }







  // send Kate data testing
  const sendData = async () => {
    // let authUser = auth.currentUser
    let data = {
      uid: "strings",
      displayName: "displayName",
      email: "authUsers@email.com",
      // photoURL: authUser.photoURL
    }
    console.log(data)
    // kate's url = https://routewise-backend.onrender.com
    const response = await axios.post("https://routewise-backend.onrender.com/profile/user", JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    }).then((response => console.log(response)))
      .catch((error) => console.log(error))
  }
  const sendDataTest = async () => {
    let data = {
      uid: 'helloMotto123',
      displayName: 'displayName1',
      email: 'pleasework@email.com',
      // photoURL: authUser.photoURL
    }
    console.log(data)
    // kate's url = https://routewise-backend.onrender.com
    const response = await axios.post("https://routewise-backend.onrender.com/profile/user", JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    }).then((response => console.log(response)))
      .catch((error) => console.log(error))
  }
  // Demo trip data
  const sendTripDataTest = () => {
    let data = {
      uid: "1234567",
      tripName: "Big Apple",
      Destination: "New York City, New York",
      DestinationImgUrl: "https://i.imgur.com/RxO0dfy.jpg",
      startDate: "11/17/2023",
      endDate: "11/20/2023"
    }
  }


  // User (profile icon click) menu
  const toggleUserMenu = () => {
    const userMenu = document.getElementById('userMenu')
    userMenu.classList.toggle('hide')
  }
  useEffect(() => {
    document.addEventListener('click', hideOnClickOutside, true);
    return document.removeEventListener('click', hideOnClickOutside);
  }, [])
  const hideOnClickOutside = (e) => {
    if (refUserDropdown.current && !refUserDropdown.current.contains(e.target)) {
      const userMenu = document.getElementById('userMenu')
      userMenu.classList.add('hide')
    }
  }
  const refUserDropdown = useRef(null);
  const closeUserMenu = () => {
    let userMenu = document.getElementById('userMenu')
    userMenu.classList.add('hide')
  }


  // Prototype Menu
  const openPrototypeMenu = () => {
    let prototypeMenu = document.getElementById('prototype-menu')
    prototypeMenu.classList.remove('d-none')
  }
  const closePrototypeMenu = () => {
    let prototypeMenu = document.getElementById('prototype-menu')
    prototypeMenu.classList.add('d-none')
  }
  const togglePrototypeMenu = () => {
    let prototypeMenu = document.getElementById('prototype-menu')
    prototypeMenu.classList.toggle('d-none')
  }
  const refMenu = useRef(null)
  useEffect(() => {
    document.addEventListener('click', hideOnClickOutsideMenu, true)
  }, [])

  const hideOnClickOutsideMenu = (e) => {
    if (refMenu.current && !refMenu.current.contains(e.target)) {
      closePrototypeMenu()
    }
  }


  // other functions
  const navigate = useNavigate()

  const logOut = () => {
    signOut(auth).then(() => {
      setUser(null)
      setLogoutStandby(true);
      console.log('signed out')
      console.log("auth = ", auth.currentUser)
    })
  }
  const [logoutStandby, setLogoutStandby] = useState(false);
  useEffect(() => {
    if (logoutStandby && !user) {
      setLogoutStandby(false);
      navigate('/') // can't navigate on a link element
      console.log("auth : ", auth)
      console.log("user: ", user)
    }
  }, [logoutStandby])

  // open states code
  const [navMenuMobileOpen, setNavMenuMobileOpen] = useState(false);
  const [passCodeModalOpen, setPassCodeModalOpen] = useState(false);

  return (
    <>
    <AuthModal open={signUpIsOpen} authIndex={authIndex} onClose={() => setSignUpIsOpen(false)} />
    <PassCodeModal open={passCodeModalOpen} onClose={() => setPassCodeModalOpen(false)} />
    {/* <SurveyModal /> */}
      <div className={`navbar bg-white w-100 flx-r just-sb ${!showNavbar ? "d-none" : null} `}>
        {/* <img src="https://i.imgur.com/Xj94sDN.gifv" alt="" className="med-pic" /> */}
        {mobileMode &&
          <div onClick={() => setNavMenuMobileOpen((navMenuMobileOpen) => !navMenuMobileOpen)} className="hamburger-icon ml-2">
            <span className="line-1"></span>
            <span className="line-2"></span>
            <span className="line-3"></span>
          </div>
        }
        {/* nav menu mobile */}
        <div className={`nav-menu-mobile ${!navMenuMobileOpen && "hide"}`}>
          <Link onClick={() => setNavMenuMobileOpen(false)} to='/dashboard'><div className="option">
            <img src="https://i.imgur.com/N6JGq3D.png" alt="" className="navbar-icon ml-h" />
            <p className="m-0 gray-text">Dashboard</p>
          </div></Link>
          <Link onClick={() => setNavMenuMobileOpen(false)} to='/mytrips'><div className="option">
            <span className="material-symbols-outlined gray-text">
              flight_takeoff
            </span>
            <p className="m-0 gray-text">My Trips</p>
          </div></Link>
        </div>
        {/* end nav menu mobile */}
        <div className="flx-c just-ce">
          <Link onClick={() => togglePrototypeMenu()} className=''>

            <img src={`${mobileMode ? "https://i.imgur.com/Eu8Uf2u.png" : "https://i.imgur.com/VvcOzlX.png"}`} alt="Routewise" className={`routewise-logo ${mobileMode ? "m-auto mobile mt-1" : "ml15-disappear768"}`} />

          </Link>
          {/* <Link className='ml15' to='/'><img src="https://i.imgur.com/VvcOzlX.png" alt="Routewise" className="routewise-logo" /></Link> */}
        </div>
        <div ref={refMenu} id='prototype-menu' className="prototype-menu d-none">
          <div className="option-head">PROTOTYPE MENU</div>
          <Link onClick={() => closePrototypeMenu()} to='/'><div className="option">Landing Page</div></Link>
          <Link onClick={() => closePrototypeMenu()} to='/survey'><div className="option">Survey</div></Link>
          <Link onClick={() => closePrototypeMenu()} to='/mytrips'><div className="option">My Trips</div></Link>
          <Link onClick={() => closePrototypeMenu()} to='/dashboard'><div className={`option`}>Dashboard</div></Link>
          <Link onClick={() => closePrototypeMenu()} to='/add-places'><div className="option">Add Places</div></Link>
          <Link onClick={() => closePrototypeMenu()} to='/itinerary'><div className="option">Itinerary</div></Link>

        </div>
        {!mobileMode &&
          <div className="navbar-left-side gap-7 position-left">
            <Link to='/dashboard'>
              <div className={`${pageOpen === "dashboard" ? "option-selected" : "option"}`}>
                <div className="flx-r gap-2">
                  {/* {pageOpen === "dashboard" ?
                    <img src="https://i.imgur.com/K594sfY.png" alt="" className="navbar-icon" />
                    :
                    <img src="https://i.imgur.com/N6JGq3D.png" alt="" className="navbar-icon" />
                  } */}
                  <p className="m-0">Dashboard</p>
                </div>
              </div>
            </Link>

            {/* <div className="option">
            <div className="flx-r gap-2">

              <img src="https://i.imgur.com/7ewt7zr.png" alt="" className="navbar-icon" />
              <p className="m-0">My Profile</p>
            </div>
          </div> */}
            <Link to='/mytrips'><div className={`${pageOpen === "my trips" ? "option-selected" : "option"}`}>
              <div className="flx-r gap-2">
                {/* <span className={`material-symbols-outlined`}>
                  flight_takeoff
                </span> */}
                <p className="m-0">My Trips</p>
              </div>
            </div></Link>
            {/* <div className="option">
            <div className="flx-r gap-2">
            <span className="material-symbols-outlined">
            explore
            </span>
            <p className="m-0">Discover</p>
            </div>
          </div> */}
          <div onClick={() => setPassCodeModalOpen(true)} className={`option`}>
            <div className="flx-r gap-2">
              <span className={`material-symbols-outlined`}>
                lock
              </span>
              <p className="m-0 bold500">Access</p>
            </div>
          </div>


          </div>
        }

        {auth.currentUser ?
          <div ref={refUserDropdown} className="z-1 right-btns flx-c just-ce position-relative">
            <div className="flx-r">
              <div className="flx-c just-ce">
                <p className={`username-text ${mobileMode && "d-none"} m-0 mt- inline mx-2`}>{auth.currentUser.displayName}</p>
              </div>
              <div className={`profile-icon ${mobileMode && "mobile"}`}>
                <img onClick={() => toggleUserMenu()} src={auth.currentUser.photoURL} alt="" className="profile-img pointer" />
              </div>

            </div>
            <div id='userMenu' className="user-menu flx-c position-absolute hide">
              <Link onClick={() => closeUserMenu()} to='/survey-update'><div className="option">
                <span className="material-symbols-outlined">
                  favorite
                </span><p className="m-0 ml-2">Travel Preferences</p></div></Link>
              <Link><div className="option">
                <span className="material-symbols-outlined">
                  settings
                </span>
                <p className="m-0 ml-2">Account Settings</p></div></Link>
              <Link onClick={() => { logOut(); closeUserMenu() }}>
                <div className="option">
                  <span className="material-symbols-outlined">
                    logout
                  </span>
                  <p className="m-0 ml-2">Sign Out</p></div></Link>
            </div>
          </div>
          :
          <div className="right-btns flx-c just-ce">
            <div className="flx-r just-se">
              <button onClick={() => openSignUp()} className={`signUp ${mobileMode ? "btn-outline-narrow" : "btn-outlineflex"} small mx10`}>Sign Up</button>
              {!mobileMode &&
                <button onClick={() => openSignIn()} className="signIn btn-primaryflex small">Log in</button>
              }
            </div>
          </div>
        }
      </div>
    </>
  )
}
