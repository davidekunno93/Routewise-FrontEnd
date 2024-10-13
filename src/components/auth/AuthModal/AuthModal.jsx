import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { CreatePassword } from './CreatePassword';
import { auth, firestore } from '../../../firebase';
import { sendEmailVerification, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { DataContext } from '../../../Context/DataProvider';
import { signInWithPopup } from "firebase/auth";
import provider from '../../../firebaseGoogle';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import facebookProvider from '../../../firebaseFacebook';
import axios from 'axios';
import { Fade } from 'react-awesome-reveal';
import { Loading } from '../../Loading/Loading';
import './authmodal.scoped.css';
import { useSelector, useDispatch } from 'react-redux';
import PreferenceCard from '../../PreferenceCard/PreferenceCard';
import ResetPassword from './ResetPassword';

export const AuthModal = ({ open, onClose }) => {
    const { setUser, setUserPreferences, mobileMode, mobileModeNarrow,
        authControls, userPreferenceItems, wait, emailIsValid } = useContext(DataContext);
    const navigate = useNavigate();


    // auth index (index 0 = sign up, index 1 = sign in)
    const [activeAuthIndex, setActiveAuthIndex] = useState(0);
    // final steps index (index 0 = create username, index 1 = travel survey)
    const [finalStepsIndex, setFinalStepsIndex] = useState(0);
    useLayoutEffect(() => {
        setActiveAuthIndex(authControls.index);
        setFinalStepsIndex(0);
        signInFunctions.resetManager();
        signUpFunctions.resetManager();
        pageFunctions.resetControls();
    }, [open]);




    // redux
    const userAuthManager = useSelector((state) => state.userAuth.value);
    const dispatch = useDispatch();

    // page controls (navigation to different user mgmt displays)
    const [isLoading, setIsLoading] = useState(false);
    const [pageControls, setPageControls] = useState({
        createPasswordOpen: false,
        resetPasswordOpen: false,
        signInSignUpOpen: true,
        finalStepsOpen: false,
    });
    const pageFunctions = {
        resetControls: function () {
            setPageControls({
                createPasswordOpen: false,
                signInSignUpOpen: true,
                finalStepsOpen: false,
            });
        },
        openCreatePassword: function () {
            setPageControls({ ...pageControls, createPasswordOpen: true, signInSignUpOpen: false, finalStepsOpen: false, resetPasswordOpen: false });
        },
        openSignInSignUp: function (authIndex) {
            if (authIndex) {
                setActiveAuthIndex(authIndex);
            };
            setPageControls({ ...pageControls, createPasswordOpen: false, signInSignUpOpen: true, finalStepsOpen: false, resetPasswordOpen: false });
        },
        openCreateUsername: function () {
            setPageControls({ ...pageControls, createPasswordOpen: false, signInSignUpOpen: false, finalStepsOpen: true, resetPasswordOpen: false });
        },
        openResetPassword: function () {
            setPageControls({ ...pageControls, createPasswordOpen: false, signInSignUpOpen: false, finalStepsOpen: false, resetPasswordOpen: true });
        },
    };

    // sign up code
    const [signUpManager, setSignUpManager] = useState({
        username: "",
        email: "",
        emailInvalid: false,
        firstName: "",
        lastName: "",
        googleSignIn: false,
        inFirebase: false,
        inDatabase: false,
        usernameIsReady: false,
        userPreferences: {
            landmarks: false,
            nature: false,
            shopping: false,
            food: false,
            nightclub: false,
            relaxation: false,
            entertainment: false,
            arts: false,
        },
        userPreferencesSelected: 0,
    });
    useEffect(() => {
        signUpFunctions.usernameReadyCheck();
    }, [signUpManager.username, signUpManager.firstName, signUpManager.lastName])
    const signUpFunctions = {
        resetManager: function () {
            setSignUpManager({
                username: "",
                email: "",
                emailInvalid: false,
                firstName: "",
                lastName: "",
                googleSignIn: false,
                inFirebase: false,
                inDatabase: false,
                usernameIsReady: false,
                userPreferences: {
                    landmarks: false,
                    nature: false,
                    shopping: false,
                    food: false,
                    nightclub: false,
                    relaxation: false,
                    entertainment: false,
                    arts: false,
                },
                userPreferencesSelected: 0,
            });
        },
        updateEmail: function (e) {
            setSignUpManager({ ...signUpManager, email: e.target.value });
            if (!signUpManager.emailInvalid) return;
            if (!emailIsValid(e.target.value)) return;
            setSignUpManager({ ...signUpManager, emailInvalid: false });
        },
        updatePassword: function (e) {
            setSignUpManager({ ...signUpManager, password: e.target.value });
        },
        updateFirstName: function (e) {
            setSignUpManager({ ...signUpManager, firstName: e.target.value });
            // signUpFunctions.usernameReadyCheck();
        },
        updateLastName: function (e) {
            setSignUpManager({ ...signUpManager, lastName: e.target.value });
            // signUpFunctions.usernameReadyCheck();
        },
        updateUsername: function (e) {
            setSignUpManager({ ...signUpManager, username: e.target.value });
            // signUpFunctions.usernameReadyCheck();
        },
        continueWithEmail: function () {
            if (signUpManager.email && emailIsValid(signUpManager.email)) {
                // continue login (open create password modal)
                pageFunctions.openCreatePassword();
            } else {
                // invalid email
                setSignUpManager({ ...signUpManager, emailInvalid: true });
            };
        },
        passwordMatch: function (confirmPassword) {
            return confirmPassword === signUpManager.password;
        },
        addPreference: function (preference) {
            if (signUpManager.userPreferencesSelected >= 3) {
                alert("You can only select up to 3 preferences");
                return;
            };
            let userPreferencesCopy = { ...signUpManager.userPreferences };
            userPreferencesCopy[preference] = true;
            setSignUpManager({ ...signUpManager, userPreferences: userPreferencesCopy, userPreferencesSelected: signUpManager.userPreferencesSelected + 1 });
        },
        removePreference: function (preference) {
            let userPreferencesCopy = { ...signUpManager.userPreferences };
            userPreferencesCopy[preference] = false;
            setSignUpManager({ ...signUpManager, userPreferences: userPreferencesCopy, userPreferencesSelected: signUpManager.userPreferencesSelected - 1 });
        },
        togglePreference: function (preference) {
            let userPreferencesCopy = { ...signUpManager.userPreferences };
            if (userPreferencesCopy[preference]) {
                signUpFunctions.removePreference(preference);
            } else {
                signUpFunctions.addPreference(preference);
            };
        },
        usernameReadyCheck: function () {
            if (signUpManager.username && signUpManager.firstName && signUpManager.lastName) {
                setSignUpManager({ ...signUpManager, usernameIsReady: true });
            } else {
                setSignUpManager({ ...signUpManager, usernameIsReady: false });
            };
        },
        completeSignUp: function () {
            setIsLoading(true);
            // update firebase profile with username (as displayName)
            updateProfile(auth.currentUser, {
                displayName: signUpManager.username,
                photoURL: "https://i.imgur.com/cf5lgSl.png"
            }).then(() => {
                console.log("firebase user updated...")
                // create firestore name data doc with fname, lname, username - step removed
                // updateFirestoreNameData(auth.currentUser.uid, signUpManager.firstName, signUpManager.lastName, signUpManager.username);
                // console.log("firestore user name data added...")

                // create firestore userpreferences doc for user
                updateFirestorePreferences(auth.currentUser.uid, signUpManager.userPreferences);

                console.log("firestore user preferences added...")
                // update backend with fname, lname, username, and preferences
                const data = {
                    username: signUpManager.username,
                    firstName: signUpManager.firstName,
                    lastName: signUpManager.lastName,
                    preferences: signUpManager.userPreferences
                };
                // axios post request to backend
                // const response = axios.post(url)
                console.log("skipping backend integration of user name data")

                // setUser using auth if needed
                setUser({
                    ...auth.currentUser,
                    firstName: signUpManager.firstName,
                    lastName: signUpManager.lastName,
                    username: signUpManager.username,
                });

                console.log("user state updated.")
                // send email verification
                sendEmailVerification(auth.currentUser);
                console.log("sent verification email")

                // already navigated to dashboard, close modal (wait a second for smoother transition)
                wait(1500).then(() => {
                    setIsLoading(false);
                    onClose();
                });
            })
                .catch((error) => {
                    // what errors could occur? How to resolve them?
                    alert("Something went wrong. Please try again");
                })

        },
    };



    // helper functions
    const updateFirestorePreferences = (userId, preferences) => {
        const docRef = doc(firestore, `userPreferences/${userId}`);
        setDoc(docRef, { ...preferences, uid: userId });
    };
    // step removed from signUpFunctions.completeSignUp
    const updateFirestoreNameData = (userId, fname, lname, username) => {
        const nameData = {
            firstName: fname,
            lastName: lname,
            username: username,
        };
        const docRef = doc(firestore, `nameData/${userId}`);
        setDoc(docRef, nameData);
    };





    // sign in/login code
    const [signInManager, setSignInManager] = useState({
        email: "",
        emailInvalid: false,
        password: "",
        passwordHidden: true,
        passwordInvalid: false,
    });
    const signInFunctions = {
        resetManager: function () {
            setSignInManager({
                email: "",
                password: "",
                passwordHidden: true,
                passwordInvalid: false,
            });
        },
        updateEmail: function (e) {
            setSignInManager({ ...signInManager, email: e.target.value });
            if (!signInManager.emailInvalid) return;
            if (emailIsValid(e.target.value)) {
                setSignInManager({ ...signInManager, email: e.target.value, emailInvalid: false });
            }
        },
        updatePassword: function (e) {
            setSignInManager({ ...signInManager, password: e.target.value });
            if (!signInManager.passwordInvalid) return;
            setSignInManager({ ...signInManager, password: e.target.value, passwordInvalid: false });
        },
        showPassword: function () {
            setSignInManager({ ...signInManager, passwordHidden: false });
        },
        hidePassword: function () {
            setSignInManager({ ...signInManager, passwordHidden: true });
        },
        signInWithEmail: function () {
            let signInManagerCopy = { ...signInManager };
            if (!signInManager.email || !emailIsValid(signInManager.email)) {
                signInManagerCopy.emailInvalid = true;
            };
            if (!signInManager.password) {
                signInManagerCopy.passwordInvalid = true;
            };
            if (signInManagerCopy.emailInvalid || signInManagerCopy.passwordInvalid) {
                setSignInManager(signInManagerCopy);
                return;
            } else {
                signInWithEmailAndPassword(auth, signInManager.email, signInManager.password)
                    .then((userCredentials) => {
                        handleLogin(userCredentials)
                    }).catch((error) => handleLoginError(error.code))
            };
        },
        resetPassword: function () {
            const userEmail = "matramere@gmail.com";
            sendPasswordResetEmail(auth, userEmail)
                .then(() => {
                    alert("Password reset email link has been sent to your email.")
                })
                .catch((error) => {
                    console.log(error)
                })

        },
    };

    // sign in helper functions
    const handleLogin = async (cred) => {
        setIsLoading(true);
        let docRef = await getDoc(doc(firestore, `firstTimeUser/${cred.user.uid}`))
        let firstTimeUser = docRef.data();
        if (!firstTimeUser) {
            setDoc(doc(firestore, `firstTimeUser/${cred.user.uid}`), {
                firstPlaceAdded: true,
                firstSignIn: false
            });
        };
        let prefs = await getDoc(doc(firestore, `userPreferences/${cred.user.uid}`))
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
        setUserPreferences(userPref)
        // window.localStorage.setItem("userData", [cred.user]);
        // window.localStorage.setItem("userPref", [userPref]);
        // window.localStorage.setItem("isLoggedIn", true);
        setUser(cred.user)
        wait(1500).then(() => {
            // check profile is complete - i.e. name data saved in database
            setIsLoading(false);
            navigate('/dashboard');
            onClose();
        });
    };
    const handleLoginError = (error_code) => {
        console.log(error_code)
        if (error_code === "auth/invalid-login-credentials" || error_code === "auth/invalid-credential") {
            alert("Invalid Email/Password combination")
            console.log("Invalid Email/Password combination")
        }
    };


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
                setIsLoading(false);
                onClose()
                navigate('dashboard')
            } else {
                setIsLoading(false);
                onClose()
                navigate('/survey')
            }


            // localStorage.setItem('email', data.user.email)

        })

    }

    // getRedirectResult(auth).then


    if (!open) return null;
    return (
        <>
            <div className="overlay-placeholder">

                <Fade duration={200} className='z-99999' triggerOnce>
                    <div className="overlay"></div>
                    <div className={`auth-modal flx-r ${mobileModeNarrow && "mobileNarrow"}`}>
                        {/* auth modal img */}
                        {!mobileMode &&
                            <div className="auth-modal-imgDiv">
                                <div className="imgDiv florence" data-hidden={pageControls.finalStepsOpen ? "true" : activeAuthIndex === 0 ? "true" : "false"}>
                                    <div className="caption">
                                        <img src="https://i.imgur.com/l4ePvPJ.png" alt="" className="img-xxxsmall" />
                                        <p className='m-0 white-text'>Florence, Italy&nbsp;</p>
                                    </div>
                                    <img src="https://i.imgur.com/GpIeiR3.png" alt="" className="auth-modal-img" />
                                </div>
                                <div className="imgDiv lisbon" data-fadeout={pageControls.finalStepsOpen ? "true" : activeAuthIndex === 1 ? "true" : "false"}>
                                    <div className="caption">
                                        <img src="https://i.imgur.com/l4ePvPJ.png" alt="" className="img-xxxsmall" />
                                        <p className='m-0 white-text'>Lisbon, Portugal&nbsp;</p>
                                    </div>
                                    <img src="https://i.imgur.com/8WWTVLl.png" alt="" className="auth-modal-img" />
                                </div>
                                <div className="imgDiv khlong-sok" data-fadeout={pageControls.finalStepsOpen ? "false" : "true"}>
                                    <div className="caption">
                                        <img src="https://i.imgur.com/l4ePvPJ.png" alt="" className="img-xxxsmall" />
                                        <p className='m-0 white-text'>Khlong Sok, Thailand&nbsp;</p>
                                    </div>
                                    <img src="https://i.imgur.com/jwBTQhl.png" alt="" className="auth-modal-img" />
                                </div>
                            </div>
                        }

                        {/* auth modal content */}
                        <div className={`carousel-window-auth ${mobileMode && "mobile"} ${mobileModeNarrow && "mobileNarrow"}`}>
                            <div id='loadingBox' className={`loadingBox-2 lite z-1000000 w-100 h-100 ${isLoading ? null : "hidden-o"}`}>
                                <Loading innerText={"Logging in..."} />
                            </div>


                            {/* close button */}
                            {!pageControls.finalStepsOpen &&
                                <span onClick={onClose} className={`closeBtn-auth ${mobileModeNarrow ? "mt-4 lightgray-text" : "color-gains"} material-symbols-outlined position-absolute xx-large`}>
                                    close
                                </span>
                            }

                            {/* create password display */}
                            <div id='inner-createPassword' className={`inner-no-flex ${!pageControls.createPasswordOpen && "d-none"}`}>
                                <div className="carousel-item-centered">
                                    <CreatePassword
                                        open={pageControls.createPasswordOpen}
                                        signUpManager={signUpManager}
                                        setSignUpManager={setSignUpManager}
                                        pageFunctions={pageFunctions}
                                        onClose={() => pageFunctions.openSignInSignUp()}
                                    />
                                </div>
                            </div>

                            {/* reset password display */}
                            <div id='inner-resetPassword' className={`inner-no-flex ${!pageControls.resetPasswordOpen && "d-none"}`}>
                                <div className="carousel-item-centered">
                                    <ResetPassword
                                        open={pageControls.resetPasswordOpen}
                                        onClose={() => pageFunctions.openSignInSignUp(1)}
                                    />
                                </div>
                            </div>

                            {/* sign up and sign in display */}
                            <div id='inner' className={`inner w-100  ${!pageControls.signInSignUpOpen && "d-none"}`} style={{ transform: `translateX(-${activeAuthIndex * 100}%)` }}>
                                {/* sign up */}
                                <div className="carousel-item-centered">
                                    <div className={`sign-up-box ${mobileModeNarrow && "mobile"} position-relative ${activeAuthIndex !== 0 && "hidden-o"}`}>

                                        <h1 className={`my-4h ${mobileModeNarrow && "xx-large"}`}>Sign Up</h1>
                                        <button onClick={() => googleSignIn()} className={`btn-outline ${mobileModeNarrow && "mobile"} bg-white position-relative my-1 font-jakarta purple-text`}><img src="https://i.imgur.com/JN3RsNN.png" alt="" className={`btn-icon-left ${mobileModeNarrow && "mobile"}`} /> Sign up with Google</button>
                                        <div className="hr-block w-75 flx-r">
                                            <div className="flx-1 flx-c just-ce">
                                                <hr className='w-100 border-gains' />
                                            </div>
                                            <p className='px-2'><strong>or</strong></p>
                                            <div className="flx-1 flx-c just-ce">
                                                <hr className='w-100 border-gains' />
                                            </div>
                                        </div>
                                        {/* add entry-error or warning class to registerEmail for error feedback */}
                                        <div className="register-email-box" data-warning={signUpManager.emailInvalid}>
                                            <p id='invalidEmail' className="warning-signal">Please enter a valid email</p>
                                            <div className={`inputBox ${mobileModeNarrow && "mobile"} flx-c my-2`}>
                                                <input id='registerEmail' onChange={(e) => signUpFunctions.updateEmail(e)} value={signUpManager.email} type='text' className={`input-model ${mobileModeNarrow && "mobile"}`} required />
                                                <span className='title font-jakarta'>Email</span>
                                            </div>
                                        </div>

                                        <button
                                            id='continueEmail'
                                            onClick={() => signUpFunctions.continueWithEmail()}
                                            onKeyDown={(e) => { if (activeAuthIndex === 0 && e.key === 'Enter') signUpFunctions.continueWithEmail() }}
                                            className={`btn-primary ${mobileModeNarrow && "mobile"} bg-white font-jakarta bg-lightpurple white-text`}
                                        >
                                            Continue with email
                                        </button>
                                        <div className='m-0 small mt-3 font-jakarta dark-text'>Already have an account? <Link onClick={() => { signUpFunctions.resetManager(); setActiveAuthIndex(1) }} className='link-text'><strong>Log In</strong></Link></div>
                                    </div>
                                </div>
                                {/* sign in */}
                                <div className="carousel-item-centered">
                                    <div className={`sign-in-box ${mobileModeNarrow && "mobile"} ${activeAuthIndex !== 1 && "hidden-o"}`}>
                                        <h1 className={`my-4h ${mobileModeNarrow && "xx-large"}`}>Log In</h1>
                                        <button onClick={() => googleSignIn()} className={`btn-outline ${mobileModeNarrow && "mobile"} bg-white purple-text position-relative my-1 font-jakarta`}><img src="https://i.imgur.com/JN3RsNN.png" alt="" className={`btn-icon-left ${mobileModeNarrow && "mobile"}`} /> Log in with Google</button>

                                        <div className="hr-block w-75 flx-r">
                                            <div className="flx-1 flx-c just-ce">
                                                <hr className='w-100 border-gains' />
                                            </div>
                                            <p className='px-2'><strong>or</strong></p>
                                            <div className="flx-1 flx-c just-ce">
                                                <hr className='w-100 border-gains' />
                                            </div>
                                        </div>


                                        <div className={`inputBox ${mobileModeNarrow && "mobile"} my-2`} data-warning={signInManager.emailInvalid}>
                                            <input id='loginEmail' onChange={(e) => signInFunctions.updateEmail(e)} value={signInManager.email} type='text' className={`input-model ${mobileModeNarrow && "mobile"}`} required />
                                            <span className='title font-jakarta'>Email</span>
                                        </div>

                                        <div id='login-password-input' className={`inputBox ${mobileModeNarrow && "mobile"} mb-2`} data-warning={signInManager.passwordInvalid}>
                                            <input id='loginPassword' onChange={(e) => signInFunctions.updatePassword(e)} value={signInManager.password} type={signInManager.passwordHidden ? 'password' : 'text'} className={`input-model ${mobileModeNarrow && "mobile"}`} required />
                                            <span className='title font-jakarta'>Password</span>
                                            {signInManager.passwordHidden ?
                                                <div id='loginPasswordOpen' onClick={() => signInFunctions.showPassword()} className='icon-right flx-c just-ce'><img src="https://i.imgur.com/Lcq4iUU.png" alt="" className="icon-xsmall center o-80" /></div>
                                                :
                                                <div id='loginPasswordClose' onClick={() => signInFunctions.hidePassword()} className='icon-right flx-c just-ce'><img src="https://i.imgur.com/83fYKqe.png" alt="" className="icon-xsmall center o-80" /></div>
                                            }
                                            {/* <div id='loginPasswordOpen' onClick={() => showPassword('loginPassword')} className='icon-right flx-c just-ce'><img src="https://i.imgur.com/yoo70zI.png" alt="" className="icon-xsmall center o-80" /></div> */}
                                            {/* <div id='loginPasswordClose' onClick={() => hidePassword('loginPassword')} className='icon-right flx-c just-ce d-none'><img src="https://i.imgur.com/DkqcKz7.png" alt="" className="icon-xsmall center o-80" /></div> */}
                                        </div>

                                        <button
                                            onClick={() => signInFunctions.signInWithEmail()} id='loginWithEmail'
                                            onKeyDown={(e) => { if (activeAuthIndex === 1 && e.key === 'Enter') signInFunctions.signInWithEmail() }}
                                            className={`btn-primary ${mobileModeNarrow && "mobile"} bg-lightpurple white-text font-jakarta`}
                                        >
                                            Log in with email
                                        </button>
                                        <div className='m-0 small mt-3 font-jakarta dark-text'>Create an account? <Link onClick={() => { signInFunctions.resetManager(); setActiveAuthIndex(0) }} className='link-text'><strong>Sign Up</strong></Link></div>
                                        <div className='m-0 small mt-1 font-jakarta dark-text'><Link onClick={() => { signInFunctions.resetManager(); pageFunctions.openResetPassword() }} className='link-text'><strong>Forgot password</strong></Link></div>

                                    </div>
                                </div>
                            </div>

                            {/* create username and travel preferences display */}
                            {pageControls.finalStepsOpen &&
                                <div className="line-indicators">
                                    <div onClick={() => setFinalStepsIndex(0)} className={`indicator ${finalStepsIndex <= 1 && "active"}`}></div>
                                    <div onClick={() => signUpManager.usernameIsReady && setFinalStepsIndex(1)} className={`indicator ${finalStepsIndex === 1 && "active"}`}></div>
                                </div>
                            }
                            <div id='inner' className={`inner w-100 ${!pageControls.finalStepsOpen && "d-none"}`} style={{ transform: `translateX(-${finalStepsIndex * 100}%)` }}>
                                <div className="carousel-item-centered">
                                    <div className={`create-username-box ${mobileModeNarrow && "mobile"} position-relative ${finalStepsIndex !== 0 && "hidden-o"}`}>

                                        <div className="title-section">
                                            <h1 className="m-0 xx-large">Create username</h1>
                                            <p className='gray-text smedium ws-normal center-text'>Create your unique username.This is how other people on the platform can find you!</p>
                                        </div>

                                        <div className="user-inputs mb-8">
                                            <p className="italic ml-1">Please complete all fields as they are required.</p>
                                            <div className="name-inputs">
                                                <div className={`inputBox ${mobileModeNarrow && "mobile"} my-2 flx-c`}>
                                                    <input id='firstName' onChange={(e) => signUpFunctions.updateFirstName(e)} type="text" className="input-model flexible" required />
                                                    <span className='title font-jakarta'>First Name</span>
                                                </div>
                                                <div className={`inputBox ${mobileModeNarrow && "mobile"} my-2 flx-c`}>
                                                    <input id='lastName' onChange={(e) => signUpFunctions.updateLastName(e)} type="text" className="input-model flexible" required />
                                                    <span className='title font-jakarta'>Last Name</span>
                                                </div>
                                            </div>

                                            <div className="username-box">
                                                <div className={`inputBox ${mobileModeNarrow && "mobile"} flx-c my-2`}>
                                                    <input id='username' onChange={(e) => signUpFunctions.updateUsername(e)} type='text' className={`input-model flexible username ${mobileModeNarrow && "mobile"}`} required />
                                                    <p className='username-prefix'>@</p>
                                                    <span className='title font-jakarta'>Create a username</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="right-text w-100">
                                            <button
                                                className={`btn-primaryflex2 ${mobileModeNarrow && "mobile"} medium`}
                                                data-disabled={!signUpManager.usernameIsReady}
                                                onClick={() => signUpManager.usernameIsReady && setFinalStepsIndex(1)}
                                            >
                                                Continue
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="carousel-item-centered">
                                    <div className={`survey-box ${mobileModeNarrow && "mobile"} ${finalStepsIndex !== 1 && "hidden-o"}`}>
                                        <div className="title-section ws-normal center-text">
                                            <h1 className={`my-2 xx-large`}>Select your travel preferences</h1>
                                            <p className='gray-text smedium'>RouteWise provides recommended places based on your travel preferences.</p>
                                            <p className="red-text smedium">Select up to 3 categories*</p>
                                        </div>

                                        <div className="preference-cards">
                                            {userPreferenceItems.order.map((preference, index) => {
                                                let selected = signUpManager.userPreferences[preference];
                                                return <PreferenceCard
                                                    key={index}
                                                    preference={preference}
                                                    selected={selected}
                                                    toggleSelect={() => signUpFunctions.togglePreference(preference)}
                                                    cardType="landscape"
                                                />
                                            })}
                                        </div>

                                        <div className="flx-r w-100 just-sb">
                                            <button onClick={() => setFinalStepsIndex(0)} className={`btn-outlineflex ${mobileModeNarrow && "mobile"}`}>Back</button>
                                            <button onClick={() => signUpFunctions.completeSignUp()} className={`btn-primaryflex2 ${mobileModeNarrow && "mobile"}`}>Start planning!</button>
                                        </div>

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
