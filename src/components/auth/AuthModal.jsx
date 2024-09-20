import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { CreatePassword } from './CreatePassword';
import { auth, firestore } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { DataContext } from '../../Context/DataProvider';
import { getAuth, getRedirectResult, signInWithPopup, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import provider from '../../firebaseGoogle';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import facebookProvider from '../../firebaseFacebook';
import axios from 'axios';
import { Fade, Slide } from 'react-awesome-reveal';
import { LoadingScreen } from '../Loading/LoadingScreen';
import { Loading } from '../Loading/Loading';

export const AuthModal = ({ open, authIndex, onClose }) => {
    if (!open) return null
    const { user, setUser } = useContext(DataContext);
    const { mobileMode, mobileModeNarrow } = useContext(DataContext);
    const { userPreferences, setUserPreferences } = useContext(DataContext);
    const { firstTimeUser, setFirstTimeUser } = useContext(DataContext);
    const [createPasswordOpen, setCreatePasswordOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(authIndex)
    // const [emailExpand, setEmailExpand] = useState(false);
    const [registerEmail, setRegisterEmail] = useState(null);
    const [loginEmail, setLoginEmail] = useState(null);
    const [createPassword, setCreatePassword] = useState(null);
    const [loginPassword, setLoginPassword] = useState(null);


    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }


    const navigate = useNavigate()

    const updateRegisterEmail = (e) => {
        setRegisterEmail(e.target.value)
        // console.log(e.target.value)
    }
    const updateCreatePassword = (e) => {
        setCreatePassword(e.target.value)
        // console.log(e.target.value)
    }
    const showPassword = (passwordID) => {
        const passwordEntry = document.getElementById(passwordID)
        const showPasswordOpen = document.getElementById(`${passwordID}Open`)
        const showPasswordClose = document.getElementById(`${passwordID}Close`)
        passwordEntry.setAttribute('type', 'text')
        showPasswordOpen.classList.add('d-none')
        showPasswordClose.classList.remove('d-none')
    }
    const hidePassword = (passwordID) => {
        const passwordEntry = document.getElementById(passwordID)
        const showPasswordOpen = document.getElementById(`${passwordID}Open`)
        const showPasswordClose = document.getElementById(`${passwordID}Close`)
        passwordEntry.setAttribute('type', 'password')
        showPasswordOpen.classList.remove('d-none')
        showPasswordClose.classList.add('d-none')
    }

    const updateIndex = (newIndex) => {
        setActiveIndex(newIndex)
    }
    const validateEmail = (emailEntry) => {
        return String(emailEntry)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const continueWithEmail = () => {
        const emailInput = document.getElementById('registerEmail')
        const invalidEmail = document.getElementById('invalidEmail')
        if (registerEmail) {
            if (validateEmail(registerEmail)) {
                openCreatePassword()
            } else {
                emailInput.classList.add('entry-error');
                invalidEmail.innerText = "Please enter a valid email"
                invalidEmail.classList.remove('o-none');
            }
        } else {
            emailInput.classList.add('entry-error');
            invalidEmail.innerText = "Please enter a valid email"
            invalidEmail.classList.remove('o-none');
        }
    }

    const openCreatePassword = () => {
        setCreatePasswordOpen(true);
    }
    const closeCreatePassword = () => {
        setCreatePasswordOpen(false);
    }

    const closeAll1 = () => {
        closeCreatePassword()
        onClose()
    }

    const signInWithEmail = () => {
        const loginEmailEntry = document.getElementById('loginEmail')
        const loginPasswordEntry = document.getElementById('loginPassword')
        if (!loginEmail) {
            loginEmailEntry.classList.add('entry-error')
        }
        if (!loginPassword) {
            loginPasswordEntry.classList.add('entry-error')
        }
        if (loginEmail && loginPassword) {
            signInWithEmailAndPassword(auth, loginEmail, loginPassword).then((userCredentials) => {
                handleLogin(userCredentials)
                // let userPref = getDoc(doc(firestore, `userPreferences/${userCredentials.user.uid}`))
                // setUser(userCredentials.user)
                // navigate('/dashboard')
                // onClose()
            }).catch((error) => handleLoginError(error.code))
        }
    }
    const handleLogin = async (cred) => {
        let firstDoc = await getDoc(doc(firestore, `firstTimeUser/${cred.user.uid}`))
        let firstData = firstDoc.data()
        if (firstData) {
            console.log(firstData)
        } else {
            setDoc(doc(firestore, `firstTimeUser/${cred.user.uid}`), {
                firstPlaceAdded: true,
                firstSignIn: false
            })
        }
        // setFirstTimeUser(firstDataCopy)
        let prefs = await getDoc(doc(firestore, `userPreferences/${cred.user.uid}`))
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
        // console.log(userPref)
        setUserPreferences(userPref)
        // window.localStorage.setItem("userData", [cred.user]);
        // window.localStorage.setItem("userPref", [userPref]);
        // window.localStorage.setItem("isLoggedIn", true);
        setUser(cred.user)
        navigate('/dashboard')
        onClose()
    }
    const handleLoginError = (error_code) => {
        console.log(error_code)
        if (error_code === "auth/invalid-login-credentials" || error_code === "auth/invalid-credential") {
            alert("Invalid Email/Password combination")
            console.log("Invalid Email/Password combination")
        }
    }

    const updateLoginEmail = (e) => {
        setLoginEmail(e.target.value)
    }
    const updateLoginPassword = (e) => {
        setLoginPassword(e.target.value)
    }

    const facebookSignIn = () => {
        signInWithPopup(auth, facebookProvider)
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error.message)
            })
    }

    const googleSignIn = async () => {
        signInWithPopup(auth, provider).then(async (data) => {
            console.log(data.user)
            console.log(auth.currentUser)
            setUser(data.user)
            let userData = {
                uid: data.user.uid,
                displayName: data.user.displayName,
                email: data.user.email
            }
            setIsLoading(true)
            const response = await axios.post("https://routewise-backend.onrender.com/profile/user", JSON.stringify(userData), {
                headers: { "Content-Type": "application/json" }
            })

            // send Kate user uid, email, name : she checks if user in database, if not create user
            // make function async function that awaits Kates back-end membership check before continue
            console.log(response)
            if (response.data === "User has already been added to the database.") {
                onClose()
                navigate('dashboard')
            } else {
                onClose()
                navigate('/survey')
            }


            // localStorage.setItem('email', data.user.email)

        })

    }

    // getRedirectResult(auth).then

    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            <div className="overlay-placeholder">

                <Fade duration={200} className='z-99999' triggerOnce>
                    <div className="overlay"></div>
                    <div className={`auth-modal flx-r ${mobileModeNarrow && "mobileNarrow"}`}>
                        {!mobileMode &&
                            <div className="auth-modal-imgDiv">
                                <div className="caption">
                                    {/* <span className="material-symbols-outlined white-text">location_on</span> */}
                                    <img src="https://i.imgur.com/Wg1jAcU.png" alt="" className="img-xxxsmall" />
                                    <p className='m-0 white-text'>Lisbon, Portugal&nbsp;</p>
                                </div>
                                <img src="https://i.imgur.com/8WWTVLl.png" alt="" className="auth-modal-img" />
                            </div>
                        }
                        <CreatePassword showPassword={showPassword} hidePassword={hidePassword} open={createPasswordOpen} email={registerEmail} onClose={() => closeCreatePassword()} closeAll={() => closeAll1()} />
                        <div className={`carousel-window-auth ${mobileMode && "mobile"} ${mobileModeNarrow && "mobileNarrow"} m-auto flx-r position-relative ${createPasswordOpen && "d-none"}`}>
                            <div id='loadingBox' className={`loadingBox-2 z-1000000 w-100 h-100 ${isLoading ? null : "hidden-o"}`}>
                                <Loading />
                            </div>

                            <span onClick={onClose} className={`closeBtn-auth ${mobileModeNarrow ? "mt-4 lightgray-text" : "color-gains"} material-symbols-outlined position-absolute xx-large`}>
                                close
                            </span>

                            <div id='inner' className="inner-no-flex" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                                <div className="carousel-item-centered">
                                    <div className={`sign-up-box ${mobileModeNarrow && "mobile"} position-relative ${activeIndex !== 0 && "hidden-o"}`}>

                                        <h1 className={`mt-4 ${mobileModeNarrow && "xx-large"}`}>Sign Up</h1>
                                        <button onClick={() => googleSignIn()} className={`btn-outline ${mobileModeNarrow && "mobile"} bg-white position-relative my-1 font-jakarta purple-text`}><img src="https://i.imgur.com/JN3RsNN.png" alt="" className={`btn-icon-left ${mobileModeNarrow && "mobile"}`} /> Sign up with Google</button>
                                        {/* <button className='btn-outline bg-white position-relative my-1 font-jakarta purple-text'><img src="https://i.imgur.com/24a8oUQ.png" alt="" className="btn-icon-left" /> Sign up with Facebook</button> */}
                                        <div className="hr-block w-75 flx-r">
                                            <div className="flx-1 flx-c just-ce">
                                                <hr className='w-100 border-gains' />
                                            </div>
                                            <p className='px-2'><strong>or</strong></p>
                                            <div className="flx-1 flx-c just-ce">
                                                <hr className='w-100 border-gains' />
                                            </div>
                                        </div>
                                        <p id='invalidEmail' className="m-0 red-text o-none">&nbsp;</p>
                                        <div className={`inputBox ${mobileModeNarrow && "mobile"} flx-c my-2`}>
                                            <input id='registerEmail' onChange={(e) => updateRegisterEmail(e)} type='text' className={`input-model ${mobileModeNarrow && "mobile"}`} required />
                                            <span className='title font-jakarta'>Email</span>
                                        </div>

                                        <button id='continueEmail' onClick={() => continueWithEmail()} className={`btn-primary ${mobileModeNarrow && "mobile"} bg-white font-jakarta bg-lightpurple white-text`}>Continue with email</button>
                                        <div className='m-0 small mt-3 font-jakarta dark-text'>Already have an account? <Link onClick={() => updateIndex(1)} className='link-text'><strong>Log In</strong></Link></div>
                                    </div>
                                </div>
                                <div className="carousel-item-centered">
                                    <div className={`sign-in-box ${mobileModeNarrow && "mobile"} ${activeIndex !== 1 && "hidden-o"}`}>
                                        <h1 className={`mt-4 ${mobileModeNarrow && "xx-large"}`}>Log In</h1>
                                        <button onClick={() => googleSignIn()} className={`btn-outline ${mobileModeNarrow && "mobile"} bg-white purple-text position-relative my-1 font-jakarta`}><img src="https://i.imgur.com/JN3RsNN.png" alt="" className={`btn-icon-left ${mobileModeNarrow && "mobile"}`} /> Log in with Google</button>

                                        {/* <button target="_blank" className='btn-outline bg-white purple-text position-relative my-1 font-jakarta'><img src="https://i.imgur.com/24a8oUQ.png" alt="" className="btn-icon-left" /> Log in with Facebook</button> */}
                                        <div className="hr-block w-75 flx-r">
                                            <div className="flx-1 flx-c just-ce">
                                                <hr className='w-100 border-gains' />
                                            </div>
                                            <p className='px-2'><strong>or</strong></p>
                                            <div className="flx-1 flx-c just-ce">
                                                <hr className='w-100 border-gains' />
                                            </div>
                                        </div>


                                        <div className={`inputBox ${mobileModeNarrow && "mobile"} my-2`}>
                                            <input id='loginEmail' onChange={(e) => updateLoginEmail(e)} type='text' className={`input-model ${mobileModeNarrow && "mobile"}`} required />
                                            <span className='title font-jakarta'>Email</span>
                                        </div>

                                        <div id='login-password-input' className={`inputBox ${mobileModeNarrow && "mobile"} mb-2`}>
                                            <input id='loginPassword' onChange={(e) => updateLoginPassword(e)} type='password' className={`input-model ${mobileModeNarrow && "mobile"}`} required />
                                            <span className='title font-jakarta'>Password</span>
                                            <div id='loginPasswordOpen' onClick={() => showPassword('loginPassword')} className='icon-right flx-c just-ce'><img src="https://i.imgur.com/DkqcKz7.png" alt="" className="icon-xsmall center o-80" /></div>
                                            <div id='loginPasswordClose' onClick={() => hidePassword('loginPassword')} className='icon-right flx-c just-ce d-none'><img src="https://i.imgur.com/yoo70zI.png" alt="" className="icon-xsmall center o-80" /></div>
                                        </div>

                                        <button onClick={() => signInWithEmail()} id='loginWithEmail' className={`btn-primary ${mobileModeNarrow && "mobile"} bg-lightpurple white-text font-jakarta`}>Log in with email</button>
                                        <div className='m-0 small mt-3 font-jakarta dark-text'>Create an account? <Link onClick={() => updateIndex(0)} className='link-text'><strong>Sign Up</strong></Link></div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fade>

            </div>
        </>
    )
}
