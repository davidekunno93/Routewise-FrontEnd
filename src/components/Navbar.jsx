import React, { useContext, useDebugValue, useEffect, useRef, useState } from 'react'
import { AuthModal } from './auth/AuthModal';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { DataContext } from '../Context/DataProvider';
import { signOut } from 'firebase/auth';
import axios from 'axios';

export const Navbar = () => {
  const { user, setUser } = useContext(DataContext);
  const { signUpIsOpen, setSignUpIsOpen } = useContext(DataContext);
  // auth modal open and close states
  const [isOpen, setIsOpen] = useState(false);
  const [authIndex, setAuthIndex] = useState(null);



  useEffect(() => {
    auth.currentUser ? setUser(auth.currentUser) : null
  }, [])

  const openSignUp = () => {
    setAuthIndex(0);
    setSignUpIsOpen(true);
  }
  const openSignIn = () => {
    setAuthIndex(1);
    setSignUpIsOpen(true);
  }
  // if (signUpIsOpen) {
  //   openSignUp()
  //   setSignUpIsOpen(false)
  //   // console.log('open!!')
  // }

  const toggleUserMenu = () => {
    const userMenu = document.getElementById('userMenu')
    userMenu.classList.toggle('d-none')
  }

  const logOut = () => {
    // window.localStorage.removeItem("userData");
    // window.localStorage.removeItem("userPref");
    // window.localStorage.removeItem("isLoggedIn");
    // console.log('remove loggedIn')
    signOut()
    setUser(null)
  }

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

  useEffect(() => {
    document.addEventListener('click', hideOnClickOutside, true)
  })

  const hideOnClickOutside = (e) => {
    if (refUserDropdown.current && !refUserDropdown.current.contains(e.target)) {
      const userMenu = document.getElementById('userMenu')
      userMenu.classList.add('d-none')
    }
  }
  const refUserDropdown = useRef(null);


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


  const closeUserMenu = () => {
    let userMenu = document.getElementById('userMenu')
    userMenu.classList.add('d-none')
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



  return (
    <>
      <div className='navbar bg-white w-100 flx-r just-sb'>
        {/* <img src="https://i.imgur.com/Xj94sDN.gifv" alt="" className="med-pic" /> */}
        <div className="flx-c just-ce">
          <Link onClick={() => togglePrototypeMenu()} className='ml15-disappear768'><img src="https://i.imgur.com/VvcOzlX.png" alt="Routewise" className="routewise-logo" /></Link>
          {/* <Link className='ml15' to='/'><img src="https://i.imgur.com/VvcOzlX.png" alt="Routewise" className="routewise-logo" /></Link> */}
        </div>
        <div ref={refMenu} id='prototype-menu' className="prototype-menu d-none">
          <div className="option-head">PROTOTYPE MENU</div>
          <Link onClick={() => closePrototypeMenu()} to='/'><div className="option">Landing Page</div></Link>
          <Link onClick={() => closePrototypeMenu()} to='/survey'><div className="option">Survey</div></Link>
          <Link onClick={() => closePrototypeMenu()} to='/dashboard'><div className="option">Dashboard</div></Link>
          <Link onClick={() => closePrototypeMenu()} to='/add-places'><div className="option">Add Places</div></Link>
          <Link onClick={() => closePrototypeMenu()} to='/itinerary'><div className="option">Itinerary</div></Link>

        </div>

        {user ?
          <div className="right-btns flx-c just-ce position-relative">
            <div className="flx-r">
              <div className="flx-c just-ce">
                <p className='username-text m-0 mt- inline mx-2'>{user.displayName}</p>
              </div>
              <div className="profile-icon">
                <img onClick={() => toggleUserMenu()} src={user.photoURL} alt="" className="profile-img pointer" />
              </div>

            </div>
            <div ref={refUserDropdown} id='userMenu' className="user-menu flx-c position-absolute d-none">
              <Link><div className="option">
                <span className="material-symbols-outlined">
                  flight_takeoff
                </span>
                <p className="m-0 ml-2">My Trips</p></div></Link>
              <Link onClick={() => closeUserMenu()} to='/survey-update'><div className="option">
                <span className="material-symbols-outlined">
                  settings
                </span><p className="m-0 ml-2">Travel Preferences</p></div></Link>
              <Link><div className="option">
                <span className="material-symbols-outlined">
                  person
                </span>
                <p className="m-0 ml-2">My Account</p></div></Link>
              <Link onClick={() => {logOut(); closeUserMenu()}}><div className="option">
                <span className="material-symbols-outlined">
                  logout
                </span>
                <p className="m-0 ml-2">Sign Out</p></div></Link>
            </div>
          </div>
          :
          <div className="right-btns flx-c just-ce">
            <div className="flx-r just-se">
              <button onClick={() => openSignUp()} className="signUp btn-outlineflex small mx10">Sign Up</button>
              <button onClick={() => openSignIn()} className="signIn btn-primaryflex small">Log in</button>
            </div>
          </div>
        }
      </div>
      <AuthModal open={signUpIsOpen} authIndex={authIndex} onClose={() => setSignUpIsOpen(false)} />
    </>
  )
}
