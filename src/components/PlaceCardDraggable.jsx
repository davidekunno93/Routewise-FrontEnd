import React, { useDebugValue, useEffect, useRef, useState } from 'react'

export const PlaceCardDraggable = ({ id, place, removePlace, dayId, draggableSnapshot, placeCardTitleCharLimit, setPlaceCardTitleCharLimit, cardBodyRef, recenterMap: updateMapCenter }) => {
    // PLACE CARD TITLE ELLIPSIS RE-RENDER CODE
    // const cardBodyRef = useRef(null);
    // const [placeCardTitleCharLimit, setPlaceCardTitleCharLimit] = useState(0);
    const calculateCharLimit = (width) => {
        let extraPercent = (Math.floor((width - 213) / 6)) / 1000;
        let charLimit = Math.floor(width * (0.07 + extraPercent));
        console.log(charLimit)
        return charLimit
    }
    // useEffect(() => {
    //     // first place in first day calculates char limit and mutates charLimit in itinerary
    //     if (cardBodyRef.current && dayId === "day-1" && i === 0) {
    //         const observer = new ResizeObserver((entries) => {
    //             // console.log(cardBodyRef.current)
    //             let width = entries[0].contentRect.width
    //             let charLimit = calculateCharLimit(width)
    //             setPlaceCardTitleCharLimit(charLimit);
    //         })
    //         observer.observe(cardBodyRef.current)
    //     }
    // }, [])


    const isDraggingStyle = {
        borderColor: "#6663FC",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    }
    const isNotDraggingStyle = {
        borderColor: "gainsboro",
        boxShadow: "0 0 0px rgba(0, 0, 0, 0.1)",
    }
    return (
        <div className="placeCard-box flx-r grabber">
            <div className="drag-icon flx">
                <span className="material-symbols-outlined m-auto o-20">
                    drag_indicator
                </span>
            </div>


            {/* <div className="placeCard2 w-100 position-relative flx-r my-2" style={{ borderColor: `${draggableSnapshot.isDragging ? "#6663FC" : "gainsboro"}`, boxShadow: `${draggableSnapshot.isDragging ? "0 0 20px rgba(0, 0, 0, 0.1)" : "0 0 0px rgba(0, 0, 0, 0.1)"}` }}> */}
            <div className="placeCard2 w-100 position-relative flx-r my-2" style={draggableSnapshot.isDragging ? isDraggingStyle : isNotDraggingStyle}>

                <div onClick={() => updateMapCenter(place.geocode)} className="placeCard-img-div flx-2">
                    <div className={`overlay-star-place ${place.favorite ? null : "hidden"}`}>
                        <img src="https://i.imgur.com/3WDs04Z.png" alt="" className="star-img" />
                        <p className="m-0 small gold-text">Priority Location</p>
                    </div>
                    <img className="placeCard2-img" src={place.imgURL} />
                </div>
                <div ref={dayId === "day-1" && id == 0 ? cardBodyRef : null} className="placeCard-body flx-3">
                    {/* <p className="body-title">{place.placeName.length > placeCardTitleCharLimit ? place.placeName.slice(0, placeCardTitleCharLimit)+"..." : place.placeName}</p> */}
                    <p className="body-title">{place.placeName}</p>
                    <p className="body-info">{place.category ? place.category.split(",")[0].charAt(0).toUpperCase() + place.category.split(",")[0].slice(1) : "No category"}</p>
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
