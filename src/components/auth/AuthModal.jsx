import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { CreatePassword } from './CreatePassword';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { DataContext } from '../../Context/DataProvider';
import { getAuth, getRedirectResult, signInWithPopup, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import provider from '../../firebaseGoogle';

export const AuthModal = ({ open, authIndex, onClose }) => {
    if (!open) return null
    const { user, setUser } = useContext(DataContext);
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
                setUser(userCredentials.user)
                navigate('/dashboard')
                onClose()
            }).catch((error) => handleLoginError(error.code))
        }
    }
    const handleLoginError = (error_code) => {
        console.log(error_code)
        if (error_code === "auth/invalid-login-credentials") {
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

    const googleSignIn = () => {
        signInWithPopup(auth, provider).then((data) => {
            // console.log(data.user)
            // console.log(auth.currentUser)
            setUser(data.user)
            onClose()

            // localStorage.setItem('email', data.user.email)

        })

    }

    // getRedirectResult(auth).then


    return (
        <>
            <div className="overlay"></div>
            <div className="modal">
                <CreatePassword showPassword={showPassword} hidePassword={hidePassword} open={createPasswordOpen} email={registerEmail} onClose={() => closeCreatePassword()} closeAll={() => closeAll1()} />
                <div className="carousel-window m-auto mt-4 flx-r position-relative">
                    <span onClick={onClose} className="closeBtn material-symbols-outlined position-absolute xx-large color-gains">
                        close
                    </span>
                    <div id='inner' className="inner" style={{ transform: `translateX(-${activeIndex * 50}%)` }}>
                        <div className='sign-up-box flx-c m-auto position-relative'>

                            <h1 className='mt-4'>Sign Up</h1>
                            <button className='btn-outline bg-white position-relative my-1 font-jakarta purple-text'><img src="https://i.imgur.com/JN3RsNN.png" alt="" className="btn-icon-left" /> Sign up with Google</button>
                            <button className='btn-outline bg-white position-relative my-1 font-jakarta purple-text'><img src="https://i.imgur.com/24a8oUQ.png" alt="" className="btn-icon-left" /> Sign up with Facebook</button>
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
                            <div className="inputBox my-2">
                                <input id='registerEmail' onChange={(e) => updateRegisterEmail(e)} type='text' className='input-model' required />
                                <span className='title font-jakarta'>Email</span>
                            </div>

                            <button id='continueEmail' onClick={() => continueWithEmail()} className='btn-primary bg-white font-jakarta bg-lightpurple white-text'>Continue with email</button>
                            <div className='m-0 small mt-3 font-jakarta dark-text'>Already have an account? <Link onClick={() => updateIndex(1)} className='link-text'><strong>Log In</strong></Link></div>
                        </div>
                        <div className="sign-in-box m-auto">
                            <h1 className='mt-4'>Sign In</h1>
                            <Link onClick={() => googleSignIn()}><button className='btn-outline bg-white purple-text position-relative my-1 font-jakarta'><img src="https://i.imgur.com/JN3RsNN.png" alt="" className="btn-icon-left" /> Sign in with Google</button></Link>
                            <button target="_blank" className='btn-outline bg-white purple-text position-relative my-1 font-jakarta'><img src="https://i.imgur.com/24a8oUQ.png" alt="" className="btn-icon-left" /> Sign in with Facebook</button>
                            <div className="hr-block w-75 flx-r">
                                <div className="flx-1 flx-c just-ce">
                                    <hr className='w-100 border-gains' />
                                </div>
                                <p className='px-2'><strong>or</strong></p>
                                <div className="flx-1 flx-c just-ce">
                                    <hr className='w-100 border-gains' />
                                </div>
                            </div>

                            <div className="inputBox my-2">
                                <input id='loginEmail' onChange={(e) => updateLoginEmail(e)} type='text' className='input-model' required />
                                <span className='title font-jakarta'>Email</span>
                            </div>

                            <div id='login-password-input' className="inputBox mb-2">
                                <input id='loginPassword' onChange={(e) => updateLoginPassword(e)} type='password' className='input-model' required />
                                <span className='title font-jakarta'>Password</span>
                                <div id='loginPasswordOpen' onClick={() => showPassword('loginPassword')} className='icon-right flx-c just-ce'><img src="https://i.imgur.com/DkqcKz7.png" alt="" className="icon-xsmall center o-80" /></div>
                                <div id='loginPasswordClose' onClick={() => hidePassword('loginPassword')} className='icon-right flx-c just-ce d-none'><img src="https://i.imgur.com/yoo70zI.png" alt="" className="icon-xsmall center o-80" /></div>
                            </div>

                            <button onClick={() => signInWithEmail()} id='loginWithEmail' className='btn-primary bg-lightpurple white-text font-jakarta'>Sign in with email</button>
                            <div className='m-0 small mt-3 font-jakarta dark-text'>Create an account? <Link onClick={() => updateIndex(0)} className='link-text'><strong>Sign Up</strong></Link></div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
