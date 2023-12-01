import React from 'react'

const DaySelected = ({ open, placeToConfirm, dateToConfirm }) => {
    if (!open) return null
    return (
        <div className="daySelected position-absolute white-bg">
            <p className="m-0 mt-3 mb-2 bold700">Added!</p>
            <img className="daySelected-img" src={placeToConfirm.imgURL} />
            <div className="daySelected-text"><span className="purple-text bold700">{placeToConfirm.placeName}</span> was added to <span className="purple-text bold700">{dateToConfirm}</span> in your itinerary!</div>
        </div>
    )
}
export default DaySelected;
