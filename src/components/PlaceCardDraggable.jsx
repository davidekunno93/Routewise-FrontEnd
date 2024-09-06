import React, { useContext, useDebugValue, useEffect, useRef, useState } from 'react'
import { DataContext } from '../Context/DataProvider';
import OpeningHoursMap from './OpeningHoursMap';
import Dropdown from './Dropdown/Dropdown';
import CategoryAndRating from './CategoryAndRating/CategoryAndRating';

export const PlaceCardDraggable = ({ id, place, removePlace, dayId, draggableSnapshot, addPlaceToConfirm, itineraryToSaved, isSavedPlace }) => {
    const { textFunctions, convertInfoToMap, renderRating, gIcon } = useContext(DataContext);




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
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const pointerRef = useRef(null);
    const itemsList = {
        options: [
            {
                itemName: "View on map",
                gIconPrompt: "location_on",
                clickFunction: {
                    function: addPlaceToConfirm,
                    params: [place],
                },
            },
            {
                itemName: isSavedPlace(place) ? "Already in Saved Places" : "Moved to Saved Places",
                gIconPrompt: "bookmark",
                clickFunction: isSavedPlace(place) ? null : {
                    function: itineraryToSaved,
                    params: [dayId, place.id]
                },
                disabled: isSavedPlace(place) ? true : false,
            },
            {
                itemName: "Remove place",
                gIconPrompt: "delete",
                clickFunction: {
                    function: removePlace,
                    params: [dayId, place.id]
                },
                textColor: "red",
            },
        ]
    };


    return (
        <div className="placeCard-box flx-r grabber">
            <div className="drag-icon flx">
                <span className={`${gIcon} m-auto o-20`}>
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
                    <CategoryAndRating 
                    place={place}
                    />
                    {place.info &&
                        <>
                            {place.info.includes(":") ?
                                <OpeningHoursMap
                                    idTree={dayId + "-" + id.toString()}
                                    placeInfo={place.info}
                                // openingHoursObject={convertInfoToMap(place.info)}
                                />
                                :
                                <p className="body-info">{place.info}</p>
                            }
                        </>
                    }
                    {place.summary ?
                        <p className="body-address">{place.summary}</p>
                        :
                        <p className="body-address">{place.address}</p>
                    }
                </div>
                <div className="placeCard-options flx-c just-sb align-c">
                    <Dropdown
                    open={dropdownOpen}
                    itemsList={itemsList}
                    place={place}
                    pointerRef={pointerRef}
                    offsetX={"100%"}
                    onClose={() => setDropdownOpen(false)}
                    />

                    <span ref={pointerRef} id={`itineraryPlaceCardDropper-${dayId + "-" + id}`} onClick={() => setDropdownOpen(!dropdownOpen)} className={`${gIcon} mt-2 o-50 pointer more_vert ${dropdownOpen && "pressed"}`}>
                        more_vert
                    </span>
                    <span onClick={() => removePlace(dayId, place.id)} className={`${gIcon} mb-2 onHover-50 pointer position-bottom`}>
                        delete
                    </span>
                </div>
            </div>
        </div>
    )
}
