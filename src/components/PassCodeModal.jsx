import React, { useDebugValue, useEffect, useRef } from 'react'
import { Fade, Slide } from 'react-awesome-reveal';

const PassCodeModal = ({ open, onClose }) => {
    if (!open) return null;

    // [passcode element code]
    const passcodeRef = useRef(null);
    const focusNextInput = (e) => {
        // console.log(e.target)
        const element = e.target;
        const nextSibling = element.nextSibling
        const previousSibling = element.previousSibling
        if (element.value.length > 0) {
            if (nextSibling) {
                if (nextSibling.tagName === "INPUT") {
                    console.log("input!")
                    nextSibling.focus()
                } else {
                    nextSibling.nextSibling.focus()
                }
            }
        } else {
            // if (previousSibling) {
            //     if (previousSibling.tagName === "INPUT") {
            //         previousSibling.focus()
            //     } else {
            //         previousSibling.previousSibling.focus()
            //     }
            // }
        }
    }

    // [send data code]
    const sendData = () => {

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
                                <div className="page-subheading-bold">Enter Password</div>
                                <p className="center-text bold500">We've upgraded our map API to enhance your experience.
                                    However, to safeguard our site from bots or misuse of the API, we've added a passcode.
                                    If you have a passcode, please enter it below and keep this code confidential for now.
                                    Thank you for understanding.</p>
                                <div ref={passcodeRef} className="passcode mb-2">
                                    <input type="text" onKeyUp={(e) => focusNextInput(e)} className="digit-input" maxLength={1} />
                                    <input type="text" onKeyUp={(e) => focusNextInput(e)} className="digit-input" maxLength={1} />
                                    <input type="text" onKeyUp={(e) => focusNextInput(e)} className="digit-input" maxLength={1} />
                                    <p className="m-0 page-subsubheading-bold">-</p>
                                    <input type="text" onKeyUp={(e) => focusNextInput(e)} className="digit-input" maxLength={1} />
                                    <input type="text" onKeyUp={(e) => focusNextInput(e)} className="digit-input" maxLength={1} />
                                    <input type="text" onKeyUp={(e) => focusNextInput(e)} className="digit-input" maxLength={1} />
                                </div>
                                <button className="btn-primaryflex large">Enter</button>
                            </div>
                        </Slide>
                    </Fade>
                </div>
            </Fade>
        </div>
    )
}
export default PassCodeModal;