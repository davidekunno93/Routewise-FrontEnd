import React from 'react'
import { Fade } from 'react-awesome-reveal';

const ItineraryUpdatedModal = ({ open, onClose }) => {
    if (!open) return null;

    return (
        <div className="overlay-placeholder">
            <Fade duration={200} triggerOnce>
                <div className="overlay">
                    <div className="go-to-itinerary-modal">
                        <p className="m-0 x-large bold600 center-text">Itinerary updated!</p>
                        <p className="m-0 center-text">Would you like to view your new itinerary?</p>
                        <div className="flx-r just-ce gap-4">
                            <button className="btn-primaryflex">Go to itinerary</button>
                            <button onClick={() => onClose()} className="btn-outlineflex">Later</button>
                        </div>
                    </div>
                </div>
            </Fade>
        </div>
    )
}
export default ItineraryUpdatedModal;