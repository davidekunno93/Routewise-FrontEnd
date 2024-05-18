import React, { useContext } from 'react'
import { Fade, Slide } from 'react-awesome-reveal';
import { DataContext } from '../Context/DataProvider';

const ConfirmationModal = ({ open, confirmAction, questionText, descText, confirmOption, rejectOption, onClose }) => {
    if (!open) return null
    const { mobileMode, mobileModeNarrow } = useContext(DataContext);
    return (
        <div className="overlay-placeholder">
            <Fade delay={100} duration={300} triggerOnce>
                <div className="overlay">
                    <Slide duration={300} direction='up' className='h-100 flx' triggerOnce>
                        <div className="confirmation-modal"style={{ width: mobileModeNarrow ? "90vw" : "" }}>
                            <div className="">
                                <p className={`m-0 ${mobileModeNarrow ? "larger bold700" : "page-subsubheading-bold"}`}>{questionText ?? "Are you sure?"}</p>
                                <p className={`${mobileModeNarrow && "smedium"}`}>{descText ?? "Please selection an option below."}</p>
                            </div>
                            <div className="buttons flx-r gap-2 position-right">
                                <button onClick={() => {confirmAction(); onClose()}} className="btn-primaryflex">{confirmOption ?? "Yes"}</button>
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