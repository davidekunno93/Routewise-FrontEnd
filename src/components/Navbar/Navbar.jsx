import React, { useContext, useDebugValue, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AuthModal } from '../auth/AuthModal/AuthModal';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { DataContext } from '../../Context/DataProvider';
import { signOut } from 'firebase/auth';
import axios from 'axios';
import SurveyModal from '../SurveyModal';
import PassCodeModal from '../PassCodeModal';
import EmailVerificationModal from '../EmailVerificationModal/EmailVerificationModal';

export const Navbar = () => {
  const { mobileMode, pageOpen, user, setUser, signUpIsOpen, setSignUpIsOpen,
    authControls, authFunctions } = useContext(DataContext);


  useLayoutEffect(() => {
    auth.currentUser ? setUser(auth.currentUser) : null;
  }, [auth]);



  // [User (profile icon click) menu]
  const toggleUserMenu = () => {
    const userMenu = document.getElementById('userMenu')
    userMenu.classList.toggle('hide')
  }
  useEffect(() => {
    document.addEventListener('click', hideOnClickOutside, true);
    return document.removeEventListener('click', hideOnClickOutside);
  }, []);
  const hideOnClickOutside = (e) => {
    if (refUserDropdown.current && !refUserDropdown.current.contains(e.target)) {
      const userMenu = document.getElementById('userMenu')
      userMenu.classList.add('hide')
    };
  };
  const refUserDropdown = useRef(null);
  const closeUserMenu = () => {
    let userMenu = document.getElementById('userMenu')
    userMenu.classList.add('hide')
  };


  // [nav menu mobile]
  const hamburgerRef = useRef(null);
  const navMenuMobileRef = useRef(null);
  useEffect(() => {
    document.addEventListener('click', hideOnClickOutsideMobileMenu, true);
    return () => document.removeEventListener('click', hideOnClickOutsideMobileMenu, true)
  }, []);
  const hideOnClickOutsideMobileMenu = (e) => {
    if (navMenuMobileRef.current && hamburgerRef.current) {
      if (navMenuMobileRef.current && !navMenuMobileRef.current.contains(e.target) && !hamburgerRef.current.contains(e.target)) {
        setNavMenuMobileOpen(false);
      };
    };
  };


  // [Prototype Menu] - make function library
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
      console.log("signed out user", auth.currentUser)
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
  const [passcodeModalOpen, setPasscodeModalOpen] = useState(false);
  const openPasscodeModal = () => {
    if (auth.currentUser) {
      setPasscodeModalOpen(true);
    } else {
      alert("Please sign in to get Website access")
    }
  };

  // email verification modal
  const [emailVerificationModalOpen, setEmailVerificationModalOpen] = useState(false);

  return (
    <>
      <EmailVerificationModal open={emailVerificationModalOpen} onClose={() => setEmailVerificationModalOpen(false)} />
      <AuthModal open={authControls.isOpen} onClose={() => authFunctions.close()} />
      <PassCodeModal open={passcodeModalOpen} onClose={() => setPasscodeModalOpen(false)} />
      {/* <SurveyModal /> */}
      <div className={`navbar bg-white w-100 flx-r just-sb`}>
        {mobileMode &&
          <div ref={hamburgerRef} onClick={() => setNavMenuMobileOpen((navMenuMobileOpen) => !navMenuMobileOpen)} className="hamburger-icon ml-2">
            <span className="line-1"></span>
            <span className="line-2"></span>
            <span className="line-3"></span>
          </div>
        }
        {/* nav menu mobile */}
        <div ref={navMenuMobileRef} className={`nav-menu-mobile ${!navMenuMobileOpen && "hide"}`}>
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
          <Link onClick={() => { openPasscodeModal(); setNavMenuMobileOpen(false) }}><div className="option">
            <span className="material-symbols-outlined gray-text">
              lock
            </span>
            <p className="m-0 gray-text">Access</p>
          </div></Link>
        </div>
        {/* end nav menu mobile */}
        <div className="flx-c just-ce">
          <Link onClick={() => togglePrototypeMenu()} className=''>

            <img src={`${mobileMode ? "https://i.imgur.com/Eu8Uf2u.png" : "https://i.imgur.com/VvcOzlX.png"}`} alt="Routewise" className={`routewise-logo ${mobileMode ? "m-aut mobile mt-  position-absolute abs-center" : "ml15-disappear768"}`} />

          </Link>
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
        {!mobileMode && auth.currentUser &&
          <div className="navbar-left-side gap-7 position-left">
            <Link to='/dashboard'>
              <div className={`${pageOpen === "dashboard" ? "option-selected" : "option"}`}>
                <div className="flx-r gap-2">
                  <p className="m-0">Dashboard</p>
                </div>
              </div>
            </Link>

            <Link to='/mytrips'><div className={`${pageOpen === "my trips" ? "option-selected" : "option"}`}>
              <div className="flx-r gap-2">

                <p className="m-0">My Trips</p>
              </div>
            </div></Link>

            <div onClick={() => openPasscodeModal()} className={`option`}>
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
          <div ref={refUserDropdown} className="z-1 right-side-btns flx-c just-ce position-relative">
            <div className="flx-r">
              <div className="flx-c just-ce">
                <p className={`username-text ${mobileMode && "d-none"} m-0 mt- inline mx-2`}>{auth.currentUser.displayName}</p>
              </div>
              <div className={`profile-icon ${mobileMode && "mobile"}`}>
                <img onClick={() => toggleUserMenu()} src={auth.currentUser.photoURL} alt="" className="profile-img pointer" />
              </div>

            </div>
            <div id='userMenu' className="user-menu flx-c position-absolute hide">
              <div className="option-cold">
                <span className="material-symbols-outlined">
                  account_circle
                </span>
                <div className="">
                  <p className="m-0 ml-2">{auth.currentUser ? auth.currentUser.displayName : "*Username*"}</p>
                  <p className="m-0 ml-2 gray-text x-small">Logged in</p>
                </div>
              </div>
              <Link onClick={() => closeUserMenu()} to='/survey-update'><div className="option">
                <span className="material-symbols-outlined">
                  favorite
                </span><p className="m-0 ml-2">Travel Preferences</p></div></Link>
              <Link><div className="option">
                <span className="material-symbols-outlined">
                  settings
                </span>
                <p className="m-0 ml-2">Account Settings</p></div></Link>
              <Link onClick={() => { setEmailVerificationModalOpen(true); closeUserMenu()}}><div className="option">
                <span className="material-symbols-outlined">
                  lock
                </span>
                <p className="m-0 ml-2">Email
                  {user && user.emailVerified ?
                    <span className='green-text'>&nbsp;Verified</span>
                    :
                    <span className='red-text'>&nbsp;Not Verified</span>
                  }
                </p></div></Link>
              <Link onClick={() => { logOut(); closeUserMenu() }}>
                <div className="option">
                  <span className="material-symbols-outlined">
                    logout
                  </span>
                  <p className="m-0 ml-2">Sign Out</p></div></Link>
            </div>
          </div>
          :
          <div className="right-side-btns">
            {!mobileMode ?
              <button onClick={() => authFunctions.openSignUp()} className={`btn-tertiaryflex small`}>Sign Up</button>
              :
              <p onClick={() => authFunctions.openSignUp()} className="m-0 purple-text">Sign Up</p>
            }
            {!mobileMode &&
              <button onClick={() => authFunctions.openSignIn()} className="btn-outlineflex small">Log in</button>
            }
          </div>
        }
      </div>
    </>
  )
}
