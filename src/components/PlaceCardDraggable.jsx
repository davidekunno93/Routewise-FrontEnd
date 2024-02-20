import React from 'react'

export const PlaceCardDraggable = ({ i, place, removePlace, dayId, draggableSnapshot }) => {
    return (
        <div className="placeCard-box flx-r grabber">
            <div className="drag-icon flx">
                <span className="material-symbols-outlined m-auto o-20">
                    drag_indicator
                </span>
            </div>


            <div className="placeCard2 w-100 position-relative flx-r my-2" style={{ borderColor: `${draggableSnapshot.isDragging ? "#6663FC" : "gainsboro"}`, boxShadow: `${draggableSnapshot.isDragging ? "0 0 20px rgba(0, 0, 0, 0.1)" : "0 0 0px rgba(0, 0, 0, 0.1)"}` }}>

                <div className="placeCard-img-div flx-2">
                    <div className={`overlay-star-place ${place.favorite ? null : "hidden"}`}>
                        <img src="https://i.imgur.com/3WDs04Z.png" alt="" className="star-img" />
                        <p className="m-0 small gold-text">Priority Location</p>
                    </div>
                    <img className="placeCard2-img" src={place.imgURL} />
                </div>
                <div className="placeCard-body flx-3">
                    <p className="body-title">{place.placeName}</p>
                    <p className="body-info">{place.info}</p>
                    <p className="body-address">{place.address}</p>
                </div>
                <div className="placeCard-starOrDelete flx-c just-sb align-c">
                    {/* <img src="https://i.imgur.com/S0wE009.png" alt="" className="star-empty my-2" /> */}
                    {/* <img src="https://i.imgur.com/HkwkRjn.png" alt="" className={`star-full my-2 ${place.favorite ? null : "hidden"}`} /> */}
                    <span className="material-symbols-outlined my-2 o-50">
                        more_vert
                    </span>
                    <span onClick={() => removePlace(dayId, place.id)} className="material-symbols-outlined mx-3 my-2 onHover-50 pointer position-bottom">
                        delete
                    </span>
                </div>
            </div>
        </div>
    )
}
