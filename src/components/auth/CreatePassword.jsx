import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import auth from '../../firebase'
import { AuthLoadingScreen } from './AuthLoadingScreen'

export const CreatePassword = ({ open, showPassword, hidePassword, email, onClose, closeAll }) => {
    if (!open) return null
    const [createPassword, setCreatePassword] = useState('')
    const [displayName, setDisplayName] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const createAccount = () => {
        const nameEntry = document.getElementById('displayName')
        if (displayName) {
            if (validatePassword()) {
                console.log('password validated!!!')
                createUserWithEmailAndPassword(auth, email, createPassword).then((userCredentials) => {
                    console.log(userCredentials)
                }).catch ((error) => {
                    console.log(error.code)
                    console.log(error.message)
                })
                handleSignIn()
            }
        } else {
            nameEntry.classList.add('entry-error')
        }
    }

    const passwordMatch = () => {
        const confirmPassword = document.getElementById('createConfirmPassword');
        if (createPassword === confirmPassword.value) {
            // console.log(true)
            return true;
        } else {
            // console.log(false)
            return false;
        }
        // console.log(createPassword, confirmPassword.value)
    }

    const validatePassword = () => {
        let hasChars = false;
        let hasNumbers = false;
        if (passwordMatch()) {
            if (createPassword.length > 7) {
                let code = ''
                for (let i = 0; i < createPassword.length; i++) {
                    code = createPassword.charCodeAt(i)
                    if (code > 47 && code < 58) {
                        hasNumbers = true;
                    } else if ((code > 64 && code < 91) || (code > 96 && code < 123)) {
                        hasChars = true
                    }
                }
                if (hasChars && hasNumbers) {
                    console.log('password is valid')
                    return true
                } else {
                    console.log('passwords need characters AND numbers')
                    passwordInvalidOpen()
                    passwordMatchInvalidClose()
                    return false
                }
            } else {
                console.log('password must be at least 8 characters long')
                passwordInvalidOpen()
                passwordMatchInvalidClose()
                return false
            }
        } else {
            console.log('passwords do not match')
            passwordMatchInvalidOpen()
            passwordInvalidClose()
            return false
        }


    }
    const passwordInvalidOpen = () => {
        const passwordInvalid = document.getElementById('passwordInvalid');
        passwordInvalid.classList.remove('d-none');
    }
    const passwordInvalidClose = () => {
        const passwordInvalid = document.getElementById('passwordInvalid');
        passwordInvalid.classList.add('d-none');
    }
    const passwordMatchInvalidOpen = () => {
        const matchInvalid = document.getElementById('passwordMatchInvalid')
        matchInvalid.classList.remove('d-none')
    }
    const passwordMatchInvalidClose = () => {
        const matchInvalid = document.getElementById('passwordMatchInvalid')
        matchInvalid.classList.add('d-none')
    }

    const updateCreatePassword = (e) => {
        setCreatePassword(e.target.value);
    }
    const updateDisplayName = (e) => {
        setDisplayName(e.target.value);
    }

    const handleSignIn = () => {
        setIsLoading(true);
    }

    const stopLoading = () => {
        setIsLoading(false);
        onClose()
    }

    const closeAll2 = () => {
        stopLoading()
        closeAll()
    }

    return (
        <>
            <AuthLoadingScreen displayName={displayName} loading={isLoading} onClose={() => stopLoading()} closeAll={closeAll2} />
            <div className="sign-up-part2 flx-c">
                <span onClick={onClose} class="closeBtn material-symbols-outlined position-absolute xx-large color-gains">
                    close
                </span>
                <p className="mb-1 mt-4 center-text xx-large bold700">Welcome to Routewise!</p>
                <p className="m-auto center-text w-90">Enter your name and password to create your account with email <span className="purple-text"><strong>{email}</strong></span></p>
                <div className="input-model-title">
                    <p className="m-0 mt-4 mb-2">What should we call you'?</p>
                </div>
                <div className="inputBox mb-4">
                    <input id='displayName' onChange={(e) => updateDisplayName(e)} type="text" className="input-model large" placeholder='' required />
                    <span className='title font-jakarta'>Name</span>
                </div>
                <div id='passwordMatchInvalid' className="input-model-title d-none">
                    <p className="m-0 small red-text">*Password must match confirm password</p>
                </div>
                <div id='passwordInvalid' className="input-model-title d-none">
                    <p className="m-0 small red-text">*Password must be at least 8 characters long</p>
                    <p className="m-0 small red-text">*Passwords must contain one number and one character</p>
                </div>
                <div className="input-model-title">
                    <p className="m-0 mb-2">Create a password</p>
                </div>
                <div className="inputBox">
                    <input onChange={(e) => updateCreatePassword(e)} id='createPassword' type="password" className="input-model" placeholder='' required />
                    <span className='title font-jakarta'>Password</span>
                    <div id='createPasswordOpen' onClick={() => showPassword('createPassword')} className='icon-right flx-c just-ce'><img src="https://i.imgur.com/DkqcKz7.png" alt="" className="icon-xsmall center o-80" /></div>
                    <div id='createPasswordClose' onClick={() => hidePassword('createPassword')} className='icon-right flx-c just-ce d-none'><img src="https://i.imgur.com/yoo70zI.png" alt="" className="icon-xsmall center o-80" /></div>
                </div>
                <div className="inputBox mt-2">
                    <input id='createConfirmPassword' type="password" className="input-model" placeholder='' required />
                    <span className='title font-jakarta'>Confirm Password</span>
                    <div id='createConfirmPasswordOpen' onClick={() => showPassword('createConfirmPassword')} className='icon-right flx-c just-ce'><img src="https://i.imgur.com/DkqcKz7.png" alt="" className="icon-xsmall center o-80" /></div>
                    <div id='createConfirmPasswordClose' onClick={() => hidePassword('createConfirmPassword')} className='icon-right flx-c just-ce d-none'><img src="https://i.imgur.com/yoo70zI.png" alt="" className="icon-xsmall center o-80" /></div>
                </div>
                <button onClick={() => createAccount()} className="btn-primary center mt-4">Sign me up!</button>
                <p className="small center-text mt-1">Sign up a different way? <Link onClick={onClose}><strong>Go Back</strong></Link> </p>
            </div>
        </>
    )
}
