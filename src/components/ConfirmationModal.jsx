import React from 'react'
import { Fade, Slide } from 'react-awesome-reveal';

const ConfirmationModal = ({ open, confirmAction, questionText, descText, confirmOption, rejectOption, onClose }) => {
    if (!open) return null
    return (
        <div className="overlay-placeholder">
            <Fade delay={100} duration={300} triggerOnce>
                <div className="overlay">
                    <Slide duration={300} direction='up' className='h-100 flx' triggerOnce>
                        <div className="confirmation-modal">
                            <div className="">
                                <div className="page-subsubheading-bold">{questionText ?? "Are you sure?"}</div>
                                <p className="">{descText ?? "Please selection an option below."}</p>
                            </div>
                            <div className="buttons flx-r gap-2 position-right">
                                <button onClick={() => confirmAction()} className="btn-primaryflex">{confirmOption ?? "Yes"}</button>
                                <button onClick={() => onClose()} className="btn-outlineflex">{rejectOption ?? "No"}</button>
                            </div>
                        </div>
                    </Slide>
                </div>
            </Fade>
        </div>
    )
}
export default ConfirmationModal;