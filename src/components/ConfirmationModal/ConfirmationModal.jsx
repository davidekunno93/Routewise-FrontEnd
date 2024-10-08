import React, { forwardRef, useContext } from 'react'
import { Fade, Slide } from 'react-awesome-reveal';
import { DataContext } from '../../Context/DataProvider';
import './confirmationmodal.scoped.css';

const ConfirmationModal = forwardRef(({ open, confirmAction, confirmActionParams, questionText, descText, confirmOption, rejectOption, sideEffectFunction, onClose, confirmationModalProps }, ref) => {
    const { gIcon } = useContext(DataContext);
    if (!open) return null
    if (confirmationModalProps) {
        confirmAction = confirmationModalProps.confirmAction;
        confirmActionParams = confirmationModalProps.confirmActionParams;
        questionText = confirmationModalProps.questionText;
        descText = confirmationModalProps.descText;
        confirmOption = confirmationModalProps.confirmOption;
        rejectOption = confirmationModalProps.rejectOption;
        sideEffectFunction = confirmationModalProps.sideEffectFunction;
    }

    const { mobileModeNarrow } = useContext(DataContext);
    return (
        <div className="overlay-placeholder">
            <Fade delay={100} duration={300} triggerOnce>
                <div className="overlay">
                    <Slide duration={300} direction='up' className='h-100 flx' triggerOnce>
                        <div className="confirmation-modal" style={{ width: mobileModeNarrow ? "90vw" : "" }}>
                            <div onClick={() => onClose()} className="closeBtn">
                                <span className={gIcon}>close</span>
                            </div>
                            <div className="">
                                <p className={`m-0 ${mobileModeNarrow ? "larger bold700" : "page-subsubheading-bold"}`}>{questionText ?? "Are you sure?"}</p>
                                <p className={`${mobileModeNarrow && "smedium"} text`}>{descText ?? "Please select an option below."}</p>
                            </div>
                            <div className="buttons flx-r gap-2 position-right">
                                {confirmActionParams ?
                                    <button onClick={() => { confirmAction(...confirmActionParams); sideEffectFunction && sideEffectFunction(); onClose() }} className="btn-primaryflex">{confirmOption ?? "YES"}</button>
                                    :
                                    <button onClick={() => { confirmAction(); sideEffectFunction && sideEffectFunction(); onClose() }} className="btn-primaryflex2">{confirmOption ?? "YES"}</button>
                                }
                                <button onClick={() => onClose()} className="btn-outlineflex">{rejectOption ?? "NO"}</button>
                            </div>
                        </div>
                    </Slide>
                </div>
            </Fade>
        </div>
    )
})
export default ConfirmationModal;