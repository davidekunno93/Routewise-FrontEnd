import React, { useContext, useDebugValue, useEffect, useRef, useState } from 'react'
import { Fade, Slide } from 'react-awesome-reveal';
import { DataContext } from '../Context/DataProvider';
import { auth } from '../firebase';

const PassCodeModal = ({ open, onClose }) => {
    if (!open) return null;
    const { repeatItems } = useContext(DataContext);

    // [onload code]
    useEffect(() => {
        passcodeRef.current.firstChild.focus()
    }, [])

    // [passcode element code]
    const [passcodeInputArr, setPasscodeInputArr] = useState([]);
    const passcodeRef = useRef(null);
    const digitInputRefs = useRef([]);
    const focusNextInput = (e) => {
        // console.log(e.target)
        const element = e.target;
        const nextSibling = element.nextSibling
        const previousSibling = element.previousSibling
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

    // [send data code]
    const sendData = () => {

    }
    const checkPasscode = async () => {
        const passcodeInput = passcodeInputArr.join("")
        if (passcodeInput.length === 6) {
            if (auth.currentUser) {
                let data = {
                    passcode: passcodeInput,
                }
                // send data to Kate
                console.log(data)
            } else {
                alert("Please sign in to get submit access code")
            }
        }
    }
    const checkAccessFirebase = () => {

    }
    const grantAccessFirebase = () => {

    }

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
                                    {/* <input type="text" onKeyUp={(e) => focusNextInput(e)} className="digit-input" maxLength={1} />
                                    <input type="text" onKeyUp={(e) => focusNextInput(e)} className="digit-input" maxLength={1} />
                                    <input type="text" onKeyUp={(e) => focusNextInput(e)} className="digit-input" maxLength={1} />
                                    <p className="m-0 page-subsubheading-bold">-</p>
                                    <input type="text" onKeyUp={(e) => focusNextInput(e)} className="digit-input" maxLength={1} />
                                    <input type="text" onKeyUp={(e) => focusNextInput(e)} className="digit-input" maxLength={1} />
                                    <input type="text" onKeyUp={(e) => focusNextInput(e)} className="digit-input" maxLength={1} /> */}
                                </div>
                                <button onClick={() => checkPasscode()} className={`btn-primaryflex large ${passcodeInputArr.join("").length < 6 && "disabled"}`}>Enter</button>
                            </div>
                        </Slide>
                    </Fade>
                </div>
            </Fade>
        </div>
    )
}
export default PassCodeModal;