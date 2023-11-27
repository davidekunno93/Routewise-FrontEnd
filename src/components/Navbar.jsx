import React, { useContext, useDebugValue, useEffect, useState } from 'react'
import { AuthModal } from './auth/AuthModal';
import { Link } from 'react-router-dom';
import auth from '../firebase';
import { DataContext } from '../Context/DataProvider';
import { signOut } from 'firebase/auth';
import axios from 'axios';

export const Navbar = () => {
  const { user, setUser } = useContext(DataContext);
  // auth modal open and close states
  const [isOpen, setIsOpen] = useState(false);
  const [authIndex, setAuthIndex] = useState(null);

  useEffect(() => {
    auth.currentUser ? setUser(auth.currentUser) : null
  }, [])

  const openSignUp = () => {
    setAuthIndex(0);
    setIsOpen(true);
  }
  const openSignIn = () => {
    setAuthIndex(1);
    setIsOpen(true);
  }

  const toggleUserOptions = () => {
    const userOptions = document.getElementById('userOptions')
    userOptions.classList.toggle('d-none')
  }

  const logOut = () => {
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

  return (
    <>
      <div className='navbar bg-white w-100 flx-r just-sb'>
        {/* <img src="https://i.imgur.com/Xj94sDN.gifv" alt="" className="med-pic" /> */}
        <div className="flx-c just-ce">
        <Link className='ml15' to='/'><img src="https://i.imgur.com/VvcOzlX.png" alt="Routewise" className="routewise-logo" /></Link>
        </div>
        <Link className="model-link mt-4" to='/survey'><div>Survey</div></Link>
        <Link className="model-link mt-4" to='/dashboard'><div>Dashboard</div></Link>
        <Link className="model-link mt-4" to='/add-places'><div>Add Places</div></Link>
        <Link className="model-link mt-4" to='/itinerary'><div>Itinerary</div></Link>
        {/* <button onClick={() => sendDataTest()} className='btn-primaryflex model-btn'>Communicate w/ Kate</button> */}
        {user ?
          <div className="right-btns flx-c just-ce position-relative">
            <div className="flx-r">
              <div className="flx-c just-ce">
              <p className='username-text m-0 mt- inline mx-2'>{user.displayName}</p>
              </div>
              <div className="profile-icon">
                <img onClick={() => toggleUserOptions()} src={user.photoURL} alt="" className="profile-img pointer" />
              </div>

            </div>
            <div id='userOptions' className="user-options-popup flx-c position-absolute d-none">
              <Link onClick={() => logOut()}>Sign Out</Link>
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
      <AuthModal open={isOpen} authIndex={authIndex} onClose={() => setIsOpen(false)} />
    </>
  )
}
