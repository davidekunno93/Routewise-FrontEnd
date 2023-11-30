import React from 'react'

export const PlaceCardDraggable = ({ i, place, removePlace, dayId, draggableSnapshot }) => {
    return (
        <div className="placeCard-box flx-r grabber">
            <div className="drag-icon flx">
                <span className="material-symbols-outlined m-auto o-20">
                    drag_indicator
                </span>
            </div>


            <div className="placeCard w-100 position-relative flx-r my-2" style={{ borderColor: `${draggableSnapshot.isDragging ? "#6663FC" : "gainsboro"}`, boxShadow: `${draggableSnapshot.isDragging ? "0 0 20px rgba(0, 0, 0, 0.1)" : "0 0 0px rgba(0, 0, 0, 0.1)"}` }}>

                <div className="placeCard-img-div flx-1">
                    <img className="placeCard-img" src={place.imgURL} />
                </div>
                <div className="placeCard-body flx-2">
                    <p className="body-title">{place.placeName}</p>
                    <p className="body-info">{place.info}</p>
                    <p className="body-address">{place.address}</p>
                </div>
                <div className="placeCard-starOrDelete flx-c just-en align-c">
                    {/* <img src="https://i.imgur.com/S0wE009.png" alt="" className="star-empty my-2" />
                    <img src="https://i.imgur.com/Bq6COcA.png" alt="" className="star-full my-2 d-none" /> */}
                    <span onClick={() => removePlace(dayId, place.id)} className="material-symbols-outlined mx-3 my-2 onHover-50 pointer">
                        delete
                    </span>
                </div>
            </div>
        </div>
    )
}
