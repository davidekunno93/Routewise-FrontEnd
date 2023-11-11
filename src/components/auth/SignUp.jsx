import React, { useState } from 'react'
import { Link } from 'react-router-dom';



export const SignUp = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [emailExpand, setEmailExpand] = useState(false);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const expandPassword = () => {
        if (emailExpand === false) {
            const password_collapsible = document.getElementById('password-collapsible')
            const password_input = document.getElementById('password-input')
            const continueEmail = document.getElementById('continueEmail')
            password_collapsible.style.height = '60px'
            password_input.classList.remove('d-none')
            wait(100).then(() => {
                continueEmail.innerText = 'Sign up with email'
                password_input.classList.remove('o-none')
            })
            setEmailExpand(true)
        }
        if (emailExpand === true) {
            console.log('It is time...')
            signUpWithEmail()
        }
    }

    const updateEmail = (e) => {
        setEmail(e.target.value)
        // console.log(e.target.value)
    }
    const updatePassword = (e) => {
        setPassword(e.target.value)
        // console.log(e.target.value)
    }
    const showPassword = () => {
        const passwordEntry = document.getElementById('password')
        const showPasswordOpen = document.getElementById('showPasswordOpen')
        const showPasswordClose = document.getElementById('showPasswordClose')
        passwordEntry.setAttribute('type', 'text')
        showPasswordOpen.classList.add('d-none')
        showPasswordClose.classList.remove('d-none')
    }
    const hidePassword = () => {
        const passwordEntry = document.getElementById('password')
        const showPasswordOpen = document.getElementById('showPasswordOpen')
        const showPasswordClose = document.getElementById('showPasswordClose')
        passwordEntry.setAttribute('type', 'password')
        showPasswordOpen.classList.remove('d-none')
        showPasswordClose.classList.add('d-none')
    }
    const signUpWithEmail = () => {
        const emailEntry = document.getElementById('email')
        const passwordEntry = document.getElementById('password')
        if (!email) {
            emailEntry.classList.add('entry-error')
        }
        if (!password) {
            passwordEntry.classList.add('entry-error')
        }
    }

    const updateIndex = (newIndex) => {
        setActiveIndex(newIndex)
    }

    


    return (
        <>
            {/* <div className="bg-seethru"></div> */}
            <div className="modal-disabled">
                <div className="carousel-window m-auto mt-6 flx-r position-relative">
                <div className='closeBtn2 position-absolute ml-1h'>
                                close
                                <span class="closeBtn material-symbols-outlined v-align">
                                    expand_more
                                </span>
                            </div>
                    <div id='inner' className="inner" style={{ transform: `translateX(-${activeIndex * 50}%)` }}>
                        <div className='sign-up-box flx-c m-auto position-relative'>
                            {/* <span class="closeBtn material-symbols-outlined position-absolute">
                close
            </span> */}
                            {/* <div className='closeBtn2 position-absolute ml-3'>
                                close
                                <span class="closeBtn material-symbols-outlined v-align">
                                    expand_more
                                </span>
                            </div> */}
                            <h1>Sign Up</h1>
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
                            <div className="inputBox my-2">
                                <input id='email' onChange={(e) => updateEmail(e)} type='text' className='input-model' required />
                                <span className='title font-jakarta'>Email</span>
                            </div>
                            <div id='password-collapsible' className="password-collapsible">
                                <div id='password-input' className="inputBox d-none o-none">
                                    <input id='password' onChange={(e) => updatePassword(e)} type='password' className='input-model' required />
                                    <span className='title font-jakarta'>Password</span>
                                    <div id='showPasswordOpen' onClick={() => showPassword()} className='icon-right flx-c just-ce'><img src="https://i.imgur.com/DkqcKz7.png" alt="" className="icon-xsmall center o-80" /></div>
                                    <div id='showPasswordClose' onClick={() => hidePassword()} className='icon-right flx-c just-ce d-none'><img src="https://i.imgur.com/yoo70zI.png" alt="" className="icon-xsmall center o-80" /></div>
                                </div>
                            </div>
                            <button id='continueEmail' onClick={() => expandPassword()} className='btn-primary bg-white font-jakarta bg-lightpurple white-text'>Continue with email</button>
                            <div className='m-0 small mt-3 font-jakarta'>Already have an account? <Link onClick={() => updateIndex(1)} className='link-text'><strong>Log In</strong></Link></div>
                        </div>
                        <div className="sign-in-box">
                            <h1>Sign In</h1>
                            <button className='btn-outline bg-white purple-text position-relative my-1 font-jakarta'><img src="https://i.imgur.com/JN3RsNN.png" alt="" className="btn-icon-left" /> Sign in with Google</button>
                            <button className='btn-outline bg-white purple-text position-relative my-1 font-jakarta'><img src="https://i.imgur.com/24a8oUQ.png" alt="" className="btn-icon-left" /> Sign in with Facebook</button>
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
                                <input id='email' onChange={(e) => updateLoginEmail(e)} type='text' className='input-model' required />
                                <span className='title font-jakarta'>Email</span>
                            </div>

                            <div id='login-password-input' className="inputBox mb-2">
                                <input id='password-login' onChange={(e) => updateLoginPassword(e)} type='password' className='input-model' required />
                                <span className='title font-jakarta'>Password</span>
                                <div id='showLoginPasswordOpen' onClick={() => showLoginPassword()} className='icon-right flx-c just-ce'><img src="https://i.imgur.com/DkqcKz7.png" alt="" className="icon-xsmall center o-80" /></div>
                                <div id='showLoginPasswordClose' onClick={() => hideLoginPassword()} className='icon-right flx-c just-ce d-none'><img src="https://i.imgur.com/yoo70zI.png" alt="" className="icon-xsmall center o-80" /></div>
                            </div>

                            <button id='loginWithEmail' className='btn-primary bg-lightpurple white-text font-jakarta'>Sign in with email</button>
                            <div className='m-0 small mt-3 font-jakarta'>Create an account? <Link onClick={() => updateIndex(0)} className='link-text'><strong>Sign Up</strong></Link></div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
