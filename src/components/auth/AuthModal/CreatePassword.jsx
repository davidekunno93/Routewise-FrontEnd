import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../../../firebase'
import { AuthLoadingScreen } from '../AuthLoadingScreen'
import { DataContext } from '../../../Context/DataProvider'
import './createpassword.scoped.css';
import axios from 'axios'
import LoadingFillElement from '../../Loading/LoadingFillElement'

export const CreatePassword = ({ open, signUpManager, setSignUpManager, pageFunctions, onClose }) => {
    if (!open) return null;
    const { mobileMode } = useContext(DataContext);
    // const [displayName, setDisplayName] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    const [createPasswordControls, setCreatePasswordControls] = useState({
        password: "",
        confirmPassword: "",
        passwordHidden: true,
        confirmPasswordHidden: true,
        passwordMatchError: false,
        passwordInvalid: false,
        passwordMinChars: 8,
    });
    const createPasswordFunctions = {
        confirmPasswordMatch: function () {
            return createPasswordControls.confirmPassword === createPasswordControls.password;
        },
        showPassword: function () {
            setCreatePasswordControls({ ...createPasswordControls, passwordHidden: false });
        },
        hidePassword: function () {
            setCreatePasswordControls({ ...createPasswordControls, passwordHidden: true });
        },
        showConfirmPassword: function () {
            setCreatePasswordControls({ ...createPasswordControls, confirmPasswordHidden: false });
        },
        hideConfirmPassword: function () {
            setCreatePasswordControls({ ...createPasswordControls, confirmPasswordHidden: true });
        },
        passwordIsValid: function () {
            // check password matches confirm password
            if (!createPasswordFunctions.confirmPasswordMatch()) {
                setCreatePasswordControls({ ...createPasswordControls, passwordMatchError: true });
                return false;
            };
            // check password length and characters - at least 8 characters with numbers and letters
            let hasLetters = false;
            let hasNumbers = false;
            if (createPasswordControls.password.length >= createPasswordControls.passwordMinChars) {
                let code = ''
                let password = createPasswordControls.password;
                for (let i = 0; i < password.length; i++) {
                    code = password.charCodeAt(i);
                    if (code > 47 && code < 58) {
                        hasNumbers = true;
                    } else if ((code > 64 && code < 91) || (code > 96 && code < 123)) {
                        hasLetters = true;
                    };
                };
                // validation passed
                if (hasLetters && hasNumbers) {
                    console.log('password is valid')
                    return true;
                } else {
                    console.log('passwords need characters AND numbers')
                    setCreatePasswordControls({ ...createPasswordControls, passwordInvalid: true, passwordMatchError: false });
                    return false;
                };
            } else {
                console.log('password must be at least 8 characters long')
                setCreatePasswordControls({ ...createPasswordControls, passwordInvalid: true, passwordMatchError: false });
                return false;
            };
        },
        updatePassword: function (e) {
            setCreatePasswordControls({ ...createPasswordControls, password: e.target.value });
        },
        updateConfirmPassword: function (e) {
            setCreatePasswordControls({ ...createPasswordControls, confirmPassword: e.target.value });
        },
    };


    const createUserAccount = () => {
        if (createPasswordFunctions.passwordIsValid()) {
            console.log('password valid')
            setIsLoading(true);
            createUserWithEmailAndPassword(auth, signUpManager.email, createPasswordControls.password)
                .then(async (userCredentials) => {
                    console.log("firebase user created", userCredentials);
                    setSignUpManager({ ...signUpManager, inFirebase: true });

                    // create user in database
                    let data = await createUserInDatabase(userCredentials);
                    console.log("database returned:", data);
                    setSignUpManager({ ...signUpManager, inDatabase: true });


                    // navigate to name/username creation
                    setIsLoading(false);
                    pageFunctions.openCreateUsername();

                }).catch((error) => {
                    console.log(error.code)
                    setIsLoading(false);
                    handleSignUpError(error.code)
                });
        };
    };

    const handleSignUpError = (errorCode, errorMessage) => {
        if (errorCode === 'auth/email-already-in-use') {
            alert(errorMessage ?? "There is an account already created with this email")
        };
        if (!errorCode) {
            alert(errorMessage ?? "Something went wrong. Please try again later.");
        };
        if (signUpManager.inFirebase) {
            // delete firebase authenticated user
            deleteUser(auth.currentUser).then(() => {
                console.log("user deleted");
            });
            setSignUpManager({ ...signUpManager, inFirebase: false });
        };
    };
    const createUserInDatabase = async (userCredentials) => {
        const data = {
            uid: userCredentials.user.uid,
            displayName: userCredentials.user.displayName ?? "",
            email: userCredentials.user.email,
            // photoURL: userCredentials.photoURL
        }
        console.log("userCreds to send", data);
        const response = await axios.post("https://routewise-backend.onrender.com/profile/user", JSON.stringify(data), {
            headers: { "Content-Type": "application/json" }
        })
        return response.status === 200 ? { message: "user created", status: 200 } : handleSignUpError(response, "Account creation was unsuccessful. Please try again later.")

    }







    // UPDATE STATES

    // open is loading component for more operational work
    const handleSignIn = () => {
        setIsLoading(true);
    }

    const stopLoading = () => {
        setIsLoading(false);
        onClose()
    }


    // stop loading screen and close this modal (if account creation is successful or if email already in use?)
    const closeAll2 = () => {
        stopLoading()
        onClose();
    }

    return (
        <>

            <div className={`create-password ${mobileMode && "mobile"}`}>
                {isLoading &&
                    <LoadingFillElement
                        innerText={"Initializing your account..."}
                        color={"whitelite"}
                        fadeIn
                        noMascot
                    />
                }
                {/* <AuthLoadingScreen displayName={displayName} loading={isLoading} onClose={() => stopLoading()} closeAll={closeAll2} /> */}
                {/* <span onClick={onClose} class="closeBtn-auth material-symbols-outlined position-absolute xx-large color-gains">
                    close
                </span> */}
                <div className="title-section">
                    <p id='welcomeToRoutewise' className="center-text xx-large bold700">Continue with email</p>
                    <p className="center-text w-90">Sign up with email <span className="purple-text"><strong>{signUpManager.email}</strong></span></p>
                </div>
                {/* <div className="input-model-title">
                    <p className="m-0 mt-4 mb-2">What should we call you?</p>
                </div> */}
                {/* <div className="inputBox mb-4">
                    <input id='displayName' onChange={(e) => updateDisplayName(e)} type="text" className="input-model large" placeholder='' required />
                    <span className='title font-jakarta'>Name</span>
                </div> */}
                <div id='passwordMatchInvalid' className={`input-model-title ${!createPasswordControls.passwordMatchError && "d-none"}`}>
                    <p className="m-0 small red-text">*Password must match confirm password</p>
                </div>
                <div id='passwordInvalid' className={`input-model-title ${!createPasswordControls.passwordInvalid && "d-none"}`}>
                    <p className="m-0 small red-text">*Password must be at least 8 characters long</p>
                    <p className="m-0 small red-text">*Passwords must contain one number and one character</p>
                </div>
                <div className="input-model-title">
                    <p className="m-0 mb-2">Create a password</p>
                </div>
                <div className="inputBox">
                    <input onChange={createPasswordFunctions.updatePassword} id='createPassword' type={createPasswordControls.passwordHidden ? "password" : "text"} className="input-model" placeholder='' required />
                    <span className='title font-jakarta'>Password</span>
                    {createPasswordControls.passwordHidden ?
                        <div id='createPasswordOpen' onClick={() => createPasswordFunctions.showPassword()} className='icon-right flx-c just-ce'><img src="https://i.imgur.com/Lcq4iUU.png" alt="" className="icon-xsmall center o-80" /></div>
                        :
                        <div id='createPasswordClose' onClick={() => createPasswordFunctions.hidePassword()} className='icon-right flx-c just-ce'><img src="https://i.imgur.com/83fYKqe.png" alt="" className="icon-xsmall center o-80" /></div>
                    }
                </div>
                <div className="inputBox mt-2">
                    <input id='createConfirmPassword' onChange={createPasswordFunctions.updateConfirmPassword} type={createPasswordControls.confirmPasswordHidden ? "password" : "text"} className="input-model" placeholder='' required />
                    <span className='title font-jakarta'>Confirm Password</span>
                    {createPasswordControls.confirmPasswordHidden ?
                        <div id='createConfirmPasswordOpen' onClick={() => createPasswordFunctions.showConfirmPassword()} className='icon-right flx-c just-ce'><img src="https://i.imgur.com/Lcq4iUU.png" alt="" className="icon-xsmall center o-80" /></div>
                        :
                        <div id='createConfirmPasswordClose' onClick={() => createPasswordFunctions.hideConfirmPassword()} className='icon-right flx-c just-ce'><img src="https://i.imgur.com/83fYKqe.png" alt="" className="icon-xsmall center o-80" /></div>
                    }
                </div>
                <button onClick={() => createUserAccount()} className="btn-primary center mt-4">Join RouteWise</button>
                <p className="small center-text mt-1">Sign up a different way? <Link onClick={onClose}><strong>Go Back</strong></Link> </p>
            </div>

        </>
    )
}
