import React, { useContext, useDebugValue, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Fade, Slide } from 'react-awesome-reveal';
import { DataContext } from '../Context/DataProvider';
import { auth, firestore } from '../firebase';
import axios from 'axios';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const PassCodeModal = ({ open, onClose }) => {
    if (!open) return null;
    const { repeatItems, timeFunctions } = useContext(DataContext);

    // [onload code]
    useEffect(() => {
        focusOnFirstDigit();
    }, [])

    // [passcode element code]
    const [passcodeInputArr, setPasscodeInputArr] = useState([]);
    const passcodeRef = useRef(null);
    const digitInputRefs = useRef([]);
    const focusOnFirstDigit = () => {
        if (passcodeRef.current) {            
            passcodeRef.current.firstChild.focus()
        }
    }
    const focusNextInput = (e) => {
        // console.log(e.target)
        const element = e.target;
        const nextSibling = element.nextSibling
        const previousSibling = element.previousSibling 
        if (e.key === "Backspace" && previousSibling) {
            if (previousSibling.tagName === "INPUT") {
                previousSibling.focus()
            } else {
                previousSibling.previousSibling.focus()
            }
        }
        if (element.value.length > 0) {
            element.blur()
            if (nextSibling) {
                if (nextSibling.tagName === "INPUT") {
                    nextSibling.focus()
                } else {
                    nextSibling.nextSibling.focus()
                }
            }
        }
    }
    const updatePasscodeInputArr = () => {
        let passcodeInputArrCopy = [];
        for (let i = 0; i < 6; i++) {
            passcodeInputArrCopy.push(digitInputRefs.current[i].value)
        }
        // console.log(passcodeInputArrCopy);
        // console.log(passcodeInputArrCopy.join(""), passcodeInputArrCopy.join("").length)
        setPasscodeInputArr(passcodeInputArrCopy)
    }
    const clearPasscode = () => {
        for (let i = 0; i < 6; i++) {
            digitInputRefs.current[i].value = "";
        }
        setPasscodeInputArr([]);
        focusOnFirstDigit();
    }

    // [send data code]
    const sendData = () => {

    }
    const checkPasscode = async () => {
        const passcodeInput = passcodeInputArr.join("")
        if (passcodeInput.length === 6) {
            if (auth.currentUser) {
                let data = {
                    uid: auth.currentUser.uid,
                    passcode: passcodeInput,
                }
                // send data to Kate
                let url = `https://routewise-backend.onrender.com/auth/check_code/`
                const respose = axios.patch(url, data, {
                    headers: { "Content-Type": "application/json" }
                }).then((response) => {
                    console.log(response.data)
                    // let uid = auth.currentUser.uid
                    // if (response.data === "granted") {
                    //     setDoc(doc(firestore, `itineraryAccess/${uid}`), {
                    //         hasAccess: true,
                    //         timeStamp: timeFunctions.datinormal(new Date(), "dateAndTime")
                    //     })
                    // } else {
                    //     setDoc(doc(firestore, `itineraryAccess/${uid}`), {
                    //         hasAccess: false,
                    //         timeStamp: timeFunctions.datinormal(new Date(), "dateAndTime")
                    //     })
                    // }
                    grantAccessFirebase(response.data);
                }).catch((error) => {
                    console.log(error)
                })
                // console.log(data)
            } else {
                alert("Please sign in to get submit access code")
            }
        }
    }
    useLayoutEffect(() => {
        checkAccessFirebase()
    }, [])
    const checkAccessFirebase = async () => {
        let uid = auth.currentUser.uid;
        let docModel = await getDoc(doc(firestore, `itineraryAccess/${uid}`));
        let docData = docModel.data();
        console.log(docData)
        if (docData) {
            if (docData.hasAccess) {
                // user has itinerary features access
                // change modal display
                setAccessGranted(true);
            }
        }
    }
    const grantAccessFirebase = (message) => {
        let uid = auth.currentUser.uid;
        if (message === "Access granted") {
            setDoc(doc(firestore, `itineraryAccess/${uid}`), {
                hasAccess: true,
                timeStamp: timeFunctions.datinormal(new Date(), "dateAndTime")
            })
            setAccessGranted(true);
        } else {
            setDoc(doc(firestore, `itineraryAccess/${uid}`), {
                hasAccess: false,
                timeStamp: timeFunctions.datinormal(new Date(), "dateAndTime")
            })
            alert("Incorrect access code")
            clearPasscode();
        }
    }

    const [accessGranted, setAccessGranted] = useState(false);

    return (
        <div className="overlay-placeholder">
            <Fade duration={200} triggerOnce>
                <div className="overlay">
                    <Fade delay={100} duration={200} triggerOnce>
                        <Slide direction='up' duration={300} className='vh-100 flx' triggerOnce>
                            <div className="passcode-modal">
                                <div className="closeBtn onHover-darken">
                                    <span onClick={() => onClose()} className="material-symbols-outlined">close</span>
                                </div>
                                {accessGranted ?

                                    <div className="access-granted-content">
                                        <div className="page-subheading-bold mb-4">Access Granted</div>
                                        <div className="access-checkbox">
                                            <span className="material-symbols-outlined white-text xxx-large">done</span>
                                        </div>
                                        <div>
                                            <p className="center-text bold500">You are free to access the itinerary features
                                                of RouteWise. Thank you for being a test user for our product!</p>
                                            <button onClick={() => onClose()} className={`btn-primaryflex large center`}>Done</button>
                                        </div>
                                    </div>
                                    :
                                    <div className="enter-access-content">

                                        <div className="page-subheading-bold">Enter Access Code</div>
                                        <p className="center-text bold500">We've upgraded our map API to enhance your experience.
                                            However, to safeguard our site from bots or misuse of the API, we've added a passcode.
                                            If you have a passcode, please enter it below and keep this code confidential for now.
                                            Thank you for understanding.</p>
                                        <div ref={passcodeRef} className="passcode mb-2">
                                            {repeatItems(6).map((item, index) => {
                                                return <><input key={index} ref={e => digitInputRefs.current[index] = e} onChange={() => updatePasscodeInputArr()} type="text" onKeyUp={(e) => focusNextInput(e)} className="digit-input" maxLength={1} />
                                                    {index === 2 &&
                                                        <p className="m-0 page-subsubheading-bold">-</p>
                                                    }
                                                </>
                                            })}

                                        </div>
                                        <button onClick={() => checkPasscode()} className={`btn-primaryflex large ${passcodeInputArr.join("").length < 6 && "disabled"}`}>Enter</button>

                                    </div>
                                }

                            </div>
                        </Slide>
                    </Fade>
                </div>
            </Fade>
        </div>
    )
}
export default PassCodeModal;