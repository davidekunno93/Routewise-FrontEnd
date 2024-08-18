import React, { useContext, useDebugValue, useEffect, useRef, useState } from 'react'
import { DataContext } from '../Context/DataProvider';
import OpeningHoursMap from './OpeningHoursMap';

export const PlaceCardDraggable = ({ id, place, removePlace, dayId, draggableSnapshot, addPlaceToConfirm, itineraryToSaved, isSavedPlace }) => {
    const { textFunctions, convertInfoToMap, renderRating } = useContext(DataContext);

    
    

    const openDropdown = (dayId, id) => {
        const dropdown = document.getElementById(`itineraryPlaceCardDropdown-${dayId + "-" + id}`);
        const btn = document.getElementById(`itineraryPlaceCardDropper-${dayId + "-" + id}`)
        btn.classList.add("pressed");
        dropdown.classList.replace("hidden", "shown");
    }
    const closeDropdown = (dayId, id) => {
        const dropdown = document.getElementById(`itineraryPlaceCardDropdown-${dayId + "-" + id}`);
        const btn = document.getElementById(`itineraryPlaceCardDropper-${dayId + "-" + id}`)
        btn.classList.remove("pressed");
        dropdown.classList.replace("shown", "hidden");
    }
    const toggleDropdown = (dayId, id) => {
        const btn = document.getElementById(`itineraryPlaceCardDropper-${dayId + "-" + id}`)
        if (btn.classList.contains("pressed")) {
            closeDropdown(dayId, id);
        } else {
            openDropdown(dayId, id);
        }
    }

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

                <div onClick={() => addPlaceToConfirm(place)} className="placeCard-img-div flx-2">
                    <div className={`overlay-star-place ${place.favorite ? null : "hidden"}`}>
                        <img src="https://i.imgur.com/3WDs04Z.png" alt="" className="star-img" />
                        <p className="m-0 small gold-text">Priority Location</p>
                    </div>
                    <img className="placeCard2-img" src={place.imgURL} />
                </div>
                <div className="placeCard-body flx-3">
                    {/* <p className="body-title">{place.placeName.length > placeCardTitleCharLimit ? place.placeName.slice(0, placeCardTitleCharLimit)+"..." : place.placeName}</p> */}
                    <p className="body-title">{place.placeName}</p>
                    <div className="align-all-items">
                        <p className="body-category">{place.category ? textFunctions.capitalize(place.category.split(',')[0]) : "No category"}</p>
                        {place.rating &&
                            <>
                                <p className='m-0 x-small mx-1 gray-text'>&bull;</p>
                                <div className="rating">
                                    <p className='score-text'>{place.rating}</p>
                                    {renderRating(place.rating).map((star, index) => {
                                        let noStar = star === 0;
                                        let fullStar = star === 1;
                                        let halfStar = star === 0.5;
                                        return <img key={index} src={`${fullStar ? "https://i.imgur.com/3eEFOjj.png" : noStar ? "https://i.imgur.com/ZhvvgPZ.png" : "https://i.imgur.com/SWExJbv.png"}`} alt="" className="star-img" />
                                    })}

                                </div>
                            </>
                        }

                    </div>
                    {place.info &&
                        <>
                            {place.info.includes(":") ?
                                <OpeningHoursMap openingHoursObject={convertInfoToMap(place.info)} />
                                :
                                <p className="body-info">{place.info}</p>
                            }
                        </>
                    }
                    <p className="body-address">{place.summary ?? place.address}</p>
                </div>
                <div className="placeCard-options flx-c just-sb align-c">
                    {/* <img src="https://i.imgur.com/S0wE009.png" alt="" className="star-empty my-2" /> */}
                    {/* <img src="https://i.imgur.com/HkwkRjn.png" alt="" className={`star-full my-2 ${place.favorite ? null : "hidden"}`} /> */}
                    <div id={`itineraryPlaceCardDropdown-${dayId + "-" + id}`} className="placeCard-menu itinerary hidden">
                        <div onClick={() => { addPlaceToConfirm(place); closeDropdown(dayId, id) }} className="option">
                            <div className="material-symbols-outlined icon">location_on</div>
                            <p className="m-0 text">View on map</p>
                        </div>
                        {isSavedPlace(place.address) ?
                            <div className="option-cold">
                                <div className="material-symbols-outlined icon lightgray-text">bookmark</div>
                                <p className="m-0 text lightgray-text">Already in Saved Places</p>
                            </div>
                            :
                            <div onClick={() => itineraryToSaved(dayId, place.id)} className="option">
                                <div className="material-symbols-outlined icon">bookmark</div>
                                <p className="m-0 text">Move to Saved Places</p>
                            </div>
                        }
                        <div onClick={() => removePlace(dayId, place.id)} className="option">
                            <div className="material-symbols-outlined icon red-text">delete</div>
                            <p className="m-0 text red-text">Remove place</p>
                        </div>
                    </div>
                    <span id={`itineraryPlaceCardDropper-${dayId + "-" + id}`} onClick={() => toggleDropdown(dayId, id)} className="material-symbols-outlined mt-2 o-50 pointer more_vert">
                        more_vert
                    </span>
                    <span onClick={() => removePlace(dayId, place.id)} className="material-symbols-outlined mx- mb-2 onHover-50 pointer position-bottom">
                        delete
                    </span>
                </div>
            </div>
        </div>
    )
}
