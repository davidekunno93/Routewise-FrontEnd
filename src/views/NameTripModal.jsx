import React from 'react'

export const NameTripModal = ({ open, onClose }) => {
    if (!open) return null
    return (
        <>
            <div className="overlay"></div>
            <div className="modal">
                <div className="nameTrip-box">
                    <span onClick={onClose} class="closeBtn material-symbols-outlined position-absolute xx-large color-gains">
                        close
                    </span>
                    <div className="xx-large bold700 font-jakarta">
                        Enter a name for your trip to location
                    </div>
                    <input className="input-model italic-placeholder" placeholder='e.g. Spring Break, End of Year Vacation' required />
                    <button className="btn-primaryflex">Create Trip</button>
                </div>
            </div>
        </>
    )
}
